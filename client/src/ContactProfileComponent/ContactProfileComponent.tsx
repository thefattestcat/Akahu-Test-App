import React from 'react';
import { Button, Avatar, Grid, InputAdornment, TextField, Tabs, Tab, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
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
            variant="filled"
            margin="dense"
            style={{ margin: 8 }}
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
            <Button onClick={props.handleEdit}>
                <EditIcon />
            </Button>
            <Button onClick={props.handleClose} style={{ float: "right" }}>
                <CloseIcon />
            </Button>
            <Grid
                container
                direction="column"
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item>
                    <Avatar src={props.logo} style={{ height: "100px", width: "100px" }} >
                    </Avatar>
                </Grid>

                <Grid item>
                    <h1>{props.name}</h1>
                </Grid>

                <Grid item>
                    available balance: ${props.available} NZD
                </Grid>

                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                    <AddressField handleAlert={handleAlert} id={props.bank_no} label={'Bank no.'} />
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
                <TabPanel value={tabIndex} index={0} >
                    <TableContainer style={{ width: "100%" }}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Transaction SID</TableCell>
                                    <TableCell align="right">Sent/Recieve</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.transactions.map(transaction => {
                                    return (
                                        <TableRow>
                                            <TableCell>{transaction.created_at}</TableCell>
                                            <TableCell align="left">{transaction.sid}</TableCell>
                                            <TableCell align="left">{transaction.to.substring(0,14)}...</TableCell>
                                            <TableCell align="left">{transaction.status}</TableCell>
                                            <TableCell align="left">${transaction.amount}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <SendForm
                        id={props.id}
                        available={props.available}
                        handleSubmit={props.handleSend}
                        handleError={props.handleAlert}
                    />
                </TabPanel>
            </Grid>
        </div>);
}

export default ContactProfileComponent;