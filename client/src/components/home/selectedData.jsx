import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';
import chosenDB from '../../images/chosenDB.png';
import littleDB from '../../images/littleDB.png';

const useStyles = makeStyles({
    selection: {
        width: '8rem',
        marginLeft: '10rem',
        height: '40rem',
    },
    title: {
        color: 'teal',
        fontSize: '1.5rem'
    },
    chosenDB: {
        width: '3rem'
    },
    db: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

function DataSelected() {

    const { state } = useContext(MongoDbMngrContext);
    const classes = useStyles();
    let nodeId = 1;

    return (
        <div className={classes.selection}>
            <img className={classes.chosenDB} src={chosenDB} ></img>
            <figcaption className={classes.title}>Selected items</figcaption>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1 }}
            >
                {state.dbs.map(_db => (
                    <div className={classes.db} key={`${nodeId}`}>
                        <img className={classes.littleDB} src={littleDB} ></img>
                        <TreeItem nodeId={`${nodeId++}`} label={_db.db}>
                            {_db.collections.map(c =>
                                typeof c == 'string' ? < TreeItem key={`${nodeId}`} nodeId={`${nodeId++}`} label={c} /> :
                                    < TreeItem key={`${nodeId}`} nodeId={`${nodeId++}`} label={c.description} />
                            )}
                        </TreeItem>
                    </div>
                )
                )}
            </TreeView>
        </div>
    );
}

export default DataSelected;
