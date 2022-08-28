import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress';

import Configuration from '../../config';
import {FiltersContext} from '../../context/filter/FiltersContext'
import GlabalIndication from '../home/globalIndication';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        marginLeft: '48vw',
        marginTop: '10vh'
    }
});

function PerformFilter(props) {
    const { setUpdate } = useContext(FiltersContext);
   const config = new Configuration();
    const classes = useStyles();
    const [notification, setNotification] = useState({});
    const [notification_show, setNotification_show] = useState({});

    const data = {
        workspace: props.workspace,
        db: props.db,
        collection: props.collection,
        query: props.query,
        projection: props.project,
        description: props.description
    };

    async function fetchData() {
        try {
            const response = await axios.get(`${config.API_URL}/filter_collection/add_query`, {
                params: data
            })
        if(response.data.isSucceeded)
        {
            setUpdate(true)
        }
            setNotification(response.data);
        } catch (error) {
            console.error('Error:', error);
        };
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (Object.keys(notification).length !== 0) {
            notification.isSucceeded ?
                setNotification_show({ severity: "success", message: "The filter was executed successfully!" })
                : setNotification_show({ severity: "error", message: "Filter failed!" })
        }
    }, [notification]);

    return (
        <>
            {
                Object.keys(notification).length !== 0 ?
                    <GlabalIndication notification={notification} notification_show={notification_show} state="notificationFilter" />
                    : <div className={classes.root}>
                        <CircularProgress className="overrideColor circularProgress" />
                    </div>

            }
        </>
    );
}

export default PerformFilter;
