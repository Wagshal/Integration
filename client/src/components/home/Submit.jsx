import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import PerformDump from './performDump';
import PerformRestore from './performRestore';

const useStyles = makeStyles({
    submitButton: {
        width: '10vw',
        height: '7vh',
        color: 'teal',
        justifyContent: 'center',
        fontSize: '1rem',
    },
    submitExsistDump: {
        marginTop: '58vh'
    }
});

function Submit(props) {
    const classes = useStyles();
    const [dump, setDump] = useState(false);
    const [exsistDump, setexistsDump] = useState(false);
    return (
        <>
            <Button
                variant="contained"
                size="large"
                className={props.id == 'choiceWorkcpace' ? classes.submitButton : `${classes.submitExsistDump} ${classes.submitButton}`}
                onClick={(event, value) => {
                    switch (props.id) {
                        case 'choiceWorkcpace': { setDump(true) }
                            break;
                        case 'existsDump': { setexistsDump(true) }
                            break;
                        default:
                            break;
                    }
                }}>
                {props.name}
            </Button>
            {dump ?
                <PerformDump />
                :
                exsistDump ?
                    <PerformRestore dumpFile={props.dumpFile} /> :
                    <></>
            }
            <></>
        </>
    );
}

export default Submit;
