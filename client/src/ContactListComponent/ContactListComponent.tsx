import React from 'react';
import Contact from '../Contact/Contact';
import { Theme, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import './ContactListComponent.css';

interface ContactListProps extends Contact {
    onClick: any,
    value: Contact
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        fontFamily: "RawlineSemiBold",
    },
    button: {
        borderRadius: "21.5px",
        border: "1px solid #F15A29",
        boxSizing: "border-box",
        color: "#F15A29",
        fontSize: "12px",
        fontStyle: "normal",
        lineHeight: "18px",
        letterSpacing: "0px",
        textAlign: "left",
    },
    listItemText: {
        fontSize: "14px",
        fontStyle: "normal",
    }
}));

const ContactListComponent: React.FC<ContactListProps> = props => {
    const classes = useStyles();
    const handleOnClick = () => {
        props.onClick(props.value);
    }

    return (
        <>
            <ListItem button className={classes.root} onClick={handleOnClick}>
                <ListItemIcon>
                    <Avatar src={props.logo}></Avatar>
                </ListItemIcon>
                <ListItemText
                    primary={props.name}
                    secondary={props.bank_no}
                    style={{ overflowX: "hidden" }}
                />
            </ListItem>
            <Divider />
        </>
    )
}

export default ContactListComponent;