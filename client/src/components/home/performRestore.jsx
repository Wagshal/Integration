import React, { useState, useEffect, useContext } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';
import Configuration from '../../config';
import GlabalIndication from './globalIndication';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        marginLeft: '48vw',
        marginTop: '10vh'
    }
}));

function PerformRestore(props) {

    const config = new Configuration();
    const classes = useStyles();
    const { state } = useContext(MongoDbMngrContext);
    const [notification, setNotification] = useState({});
    const [notification_show, setNotification_show] = useState({});

    const postData = async () => {

        const restoreDetails = {
            dumpFile: props.dumpFile,
            uri: state.workspace_to_restore
        };
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(restoreDetails),
        };
        try {
            const response = await fetch(`${config.API_URL}/submit/restore`, requestOptions);
            const answer = await response.json();
            setNotification(answer);
        } catch (error) {
            throw error;
        };
    }

    useEffect(() => {
        postData()
    }, []);

    useEffect(() => {
        if (Object.keys(notification).length !== 0) {
            notification.isSucceeded ?
                setNotification_show({ severity: "success", message: "Restore succeeded!" })
                : setNotification_show({ severity: "error", message: "Restore failed!" })
        }
    }, [notification]);

    return (
        <>
            {
                Object.keys(notification).length !== 0 ?
                    <GlabalIndication notification={notification} notification_show={notification_show} />
                    : <div className={classes.root}>
                        <CircularProgress className="overrideColor circularProgressExists" />
                    </div>
            }
        </>
    );
}

export default PerformRestore;
