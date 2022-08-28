import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import Configuration from '../../config';
import DBSPerWorkspaces from './DBSPerWorkspaces';
import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';

const useStyles = makeStyles({
    Autocomplete: {
        width: '35vw',
    },
    filter: {
        marginLeft: '39vw'
    }
});

function WorkspacesDump(props) {

    const { workspace_dump } = useContext(MongoDbMngrContext);
    const classes = useStyles();
    const [workspaces, setWorkspaces] = useState(null);
    const [defaultWorkspace, setDefaultWorkspace] = useState('')
    const [url, setUrl] = useState(null);
    const [connectSucceed, setConnectSucceed] = useState({ response: true });
    const config = new Configuration();

    let defaultProps = {
        options: [{}],
        getOptionLabel: _ => _
    };

    function clearState() {
        workspace_dump({ workspace: defaultWorkspace });
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
            setUrl(url)
        } catch (error) {
            console.error('Error:', error);
            setUrl(null)
        };
    }

    useEffect(() => {
        fetchData();
    },[]);

    async function fetchData() {
        try {
            const response = await axios.get(`${config.API_URL}/get_workspaces`, {});
            setWorkspaces({ workspaces: response.data.responeWorkspaces });
            setDefaultWorkspace(response.data.config);
            workspace_dump({ workspace: response.data.config });

        } catch (error) {
            throw error;
        };
    }
    if (workspaces) {
        const options = Object.entries(workspaces.workspaces).map(([key, val]) =>
            ({ name: key, url: val }));
        defaultProps = {
            options: options,
            getOptionLabel: op => op.name || ''
        };
    }

    return (
        <div className={props.purpose === 'filter' ? `${classes.filter} ${classes.Autocomplete}` : classes.Autocomplete}>
            <Autocomplete
                style={{ width: '20vw' }}
                {...defaultProps}
                id="select-workspace"
                getOptionSelected={(option, value) => option.name === value.name}
                onChange={async (event, value) => {
                    if (value && value.url) {
                        await checkConnection(value.url)
                        // if (connectSucceed) {
                            // setUrl(value.url);
                        // }
                        workspace_dump({ workspace: value.url })
                    }
                    else {
                        // setUrl(null)
                        setConnectSucceed({ response: true })
                    }
                }}
                renderInput={(params) => <TextField {...params} label={`Choose a workspace to ${props.purpose}`} margin="normal" />}
            />
            {!connectSucceed.response ?
                <div>The workespace is not found</div> :
                connectSucceed.response && url !== null ?
                    <DBSPerWorkspaces name={url} purpose={props.purpose} />
                    : <></>
            }
        </div>
    );
}

export default WorkspacesDump;
