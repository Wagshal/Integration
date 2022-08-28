import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@mui/material/Tooltip';

import Configuration from './../../config';

const useStyles = makeStyles({
    TextField: {
        width: '20vw'
    },
    DialogContentText: {
        height: '5vh'
    },
    EditButton: {
        width: '25vw',
    },
});

function DialogRemove(props) {

    const config = new Configuration();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [canAdd, setCanAdd] = React.useState(true);
    const [newName, setNewName] = React.useState(null);
    const [newUrl, setNewUrl] = React.useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (event, state) => {
        if (state === "name") {
            setNewName(event.target.value);
        }
        if (state === "url") {
            setNewUrl(event.target.value);
        }
        if (newUrl && newName)
            setCanAdd(false);
        else
            setCanAdd(true);
    }
    const handleAdd = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ workspaceName: newName, workspaceUrl: newUrl })
        };
        try {
            const response = await fetch(`${config.API_URL}/edit_workspace/add_workspace`, requestOptions);
            const answer = await response.json();
            props.handleSetNotification(answer);
        } catch (error) {
            throw error;
        };
        setOpen(false);
        setCanAdd(true);
    };

    return (
        <span >
            <Tooltip title="Add new workspace">
                <Button className={`${classes.EditButton} hover overrideColor`} onClick={handleClickOpen}>
                    <AddIcon />
                </Button>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add workspace</DialogTitle>
                <DialogContent >
                    <DialogContentText className={classes.DialogContentText}>
                        To add new workspace type workspace name and url
                    </DialogContentText>
                    <TextField onChange={(event) => handleChange(event, "name")}
                        autoFocus
                        margin="dense"
                        className={classes.TextField}
                        label="new workspce name"
                        variant="outlined" />
                    <TextField
                        autoFocus
                        margin="dense"
                        className={classes.TextField}
                        onChange={(event) => handleChange(event, "url")}
                        label="new workspce url"
                        variant="outlined" />
                </DialogContent>
                <DialogActions >
                    <Button onClick={handleClose} className="overrideColor">CANCEL</Button>
                    <Button onClick={handleAdd} disabled={canAdd} className="overrideColor">ADD WORKSPACE</Button>
                </DialogActions>
            </Dialog>
        </span>
    );
}

export default DialogRemove;
