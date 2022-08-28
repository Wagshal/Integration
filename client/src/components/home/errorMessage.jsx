import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

function ErrorMessage(props) {

    const [open, setOpen] = React.useState(props.display);
    const [scroll, setScroll] = React.useState('paper');

    const handleClose = () => {
        setOpen(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(props.message);
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
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Error Message</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    {props.message ? props.message : "Oops, something was wrong Unable to display error"}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
                <Button onClick={handleCopy} color="primary">
                    <FileCopyOutlinedIcon fontSize="small" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ErrorMessage;
