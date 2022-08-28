import React from 'react';

import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';

import Configuration from './../../config';

function DialogRemove(props) {

    const config = new Configuration();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemove = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(props.workspaceChoose),
        };
        try {
            const response = await fetch(`${config.API_URL}/edit_workspace/remove_workspace`, requestOptions)
            const answer = await response.json();
            props.handleSetNotification(answer);
        } catch (error) {
            throw error;
        };
        setOpen(false);
    }

    return (
        <>
            <Tooltip title="Remove">
                <Button className="overrideColor" onClick={handleClickOpen}>
                    <DeleteIcon />
                </Button>
            </Tooltip>
            {props.workspaceChoose.workspaceName ?
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Remove workspace</DialogTitle>
                    <DialogContent>
                        <Alert severity="warning">
                            <AlertTitle><strong>Warning</strong></AlertTitle>
                            Are you sure you want to remove the <strong>{props.workspaceChoose.workspaceName}</strong>?
                        </Alert>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} className="overrideColor">CANCEL</Button>
                        <Button onClick={handleRemove} className="overrideColor">REMOVE WORKSPACE</Button>
                    </DialogActions>
                </Dialog>
                : <></>
            }
        </>
    );
}

export default DialogRemove;
