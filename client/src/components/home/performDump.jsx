import React, { useState, useEffect, useContext } from 'react';
import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import Configuration from '../../config';
import PerformRestore from './performRestore';
import GlabalIndication from './globalIndication';


const useStyles = makeStyles({
    root: {
        display: 'flex',
        marginLeft: '48vw',
        marginTop: '10vh'
    }
});

function PerformDump() {
    const config = new Configuration();
    const classes = useStyles();
    const { state } = useContext(MongoDbMngrContext);
    const [notification, setNotification] = useState({});
    const [notification_show, setNotification_show] = useState({});

    const postData = async () => {
console.log('dump client')
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state),
        };
        try {
            const response = await fetch(`${config.API_URL}/submit/dump`, requestOptions);
            const answer = await response.json();
            setNotification(answer);

        } catch (error) {
            throw error;
        };
    }

    useEffect(() => {
        postData();
    }, []);

    useEffect(() => {
        if (Object.keys(notification).length !== 0) {
            notification.isSucceeded ?
                setNotification_show({ severity: "success", message: "Dump succeeded!" })
                : setNotification_show({ severity: "error", message: "Dump failed!" })
        }
    }, [notification]);

    return (
        <>
            {
                Object.keys(notification).length !== 0 && notification.isSucceeded && state.workspace_to_restore !== '' ?
                    <PerformRestore dumpFile={notification.dumpFile} />
                    : <></>
            }
            {
                Object.keys(notification).length !== 0 ?
                    <GlabalIndication notification={notification} notification_show={notification_show} />
                    : <div className={classes.root}>
                        <CircularProgress className="overrideColor circularProgress" />
                    </div>
            }
        </>
    );
}

export default PerformDump;
