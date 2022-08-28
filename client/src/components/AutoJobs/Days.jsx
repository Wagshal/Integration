import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const useStyles = makeStyles({
    title: {
        fontSize: '1.1rem',
        marginBottom: '0.8vh',
        width: '350px'
    }
});

function Days(props) {

    const classes = useStyles();
    const Days = ['Sunday', 'Monday', 'Third', 'Wednesday', 'Thursday', 'Friday', 'Sabbath'];

    const handleChange = (event) => {
        props.handleClick(event.target.value)
    };

    return (
        <>
            <div className={classes.title}> choose a frequency for auto dump :</div>
            <Box sx={{ width: '11vw', marginLeft: '7.5vh' }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Days</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Days"
                        defaultValue="Days"
                        onChange={handleChange}
                    >
                        {
                            Days.map((day, index) =>
                                <MenuItem key={index} value={day}>{day}</MenuItem>)
                        }
                    </Select>
                </FormControl>
            </Box>
        </>
    );
}

export default Days;
