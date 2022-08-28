import React from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Frequency(props) {

    const frequencyTimes = ['Once', 'EveryHour', 'Everyday', 'Weekly', 'Monthy', 'Yearly'];

    const handleChange = (event) => {
        props.handleClick(event.target.value)
    };

    return (
        <Box sx={{ width: '11vw', marginLeft: '7.5vh' }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Frequency</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Frequency"
                    defaultValue="Frequency"
                    onChange={handleChange}
                >
                    {
                        frequencyTimes.map((frequency, index) =>
                            <MenuItem key={index} value={frequency}>{frequency}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </Box>
    );
}

export default Frequency;
