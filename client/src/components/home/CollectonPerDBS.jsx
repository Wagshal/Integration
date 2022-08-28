import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Configuration from '../../config';
import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';
import { FiltersContext } from '../../context/filter/FiltersContext';
import FilterDialog from '../filter/filterDialog';
import FilteredCollections from '../filter/filteredCollections';

function CollectionPerDBS(props) {
    const { add_collection, remove_collection } = useContext(MongoDbMngrContext);
    const { state } = useContext(FiltersContext);
    const config = new Configuration();
    const [value, setValue] = useState({});
    const [checked, setChecked] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    async function fetchData() {

        try {
            const response = await axios.get(`${config.API_URL}/mongo_interface/get_collection_per_db`, {
                params: {
                    workspace: props.workspace,
                    db: props.db
                }
            });
            if (response.data.collections != undefined && response.data.collections.length > 0) {
                setValue({ collection: response.data.collections });
                const checkboxArray = response.data.collections.map(c => ({ id: c, checked: false }));
                setChecked(checkboxArray);
            }
            else {
                setValue({ error: `no collections for ${props.db}` })
            }
        } catch (error) {
            console.error('Error:', error);
        };
    }

    useEffect(() => {
        fetchData();
    }, [props.db]);

    const isChecked = (c, state) => {
        checked.find(item => item.id === c).checked = state;
    };

    const ifChecked = (c) => {
        if (checked.length > 0) {
            if (!props.checked)
                checked.find(item => item.id === c).checked = false;
            return checked.find(item => item.id === c).checked;
        }
        return false
    };

    const getFilterPerCollection = (c) => {
        return state.filter(f => f.collection === c && f.db === props.db);
    };

    const closedDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            {value.collection ?
                value.collection.map((c, index) => (
                    < span key={index} >
                        {props.purpose === "dump" ?
                            <FormControlLabel
                                aria-label="Acknowledge"
                                control={
                                    <Checkbox className="overrideColor"
                                        checked={ifChecked(c)} onChange={(event) => {
                                            isChecked(c, event.target.checked)
                                            event.target.checked ?
                                                add_collection({ db: props.db, collection: c })
                                                : remove_collection({ db: props.db, collection: c })
                                            event.target.checked ?
                                                props.handleClick(props.db, true)
                                                : <></>
                                        }} />
                                }
                                label={c}
                            />
                            : <span>
                                <FilterDialog open={openDialog} closedDialog={closedDialog} index={index} workspace={props.workspace} db={props.db} collection={c}></FilterDialog>
                                <span onClick={() => setOpenDialog(true)}>{c}</span>
                            </span>
                        }
                        {
                            JSON.stringify(getFilterPerCollection(c)) !== '[]' && props.purpose === "dump" ?
                                <FilteredCollections data={getFilterPerCollection(c)}></FilteredCollections>
                                : <></>
                        }
                        <br />
                    </span>
                )) : <div>{value.error}</div>
            }
        </>
    )
}

export default CollectionPerDBS
