import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

import Configuration from '../../config';
import CollectionPerDBS from './CollectonPerDBS';
import { MongoDbMngrContext } from '../../context/MongoDbMngr/MongoDbMngrContext';

const useStyles = makeStyles({
    accordion: {
        width: '20vw',
        maxHeight: '65vh',
        boxShadow: '1px 2px 2px gray',
        borderRadius: '1%',
        marginTop: '2vh',
        overflow: 'auto',
        position: 'absolute'
    }
});

function DBSPerWorkspaces(props) {
    const config = new Configuration();
    const classes = useStyles();
    const { add_db, remove_db } = useContext(MongoDbMngrContext);
    const [dbs, setDbs] = useState({});
    const [checked, setChecked] = useState([]);
    useEffect(() => {
        fetchData();
    }, [props.name]);

    async function fetchData() {
        try {
            const response = await axios.get(`${config.API_URL}/mongo_interface/get_dbs`, {
                params: { workspace: props.name }
            });
            if (response.data.DBS) {
                setDbs({ dbs: response.data.DBS });
                const checkboxArray = response.data.DBS.map(d => ({ id: d, checked: false }));
                setChecked(checkboxArray);
            }

        } catch (error) {
            throw error;
        };
    }

    const handleClick = (db, state) => {
        let data = [...checked];
        data.find(item => item.id === db).checked = state;
        setChecked(data);
    };

    const isChecked = (id) => {
        if (checked.find(item => item.id === id))
            return checked.find(item => item.id === id).checked;
        return false
    };

    return (
        <div className={classes.accordion}>
            {dbs.dbs ?
                dbs.dbs.map((d, index) => (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-label="Expand"
                            aria-controls="additional-actions1-content"
                            id="additional-actions1-header"
                        >
                            <FormControlLabel
                                aria-label="Acknowledge"
                                onClick={(event) => event.stopPropagation()
                                }
                                onFocus={(event) => {
                                    event.stopPropagation();
                                }}
                                control={
                                    props.purpose === "dump" ?
                                        <Checkbox className="overrideColor"
                                            checked={isChecked(d)}
                                            id={d}
                                            onChange={(event) => {
                                                handleClick(d, !isChecked(d))
                                                event.target.checked ?
                                                    add_db({ db: d })
                                                    : remove_db({ db: d })
                                            }}
                                        />
                                        : <></>
                                }
                                label={d}
                            />
                        </AccordionSummary>
                        <AccordionDetails>
                            <CollectionPerDBS handleClick={handleClick} checked={isChecked(d)} workspace={props.name} db={d} purpose={props.purpose} />
                        </AccordionDetails>
                    </Accordion>
                ))
                : <></>
            }
        </div>
    );
}

export default DBSPerWorkspaces;
