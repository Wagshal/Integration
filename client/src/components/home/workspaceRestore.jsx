import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';
import Configuration from '../../config';

const useStyles = makeStyles({
    Autocomplete: {
        width: '35vw',
    },
});

function WorkspacesRestore() {
    const { workspace_restore } = useContext(MongoDbMngrContext);
    const classes = useStyles();
    const [workspaces, setWorkspaces] = useState(null);
    const [url, setUrl] = useState('');
    const [connectSucceed, setConnectSucceed] = useState({ response: true });
    const config = new Configuration();

    let defaultProps = {
        options: [{}],
        getOptionLabel: _ => _
    };

    function clearState() {
        workspace_restore({ workspace: '' });
    }

    let button = document.querySelector(".MuiAutocomplete-clearIndicatorDirty");
    if (button)
        button.addEventListener('click', clearState);

    async function checkConnection(url) {
        try {
            const response = await axios.get(`${config.API_URL}/check_connection`, {
                params: { url: url }
            });
            setConnectSucceed(response.data);
        } catch (error) {
            console.error('Error:', error);
        };
    }

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        try {
            const response = await axios.get(`${config.API_URL}/get_workspaces`, {})
            setWorkspaces({ workspaces: response.data.responeWorkspaces });
        } catch (error) {
            console.error('Error:', error);
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
        <div className={classes.Autocomplete}>
            <Autocomplete
                style={{ width: '20vw' }}
                {...defaultProps}
                id="select-workspace"
                blurOnSelect
                onChange={async (event, value) => {
                    if (value && value.url) {
                        await checkConnection(value.url)
                        if (connectSucceed) {
                            setUrl(value.url)
                        }
                        workspace_restore({ workspace: value.url })
                    }
                    else {
                        setUrl(null)
                        setConnectSucceed({ response: true })
                    }
                }}
                renderInput={(params) => <TextField  {...params} label="Choose a workspace for restore" margin="normal" />}
            />
            {!connectSucceed.response?
                <div>The workespace is not found</div> : <></>
            }
        </div>
    );
}

export default WorkspacesRestore;
