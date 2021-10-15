import { useEffect, useState } from 'react';
import axios from 'axios';

//Material-ui
import { Theme, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps, Color } from '@material-ui/lab/Alert';

//Icons
import SearchIcon from '@material-ui/icons/Search';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

//Components
import ContactListComponent from '../ContactListComponent/ContactListComponent';
import ContactAddButton from '../ContactListAddComponent/ContactListAddComponent';
import ContactAddModal from '../ContactAddModal/ContactAddModal';
import ContactProfile from '../ContactProfileComponent/ContactProfileComponent';
import StartScreen from '../StartScreen/StartScreen'

import Contact from '../Contact/Contact';
import AlertInterface from '../Alert/Alert';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const drawerWidth = '240';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    fontFamily: "RawlineSemiBold !important",
    backgroundColor: theme.palette.background.default,
    height: "100vh"
  },
  title: {
    color: theme.palette.text.primary,
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
  },
  drawer: {
    maxWidth: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: "20px",
    marginBottom: "0px",
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    height: "auto",
    color: theme.palette.text.secondary,
  },
  addressbook: {
    backgroundColor: "white",
    height: "100%"
  },
  container: {
    height: "100%"
  },
  disconnectButton: {
    borderRadius: "21.5px",
    border: "1px solid #F15A29",
    boxSizing: "border-box",
    color: "#F15A29",
    fontSize: "12px",
    fontStyle: "normal",
    lineHeight: "18px",
    letterSpacing: "0px",
    textAlign: "left",
    position: "fixed",
    bottom: theme.spacing(2),
  },
  sideNav: {
    backgroundColor: "#242424",
    color: "#fcfcfc",
    height: "100%"
  }
}));

if (!localStorage.getItem('addressbook')) {
  localStorage.setItem('addressbook', JSON.stringify([]))
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AddressBook() {
  const classes = useStyles();

  const [isInitialized, setInitialized] = useState<boolean>(false);
  const [isConnected, setConnected] = useState<boolean>(false);

  const [alertMsg, setAlertMsg] = useState<string>(''); //Change type
  const [hasAlert, setAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<Color>("error")

  const [profile, setProfile] = useState<any>(<StartScreen status={'Welcome!'} />); //Change type
  const [addressBook, setAddressBook] = useState<Contact[]>([]); //Change type
  const [searchValue, setSearchValue] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalValues, setModalValues] = useState<Contact>({ id: 'string', name: 'string', balance: 0, available: 0, logo: '', bank_no: '', transactions: [] })
  const [userId, setUserId] = useState<string>('');
  const [edit, setEdit] = useState<boolean>(false);

  const [transfers, setTransfers] = useState<any[]>([]);

  const handleAlert = (o: AlertInterface) => {
    console.log(o);
    setAlertMsg(`${o.message}`);
    setAlertType(o.type);
    setAlert(true);
  }

  const handleCloseAlert = () => {
    setAlert(false);
  }

  const handleContacts = async (contacts: Contact[]) => {
    setAddressBook(contacts);
  }

  const handleContactClick = async (e: Contact) => {
    handleProfile(e)
    setModalValues(e)
    setUserId(e.id)
  }

  const handleProfile = (e: Contact) => {
    setProfile(
      <ContactProfile
        transactions={transfers}
        handleSend={handleSend}
        available={e.available}
        handleAlert={handleAlert}
        id={e.id}
        name={e.name}
        bank_no={e.bank_no}
        logo={e.logo}
        handleEdit={handleEditModal}
        handleClose={handleCloseProfile} availableAmount={0} balance={0} />
    )
  }

  const handleOpenModal = () => { setOpenModal(true) }

  const handleCloseModal = () => { setOpenModal(false) }

  const handleSubmitModal = (e: any) => {
    let currContacts = JSON.parse(localStorage.getItem('addressbook') || '[]')
    console.log(edit, e)
    let user = e;
    if (!edit) {
      user.id = userId;
      setUserId(user.id + 1);
      currContacts.push(user);

    } else {
      user.id = userId;
      currContacts[userId] = user;
    }
    handleContacts(currContacts)
    localStorage.setItem('addressbook', JSON.stringify(currContacts))
    handleProfile(user)
    setModalValues(user)
    handleCloseModal();
  }

  const handleAddModal = () => {
    setEdit(false);
    setModalTitle('Add Contact')
    handleOpenModal();
  }

  const handleEditModal = () => {
    setEdit(true)
    setModalTitle('Edit Contact')
    handleOpenModal()
  }

  const handleCloseProfile = () => {
    setProfile(<StartScreen status={'Select a contact'} />)
  }

  const handleDeleteContact = () => {
    let contacts: Contact[] = [];

    addressBook.map(contact => {
      if (contact.id !== userId)
        contacts.push(contact)
    })

    handleContacts(contacts);
    setProfile(<StartScreen status={'Select a contact'} />)
    localStorage.setItem('addressbook', JSON.stringify(contacts))
    handleAlert({ code: 20, message: `Deleted contact ${userId}`, type: "success" })
    handleCloseModal();
  }

  const handleSend = async (opts: { amount: number, fromAccount: string, toAccount: string }) => {
    console.log(opts)
    alert(`from: ${opts.fromAccount} to: ${opts.toAccount} amount: ${opts.amount}`)

    try {
      await axios.post('/api/transfer', {
        amount: opts.amount,
        from: opts.fromAccount,
        to: opts.toAccount,
      })
        .then((res: any) => {
          const data: any = res.data;
          handleAlert({ code: 200, message: data.msg, type: "success" })
          //Update balances here
        })
    } catch (error: any) {
      handleAlert({ code: 102, message: error.message, type: "error" })
    }
  }

  const handleWebhook = async () => {
    const opts: any = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer user_token_ckuqbcunj000009lg595wf2ed',
        'X-Akahu-Id': 'app_token_ckungrgxe000109mi7891ebrt'
      },
      url: '/api/akahu-webhook',
    }

    try {
      await axios(opts)
        .then((res: any) => {
          const data: any = res.data;
          handleAlert({ code: 200, message: data.msg, type: "success" })
          //Update balances here
        })
    } catch (error: any) {
      handleAlert({ code: 102, message: error.message, type: "error" })
    }
  }

  //Init useEffect
  useEffect(() => {
    if (!isConnected && !isInitialized) {

      const fetchAccounts: any = async () => {
        console.log('Fetching accounts')
        const accounts = await axios.get('/api/accounts').then(res => {
          return res.data;
        })

        const transfers = await axios.get('/api/transfers').then(res => {
          return res.data;
        })

        setTransfers(transfers)

        console.log(accounts)
        return accounts;
      }

      const initializePage = async (accounts: any[]) => {
        setInitialized(true);
        setConnected(true);
        setAlertMsg('Connected to Akahu!')
        setAlertType("success")
        setAlert(true)
        console.log(accounts)

        let accs: Contact[] = [];

        for (let i = 0; i < accounts.length; i++) {
          let c: Contact = { id: 'string', name: 'string', balance: 0, available: 0, logo: '', bank_no: '', transactions: [] };
          c.id = accounts[i]._id;
          c.name = accounts[i].name;
          c.balance = accounts[i].balance.current;
          c.available = accounts[i].balance.available;
          c.bank_no = accounts[i].formatted_account;
          c.logo = accounts[i].connection.logo;
          accs.push(c)
        }
        handleContacts(accs)
      }

      fetchAccounts()
        .then(initializePage)
        .catch(handleAlert);
    }

  }, [isConnected, isInitialized])

  //Searchbar useEffect 
  useEffect(() => {

    let results: Contact[] = []
    addressBook.map(contact => {
      if (contact.name.includes(searchValue))
        results.push(contact);
    })

    console.log(results);
    handleContacts(results)

    setAlertMsg('Not Implemented!')
    setAlertType("error")
    setAlert(true)
  }, [searchValue])

  return (
    <Container
      disableGutters={true}
      maxWidth={"xl"}
      className={classes.root}
      style={{ margin: "-4px" }}
    >

      <ContactAddModal
        open={openModal}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmitModal}
        handleDelete={handleDeleteContact}
        title={modalTitle}
        onError={handleAlert}
        values={modalValues}
        isEdit={edit}
      />

      <Grid
        container
        spacing={1}
      >
        <Grid item xs={2}>
          <Toolbar className={classes.toolbar}>
            Address book
          </Toolbar>
          <Divider />
          <List>
            <ListItem button key={'contacts'}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={'Address Book'} onClick={handleWebhook} />
            </ListItem>
          </List>
          <Divider />
          <List>
            {['Accounts', 'Contracts', 'ENS'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={10}>
          <Grid
            className={classes.container}
            container
            spacing={1}
          >
            <AppBar position="static" elevation={0} className={classes.appBar}>
              <Toolbar className={classes.toolbar}>
              </Toolbar>
              <Divider />
            </AppBar>

            <Grid item xs={4} className={classes.addressbook}>
              <TextField
                label="Contact"
                placeholder="Search, name, account number, or _id"
                helperText="Full width!"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                inputProps={{
                  style: {
                    fontSize: "14px",
                    maxHeight: "15px",
                  }
                }}
              />

              <List component="nav" aria-label="">
                <ContactAddButton onClick={handleAddModal} />
                {addressBook.map(contact => {
                  return (<ContactListComponent
                    bank_no={contact.bank_no}
                    name={contact.name}
                    value={contact}
                    id={contact.id}
                    balance={contact.balance}
                    available={contact.available}
                    logo={contact.logo}
                    transactions={contact.transactions}
                    onClick={handleContactClick} />)
                })}
              </List>
            </Grid>

            <Grid item xs={8}>
              <Grid container className={classes.container}>
                <div className={classes.content}>
                  <Snackbar
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    open={hasAlert}
                    autoHideDuration={5000}
                    onClose={handleCloseAlert}
                  >
                    <Alert
                      severity={alertType}
                      onClose={handleCloseAlert}
                    >
                      {alertMsg}
                    </Alert>
                  </Snackbar>
                  {profile}
                </div>
              </Grid>
            </Grid>

          </Grid>

        </Grid>

      </Grid >
    </Container>
  );
}

export default AddressBook;
