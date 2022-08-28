import React, { useState, useContext } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { AutoCopmleteKeyContext } from '../../context/AutoCopmleteKey/AutoCopmleteKeyContext';
import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';
import ErrorMessage from './errorMessage';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function GlabalIndication(props) {

    const { state } = useContext(MongoDbMngrContext);
    const { change_key } = useContext(AutoCopmleteKeyContext);
    const [open, setOpen] = useState(true);
    const [show_error, setShow_error] = useState(false);

    const handleClose = () => {
        setOpen(false);
        if (state.workspace_to_restore === '' || props.notification_show.message === 'Restore succeeded!' || props.notification_show.message === 'Restore failed!' || props.closeEmitter)
            change_key();
    };

    return (
        <>
            {
                Object.keys(props.notification).length !== 0 ?
                    <Snackbar open={open} autoHideDuration={props.notification_show.severity === 'error' ? 6000 : 3000} onClose={handleClose}>
                        <Alert
                            onClose={handleClose}
                            severity={props.notification_show.severity}>
                            {props.notification_show.message}
                            {
                                !props.notification.isSucceeded ?
                                    <>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span
                                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => {
                                                setShow_error(true)
                                            }}
                                        >
                                            Show error
                                        </span>
                                    </>
                                    : <></>
                            }
                        </Alert>
                    </Snackbar>
                    : <></>
            }
            {
                show_error ?
                    <ErrorMessage message={props.notification.errorMsg} display={show_error} />
                    : <></>
            }
        </>
    );
}

export default GlabalIndication;
