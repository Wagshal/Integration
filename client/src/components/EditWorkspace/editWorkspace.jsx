import React, { useState, useEffect } from 'react';
import axios from 'axios';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';

import Configuration from '../../config';
import DialogAdd from './dialogAdd';
import DialogChange from './dialogChange';
import DialogRemove from './dialogRemove';
import GlobalIndication from '../home/globalIndication'

const useStyles = makeStyles({

    EditButton: {
        width: '7vw',
    },

    List: {
        width: '25vw',
        marginLeft: '36vw',
        marginTop: '8vw',
        border: '2px teal solid',
        borderRadius: '5px'
    },
});

function EditWorkspace() {

    const classes = useStyles();
    const config = new Configuration();
    const [workspaces, setWorkspaces] = useState(null);
    const [notification, setNotification] = useState({});
    const [notification_show, setNotification_show] = useState({});

    let defaultProps = {
        options: [{}],
        getOptionLabel: _ => _
    };
    useEffect(() => {
        fetchData();
    }, [notification]);

    useEffect(() => {
        if (Object.keys(notification).length !== 0) {
            notification.isSucceeded ?
                setNotification_show({ severity: "success", message: "The operation was successful!" })
                : setNotification_show({ severity: "error", message: notification.errMsg })
        }
    }, [notification]);

    function handleSetNotification(notification) {
        setNotification(notification);
    }

    async function fetchData() {
        try {
            const response = await axios.get(`${config.API_URL}/get_workspaces`, {});
            setWorkspaces({ workspaces: response.data.responeWorkspaces });
        } catch (error) {
            throw error;
        };
    }

    if (workspaces) {
        const options = Object.entries(workspaces.workspaces).map(([key, val]) => {
            return ({ name: key, url: val });
        });
        defaultProps = {
            options: options,
            getOptionLabel: op => op.name
        };
    }

    return (
        <>
            <div className='center'>
                <Box className={classes.List}>
                    <List >
                        {defaultProps.options.map((row, index) => (
                            <ListItem className="hover list" key={index}>
                                <ListItemText primary={row.name} />
                                <DialogChange workspaceChoose={{ workspaceName: row.name, workspaceUrl: row.url }} handleSetNotification={handleSetNotification} />
                                <DialogRemove workspaceChoose={{ workspaceName: row.name, workspaceUrl: row.url }} handleSetNotification={handleSetNotification} />
                            </ListItem>
                        ))}
                        <ListItem>
                            <DialogAdd handleSetNotification={handleSetNotification} />
                        </ListItem>
                    </List>
                </Box>
                {
                    Object.keys(notification).length !== 0 ?
                        <GlobalIndication notification={notification} notification_show={notification_show} handleSetNotification={handleSetNotification} />
                        : <></>
                }
            </div>
        </>
    );
}

export default EditWorkspace;
