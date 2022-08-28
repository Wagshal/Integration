import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CreateIcon from '@mui/icons-material/Create';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';

import { makeStyles } from '@material-ui/core/styles';

import Configuration from './../../config';

const useStyles = makeStyles({
    DialogContentText: {
        height: '5vh'
    }
});

function DialogRemove(props) {

    const classes = useStyles();
    const config = new Configuration();
    const [open, setOpen] = React.useState(false);
    const [canChange, setCanChange] = React.useState(true);
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
        if (newUrl || newName)
            setCanChange(false);
    };

    const handleChangeWorkspace = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...props.workspaceChoose, newWorkspaceName: newName, newWorkspaceUrl: newUrl })
        };
        try {
            const response = await fetch(`${config.API_URL}/edit_workspace/change_workspace`, requestOptions)
            const answer = await response.json();
            props.handleSetNotification(answer);
        }
        catch (error) {
            throw error;
        };
        setOpen(false);
        setCanChange(true);
    };

    return (
        <span>
            <Tooltip title="Change">
                <Button className="overrideColor" onClick={handleClickOpen}>
                    <CreateIcon />
                </Button>
            </Tooltip>
            {props.workspaceChoose.workspaceName ?
                <Dialog open={open} onClose={handleClose} >
                    <DialogTitle>Change workspace</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.DialogContentText}>
                            To change the workspace type new workspace name and url
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            onChange={(event) => handleChange(event, "name")}
                            label="change workspce name"
                            defaultValue={props.workspaceChoose.workspaceName}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            onChange={(event) => handleChange(event, "url")}
                            label="change workspce url"
                            defaultValue={props.workspaceChoose.workspaceUrl}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} className="overrideColor">CANCEL</Button>
                        <Button onClick={handleChangeWorkspace} className="overrideColor" disabled={canChange}>CHANGE WORKSPACE</Button>
                    </DialogActions>
                </Dialog>
                : <></>
            }
        </span>
    );
}

export default DialogRemove;
