import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import WorkspacesRestore from '../home/workspaceRestore';
import Configuration from '../../config';
import Submit from '../home/Submit';
import FmdBadIcon from '@mui/icons-material/FmdBad';

const useStyles = makeStyles({

    Autocomplete: {
        width: '35vw',
    },
    flexDiv: {
        display: 'flex',
        marginTop: '5vh',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerFlex: {
        flex: '1 1 auto',
    },
    workspace: {
        width: ' 50rem',
        display: 'flex',
        justifyContent: 'space-between',
    }, notExsist: {
        color: 'teal',
        fontSize: '1.8rem'
    }
});

function ExitstDumpFile() {
    const classes = useStyles();
    const config = new Configuration();
    const [dumpFile, setDumpFile] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);

    let defaultProps = {
        options: [{}],
        getOptionLabel: _ => _
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get(`${config.API_URL}/get_dump_file`, {})
            setDumpFile({ dumpFile: response.data });
        } catch (error) {
            throw error;
        };
    }
    if (dumpFile && dumpFile.dumpFile != 'not found') {

        const options = dumpFile.dumpFile.map(f => {
            return ({ name: f });
        });
        defaultProps = {
            options: options,
            getOptionLabel: op => op.name
        };
    }

    return (
        <div className={classes.flexDiv}>
            {dumpFile ?
                dumpFile.dumpFile == 'not found' ?
                    <div className={classes.notExsist}>
                        <FmdBadIcon id='iconNotEx' />
                        <h1 >not exists dump file</h1></div> :
                    <form>
                        <div className={classes.workspace}  >
                            <div className={classes.Autocomplete}>
                                <Autocomplete
                                    className={classes.innerFlex}
                                    style={{ width: '20vw' }}
                                    {...defaultProps}
                                    id="select-workspace"
                                    blurOnSelect
                                    onChange={async (event, value) => {
                                        if (value) {
                                            setSelectedFolder(value.name)
                                        }
                                        else {
                                            setSelectedFolder(null)
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Choose an existing dump folder" margin="normal" />}
                                />
                            </div>
                            <WorkspacesRestore className={classes.innerFlex} />
                        </div>
                        <Submit name="Submit" id="existsDump" dumpFile={selectedFolder} />
                    </form>
                : <></>}
        </div>
    );
}

export default ExitstDumpFile
