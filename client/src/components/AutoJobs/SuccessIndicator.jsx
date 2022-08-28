import React, { useState, useEffect, useContext } from 'react';

import Configuration from '../../config';
import GlabalIndication from '../home/globalIndication';
import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';

function SuccessIndicator(props) {

    const config = new Configuration();
    const { state } = useContext(MongoDbMngrContext);
    const [notification, setNotification] = useState(false);
    const [notification_show, setNotification_show] = useState({});

    const postData = async () => {
        const autojobsDetails = {
            date: new Date(props.date + " " + props.time),
            frequency: props.frequency,
            state: state
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(autojobsDetails),
        };

        try {
            const response = await fetch(`${config.API_URL}/auto_job`, requestOptions)
            const answer = await response.json()
            setNotification(answer)
        } catch (error) {
            throw error;
        };
    };

    useEffect(() => {
        postData()
    }, []);

    useEffect(() => {
        if (Object.keys(notification).length !== 0) {
            notification.isSucceeded ?
                setNotification_show({ severity: "success", message: " The details have been successfully entered" })
                : setNotification_show({ severity: "error", message: " Error in receiving the details" })
        }
    }, [notification])

    return (
        <>
            <GlabalIndication closeEmitter="true" notification={notification} notification_show={notification_show} />
        </>
    );
};

export default SuccessIndicator;
