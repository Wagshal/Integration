import React, { useState, useEffect, useContext } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@mui/material/IconButton';
import Button from '@material-ui/core/Button';
import { FormControl, FormLabel, RadioGroup } from '@mui/material';
import Dialog from '@material-ui/core/Dialog';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@mui/material/Tooltip';

import filterX from '../../images/filterX.png';
import filterV from '../../images/filterV.png';
import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';

function FilteredCollections(props) {
    const { add_collection, remove_collection } = useContext(MongoDbMngrContext);
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState([]);
    const [showQuery, setShowQuery] = useState([]);

    const bootMode = _ => {
        const checkboxArray = props.data.map(f => ({ id: f.description, checked: false }));
        setChecked(checkboxArray);
        const showQueryArray = props.data.map(c => ({ id: c.description, show: false }));
        setShowQuery(showQueryArray);
    };

    useEffect(() => {
        bootMode();
    }, []);

    const isNone = () => {
        checked.map(item => item.checked = false);
    };

    const ifNone = () => {
        let none = true;
        checked.map(f => { if (f.checked) none = false });
        return none;
    };

    const isChecked = (f) => {
        checked.find(item => item.id == f).checked = !checked.find(item => item.id == f).checked;
    };

    const ifChecked = (f) => {
        return checked.find(item => item.id == f).checked;
    };

    const toShowQuery = (f) => {
        showQuery.find(item => item.id === f).show = !showQuery.find(item => item.id === f).show;
    };

    const ifShowQuery = (f) => {
        return showQuery.find(item => item.id === f).show;
    };

    const handleClick = (state) => {
        setOpen(state);
    };

    return (
        <>
            <Tooltip title="Choose filters">
                <IconButton onClick={() => handleClick(true)} >{
                    ifNone() ?
                        <img src={filterX} />
                        : <img src={filterV} />
                }
                </IconButton>
            </Tooltip>
            {
                open ?
                    <Dialog style={{ textAlign: 'left' }}
                        hideBackdrop={true}
                        open={open}
                        onClose={() => handleClick(false)}
                    >
                        <FormControl component="fieldset" style={{ width: '20vw', minHeight: '20vh', padding: '1.5vw' }}>
                            <FormLabel component="legend" style={{ paddingTop: '3vh', textAlign: 'center' }}>FILTERS</FormLabel>
                            <RadioGroup aria-label="gender" name="gender1"  >
                                <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={(event) => event.stopPropagation()
                                    }
                                    onFocus={(event) => {
                                        event.stopPropagation();
                                    }}
                                    control={
                                        <Checkbox checked={ifNone()} className="overrideColor"
                                            onChange={() => {
                                                isNone()
                                            }} />
                                    }
                                    label="No filter"
                                />
                                {
                                    props.data.map((f, index) => (
                                        <div key={index}>
                                            <div>
                                                <FormControlLabel
                                                    aria-label="Acknowledge"
                                                    onClick={(event) => event.stopPropagation()
                                                    }
                                                    onFocus={(event) => {
                                                        event.stopPropagation();
                                                    }}
                                                    control={
                                                        <Checkbox checked={ifChecked(f.description)} className="overrideColor"
                                                            id={f.description} onChange={(event) => {
                                                                isChecked(f.description)
                                                                event.target.checked ?
                                                                    add_collection({ db: f.db, collection: { name: f.collection, query: f.query, projection: f.projection, description: f.description } })
                                                                    : remove_collection({ db: f.db, collection: { name: f.collection, query: f.query, projection: f.projection, description: f.description } })
                                                            }}
                                                        />
                                                    }
                                                    label={f.description}
                                                />
                                                <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => toShowQuery(f.description)}>
                                                    <MoreVertIcon className="overrideColor" />
                                                </IconButton>
                                            </div>
                                            {
                                                ifShowQuery(f.description) ?
                                                    <>
                                                        <div key={`${index}a`}><b>Filter:</b> {f.query}  </div>
                                                        <div key={`${index}b`}> <b>Projection:</b> {f.projection} </div>
                                                    </>
                                                    : <></>
                                            }
                                        </div>
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>
                        <Button className="overrideColor" onClick={() => handleClick(false)} color="primary">
                            Exit
                        </Button>
                    </Dialog>
                    : <></>
            }
        </>
    )
}

export default FilteredCollections;
