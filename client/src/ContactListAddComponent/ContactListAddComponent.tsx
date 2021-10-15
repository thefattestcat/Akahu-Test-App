import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';

const ContactListAddComponent: React.FC<{ onClick: any }> = props => {
    const handleOnClick = () => {
        props.onClick();
    }
    return (
        <>
            <Divider />
            <ListItem button onClick={handleOnClick}>
                <ListItemIcon>
                    <AddIcon></AddIcon>
                </ListItemIcon>
                <ListItemText primary={'New connection'} />
            </ListItem>
            <Divider />
        </>
    )
}


export default ContactListAddComponent;