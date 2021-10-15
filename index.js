const dotenv = require('dotenv').config();
const { AkahuClient } = require('akahu');
const express = require('express');

const appToken = process.env.FULL_APP_TOKEN;
const appSecret = process.env.FULL_APP_SECRET;
const userToken = process.env.BEARER;
const xTokenId = process.env.X_AKAHU_ID;

const akahu = new AkahuClient({ appToken, appSecret });

async function transfer({ amount, from, to, }) {
    let completed = {};
    await akahu.accounts.get(userToken, from)
        .then(async (account) => {
            if (account.balance.available >= amount) {
                await akahu.transfers.create(userToken, { amount, from, to, })
                console.log(`Transferred $${amount} to ${account.name}`)
                completed.transferred = true;
                completed.msg = `Transferred $${amount} to ${account.name}`;
            }
            else {
                console.log('Insufficient funds')
                completed.transferred = false;
                completed.msg = `Insufficient funds`;
            }
        })
    return completed;
}

const app = express()

app.get('/api/accounts', express.json(), async (req, res) => {
    console.log('Getting accounts.')
    const accounts = await akahu.accounts.list(userToken);
    res.send(accounts)
})

app.get('/api/user', express.json(), async (req, res) => {
    const user = await akahu.users.get(userToken);
    res.send(user)
})

app.get('/api/transfers', express.json(), async (req, res) => {
    const transfers = await akahu.transfers.list(userToken, query);
    res.send(transfers)
})

app.post('/api/transfer', express.json(), async (req, res) => {
    const data = req.body;
    console.log(data)
    res.send(await transfer(data))
})

app.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log(req.headers)
    console.log(req.body)

    const signature = req.headers['x-akahu-signature'];
    const keyId = req.headers['x-akahu-signing-key'];
    const data = req.body;

    console.log(signature)
    console.log(keyId)

    let payload;
    try {
        payload = await akahu.webhooks.validateWebhook(keyId, signature, data);
    } catch (e) {
        console.log(`Webhook validation failed: ${e.message}`);
        return res.status(400).send(e.message);
    }

    // Handle payload
    const { webhook_type, webhook_code, ...params } = payload;

    console.log(`Received webhook type: '${webhook_type}', code: ${webhook_code}:`);
    console.log(params);

    // Return a 200 response to acknowledge receipt of the webhook
    console.log('Acknowledging webhook.')
    res.sendStatus(200);
});

const PORT = 7000;
app.listen(PORT, () => {
    console.log(`Express server: ${PORT}`)
})
