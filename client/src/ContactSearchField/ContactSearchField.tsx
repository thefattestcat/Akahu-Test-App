import { useState } from 'react';
import { Divider, InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';


const ContactSearchField: React.FC<any> = props => {
    const [value, setValue] = useState<any>('');

    const handleSubmit = () => {
        props.onClick(value);
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Contact"
                    placeholder="Search, name, address (0x), or ENS"
                    helperText="Full width!"
                    fullWidth
                    margin="dense"
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
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </form>
        </>)
}

export default ContactSearchField;