import React, { useState, useContext } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import SuccessIndicator from './SuccessIndicator';
import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';

function ConfirmationSubmit(props) {

    const { state } = useContext(MongoDbMngrContext);

    const [open, setOpen] = React.useState(props.display);
    const scroll = 'paper';
    const [ShowIndicater, setShowIndicater] = useState(false);

    const handleConfirm = () => {
        setShowIndicater(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Do you confirm these details:</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        className="left"
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <br />
                        <b >Date: </b>
                        {props.date}
                        <br />
                        <b >Time: </b>
                        {props.time}
                        <br />
                        <b >Frequency: </b>
                        {props.frequency}
                        <br />
                        <b >Workspace to Dump: </b>
                        {state.workspace_to_dump}
                        <br />
                        {state.workspace_to_restore !== '' ?
                            <>
                                <b >Workspace to Restore: </b>
                                {state.workspace_to_restore}
                            </>
                            : <></>
                        }
                        <br />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose} className="overrideColor" >
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} className="overrideColor" >
                        Perform
                    </Button>
                </DialogActions>
            </Dialog>
            {ShowIndicater ?
                <SuccessIndicator closedsnackbar={handleClose} date={props.date} time={props.time} frequency={props.frequency} />
                : <></>
            }
        </>
    );
}

export default ConfirmationSubmit;
