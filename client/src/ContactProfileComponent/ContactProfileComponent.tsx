import React from 'react';
import { Button, Avatar, Grid, InputAdornment, TextField, Tabs, Tab, Box, Card, CardMedia, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

import Contact from '../Contact/Contact';
import SendForm from '../SendForm/SendForm'

interface ContactProfileProps extends Contact {
    handleEdit: any,
    handleClose: any,
    handleAlert: any,
    handleSend: any,
    availableAmount: number,
    transactions: any[],
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{ width: "inherit" }}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

interface AddressFieldProps {
    id: string,
    label: string,
    handleAlert: any,
}

function AddressField(props: AddressFieldProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(props.id)
        props.handleAlert()
    }

    return (
        <TextField
            disabled
            id="filled-disabled"
            value={props.id}
            label={props.label}
            variant="outlined"
            margin="dense"
            style={{ margin: 8, }}
            size="small"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <FileCopyIcon onClick={handleCopy} fontSize="small"></FileCopyIcon>
                    </InputAdornment>
                ),
                style: {
                    padding: "0 0 0 0",
                    overflowX: "hidden"
                }
            }}
            InputLabelProps={{
                shrink: true,
                style: {
                    padding: "0 0 0 0",
                }
            }}
        />)
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ContactProfileComponent: React.FC<ContactProfileProps> = props => {
    const [tabIndex, setTab] = React.useState(0);
    const handleTab = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue)
    }

    const handleAlert = () => {
        props.handleAlert({ code: 2, message: "Copied!", type: "success" })
    }

    return (
        <div>
            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
            />
            <Button
                onClick={props.handleEdit}
            >
                <EditIcon />
            </Button>
            <Button
                onClick={props.handleClose}
                style={{ float: "right" }}
            >
                <CloseIcon />
            </Button>

            <Grid
                container
                direction="column"
                justify="space-evenly"
                alignItems="center"
            >
                <Avatar
                    src={props.logo}
                    style={{
                        height: "150px",
                        width: "150px",
                        top: "150px",

                        position: "absolute"
                    }} >
                </Avatar>

                <Grid item>
                    {props.name}
                </Grid>

                <Grid item>
                    <p>
                        <span style={{ fontSize: "20px", padding: "15px" }}>{props.name}</span>
                        <span style={{ fontSize: "30px", padding: "15px" }}>${props.available}</span>
                    </p>
                </Grid>

                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                    <AddressField handleAlert={handleAlert} id={props.bank_no} label={'Acc no.'} />
                    <AddressField handleAlert={handleAlert} id={props.id} label={'id'} />
                </Grid>

                <Tabs
                    value={tabIndex}
                    onChange={handleTab}
                    variant="fullWidth"
                >
                    <Tab label="Transaction History" {...a11yProps(0)} />
                    <Tab label="Send/Transfer" {...a11yProps(1)} />
                </Tabs>
                
            </Grid>
            <TabPanel value={tabIndex} index={0} >
                {props.transactions.map(transaction => {
                    return (
                        <Card variant="outlined">
                            <TableCell>{transaction.created_at}</TableCell>
                            <TableCell align="left">{transaction.sid}</TableCell>
                            <TableCell align="left">{transaction.to.substring(0, 14)}...</TableCell>
                            <TableCell align="left">{transaction.status}</TableCell>
                            <TableCell align="left">${transaction.amount}</TableCell>
                        </Card>
                    )
                })}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <SendForm
                    id={props.id}
                    available={props.available}
                    handleSubmit={props.handleSend}
                    handleError={props.handleAlert}
                />
            </TabPanel>
        </div>);
}

export default ContactProfileComponent;