import React, { useState, useEffect, useContext } from 'react'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Tooltip from '@mui/material/Tooltip';

import PerformFilter from './performFilter';
import { FiltersContext } from '../../context/filter/FiltersContext';

export default function FilterDialog(props) {

    const { state } = useContext(FiltersContext);
    const [open, setOpen] = useState(false);
    const [performFilter, setPerformFilter] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [projectText, setProjectText] = useState('{}');
    const [descriptionText, setDescriptionText] = useState('');
    const [emptyDescription, setEmptyDescription] = useState(false);
    const [existsDescription, setExistsDescription] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        setPerformFilter(false);
        setFilterText('');
        setProjectText('{}');
        setDescriptionText('');
    };

    const handleClose = (state) => {
        if (state === "Perform") {
            if (descriptionText.trim().length === 0) {
                setEmptyDescription(true);
                return;
            }
            if (isExistsDescription()) {
                setExistsDescription(true);
                return;
            }
            setOpen(false);
            setEmptyDescription(false);
            setExistsDescription(false);
            setPerformFilter(true);
        }
        else {
            setOpen(false);
            props.closedDialog();
        }
    };

    const handleTextInputChange = (type, event) => {
        switch (type) {
            case "filter":
                setFilterText(event.target.value);
                break;
            case "project":
                setProjectText(event.target.value);
                break;
            case "description": {
                if (emptyDescription)
                    setEmptyDescription(false);
                if (existsDescription)
                    setExistsDescription(false);
                setDescriptionText(event.target.value);
            }
                break;
            default:
                return;
        }
    };

    const isExistsDescription = () => {
        let exists = false;
        state.map(f => {
            if (f.workspace === props.workspace && f.db === props.db
                && f.collection === props.collection && f.description === descriptionText) exists = true;
        });
        return exists;
    };

    const updateOpen = () => {
        if (props.open && props.index === 0) {
            setOpen(true);
        }
    };

    useEffect(() => {
        updateOpen();
    }, [props.open]);

    return (
        <>
            <Tooltip title="Add filter">
                <IconButton color="primary" aria-label="upload picture" component="label" onClick={handleClickOpen}>
                    <FilterAltIcon className="overrideColor" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={() => handleClose("Cancel")} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <TextField
                        label="FILTER"
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: '2vh' }}
                        onChange={(event) => handleTextInputChange("filter", event)}
                    />
                    <TextField
                        id="project"
                        label="PROJECT"
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: '2vh' }}
                        onChange={(event) => handleTextInputChange("project", event)}
                    />
                    <TextField
                        id="description"
                        label="DESCRIPTION"
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: '2vh' }}
                        onChange={(event) => handleTextInputChange("description", event)} />
                    {
                        emptyDescription ?
                            <div style={{ color: 'red' }}>Please,enter description</div>
                            : <></>
                    }
                    {
                        existsDescription ?
                            <div style={{ color: 'red' }}>The description already exists, please change it</div>
                            : <></>
                    }
                </DialogContent>
                <DialogActions>
                    <Button className="overrideColor" onClick={() => handleClose("Cancel")} color="primary">
                        Cancel
                    </Button>
                    <Button className="overrideColor" onClick={() => handleClose("Perform")} color="primary">
                        Perform
                    </Button>
                </DialogActions>
            </Dialog>
            {
                performFilter ?
                    <PerformFilter workspace={props.workspace} db={props.db} collection={props.collection} query={filterText} project={projectText} description={descriptionText} />
                    : <></>
            }
        </>
    );
}
