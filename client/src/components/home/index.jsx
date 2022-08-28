import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import WorkspacesDump from './workspacesDump';
import WorkspacesRestore from './workspaceRestore';
import Submit from './Submit';
import DataSelected from './selectedData';

const useStyles = makeStyles({
    flexDiv: {
        display: 'flex',
        marginTop: '5vh',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerFlex: {
        flex: '1 1 auto',
    },
    workspace: {
        width: ' 70vw',
        display: 'flex',
        justifyContent: 'space-between',

    },
    selection: {
        marginLeft: '70vw',
    },
    dR: {
        display: 'flex',
        flexDirection: 'row',
        width: '50vw'
    }
});

function IndexPage() {
    const classes = useStyles();
    return (
        <>
            <div className={classes.flexDiv}>
                <form>
                    <div className={classes.workspace} >
                        <div className={classes.dR}>
                            <WorkspacesDump className={classes.innerFlex} purpose="dump" />
                            <WorkspacesRestore className={classes.innerFlex} />
                        </div>
                        <div>
                            <DataSelected className={classes.selection} />
                        </div>
                    </div>
                    <Submit name="submit" id="choiceWorkcpace" />
                </form>
            </div>
        </>
    );
}

export default IndexPage;
