import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import ConfirmationSubmit from './ConfirmationSubmit';
import DataSelected from '../home/selectedData';
import Days from './Days';
import Frequency from './Frequency';
import WorkspacesDump from '../home/workspacesDump';
import WorkspacesRstore from '../home/workspaceRestore';

const useStyles = makeStyles(({

    submitButton: {
        width: '10vw',
        height: '7vh',
        color: 'teal',
        backgroundColor: '#e0e0e0',
        marginTop: '-22vh'
    },
    innerFlex: {
        flex: '1 1 auto',
        marginTop: '2vh'
    },
    fourFlex: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '5vh',
        margin: '3vw',
        marginRight: '7vh'
    },
    title: {
        fontSize: '1.1rem',
        marginBottom: '0.8vh',
        width: '350px'
    },
    dayAndTime: {
        textAlign: 'center',
        borderRadius: '5px',
        width: '11vw',
        borderColor: 'teal',
        height: '5.5vh',
        margin: '1vh',
        fontSize: '1.1em'
    },
    space: {
        margin: '3.5vh'
    }
}));

function AutoForm() {

    const classes = useStyles();
    const [ShowConfirmation, setShow] = useState(false);
    const [date, setDate] = useState(new Date().toDateString());
    const [time, setTime] = useState(new Date().getHours() + ":" + new Date().getMinutes());
    const [weekly, setDays] = useState(false);
    const [frequency, setfrequency] = useState('Once');
    const [CheckDate, setCheckDate] = useState(false);

    const handleDateChange = (e) => {
        checkDate(e.target.value);
        setDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const handleClick = (frequencyTime) => {
        setfrequency(frequencyTime);
        if (frequencyTime === 'Once') {
            checkDate(date);
        }
        if (frequencyTime === 'Weekly') {
            setDays(true);
        }
        else {
            setDays(false);
        }
    };

    const handleClickDays = (dayInWeek) => {
        if (dayInWeek === '')
            dayInWeek = 'Sunday';
        setfrequency(`Weekly:${dayInWeek}`);
    }

    const checkDate = (date) => {

        if (new Date(date).getTime() >= new Date().getTime()) {
            setCheckDate(false);
        }
        else {
            if (new Date(date).getDate() === new Date().getDate()) {
                setCheckDate(false);
            }
            else {
                setCheckDate(true);
            }
        }
    };

    const validateInput = (e) => {
        setShow(true);
        e.preventDefault();
    };

    return (
        <div className={classes.all}>
            <form onSubmit={validateInput} className={classes.form}>
                <div className={classes.fourFlex}>
                    <WorkspacesDump className={classes.innerFlex} purpose="dump" />
                    <WorkspacesRstore className={classes.innerFlex} />
                    <div className={classes.innerFlex}>
                        <div className={classes.space}>
                            <div className={classes.title}> choose a day for auto dump </div>
                            <input
                                className={classes.dayAndTime}
                                type="date"
                                name='date'
                                value={date}
                                onChange={(e) => { handleDateChange(e) }}
                            >
                            </input>
                            {CheckDate ?
                                <div >The selected time before the current date</div> :
                                <></>
                            }
                        </div>
                        <div className={classes.space}>
                            <div className={classes.title}> choose a time for auto dump </div>
                            <input
                                className={classes.dayAndTime}
                                type="time"
                                name='time'
                                value={time}
                                onChange={(e) => { handleTimeChange(e) }}
                            ></input>
                        </div>
                        <div className={classes.space}>
                            <div className={classes.title}> choose a frequency for auto dump </div>
                            <Frequency handleClick={handleClick} />
                            <div className={classes.space}></div>
                            {weekly === true ?
                                <Days handleClick={handleClickDays} /> :
                                <></>
                            }
                        </div>
                    </div>
                    <div className={classes.innerFlex}>
                        <DataSelected />
                    </div>
                </div>
                <Button type="submit" className={classes.submitButton}>submit</Button>
            </form>
            {ShowConfirmation === true ?
                < ConfirmationSubmit date={date} time={time} frequency={frequency} display={true} /> :
                <></>
            }
        </div>
    )
}

export default AutoForm;
