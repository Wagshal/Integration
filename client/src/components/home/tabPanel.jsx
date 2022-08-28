import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import IndexPage from './index';
import ExitstDumpFile from '../restoreExistsDumpFile/ExitstDumpFile';
import WorkspacesDump from './workspacesDump';
import AutoForm from '../AutoJobs/AutoForm';
import EditWorkspace from '../EditWorkspace/editWorkspace';
import { AutoCopmleteKeyContext } from '../../context/AutoCopmleteKey/AutoCopmleteKeyContext';

function TabPanel(props) {

    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        justifyContent: 'center',
        fontSize: '1rem'
    },
}));

export default function ScrollableTabsButtonAuto() {

    const classes = useStyles();
    const { state } = useContext(AutoCopmleteKeyContext);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={classes.root} key={state.key}>
            <AppBar position="static" color="default">
                <Tabs
                    style={{ justifyContent: 'center' }}
                    className="overrideColor"
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab className="Tab" label="HOME" {...a11yProps(0)} />
                    <Tab className="Tab" label="RESTORE FROM EXISTS FILES" {...a11yProps(1)} />
                    <Tab className="Tab" label="FILTER" {...a11yProps(2)} />
                    <Tab className="Tab" label="AUTO JOB TO DUMP & RESTORE" {...a11yProps(3)} />
                    <Tab className="Tab" label="EDIT WORKSPACES" {...a11yProps(4)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <IndexPage />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ExitstDumpFile />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <WorkspacesDump className={classes.innerFlex} id="flterComponent" purpose="filter" />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <AutoForm />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <EditWorkspace />
            </TabPanel>
        </div>
    );
}