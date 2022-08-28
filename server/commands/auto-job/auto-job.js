const cron = require('node-cron');
const Emitter = require('events').EventEmitter;

const logger = require('../../services/loggerService');
const DumpQueue = require('../../models/dump.queue');
const logDetailsObj = require('../../classes/details-for-log');
const { doRestore } = require('./../restore');

async function autoJobDumpAndRestore(objectToDumpAuto) {
    try {
        const date = new Date(objectToDumpAuto.date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();

        let timeToAutoDump;
        if (objectToDumpAuto.frequency == 'Every Hour')
            timeToAutoDump = '0 * * * *';

        if (objectToDumpAuto.frequency == 'Everyday')
            timeToAutoDump = `${minute} ${hour} * * *`;

        if (objectToDumpAuto.frequency.includes('Weekly')) {
            let dayInWeek = objectToDumpAuto.frequency.split(':');
            timeToAutoDump = `${minute} ${hour} * * ${dayInWeek[1]}`;
        }

        if (objectToDumpAuto.frequency == 'Monthy')
            timeToAutoDump = `${minute} ${hour} ${day} * *`;

        if (objectToDumpAuto.frequency == 'Yearly' || objectToDumpAuto.frequency == 'Once')
            timeToAutoDump = `${minute} ${hour} ${day} ${month} *`;

        objectToDump = {
            "workspace_to_dump": objectToDumpAuto.state.workspace_to_dump,
            "dbs": objectToDumpAuto.state.dbs
        };
        const autoDump = cron.schedule(timeToAutoDump, async () => {
            await doDumpAndRestore(objectToDump, objectToDumpAuto.state.workspace_to_restore)
        });
        autoDump.start();
        return true;
    }
    catch (error) {
        let loggerData = new logDetailsObj('autoJobDumpAndRestore', 'Activating dump and restore automatically', false);
        logger.info({ ...loggerData, fell_in_action: 'autoJobDumpAndRestore', errorMsg: error.message });
        return error;
    }
}

async function doDumpAndRestore(objectToDump, workspace_to_restore) {
    try {
        const newDump = { dumpDetails: objectToDump, finish: new Emitter() };
        newDump.finish.on('finish', async(dumpAutoResult) => {
            const loggerData = new logDetailsObj('autoJobDump', 'Activating dump automatically', true);
            logger.info({ ...loggerData, Do_dump_at: new Date().getHours() });
            if (dumpAutoResult.isSucceeded && workspace_to_restore != '') {
                objectToRestore = {
                    "dumpFile": dumpAutoResult.dumpFile,
                    "uri": workspace_to_restore
                };
                try {
                    await doRestore(objectToRestore);
                    let loggerData = new logDetailsObj('autoJobRestore', 'Activating restore automatically', true);
                    logger.info({ ...loggerData, Do_restoere_at: new Date().getHours() });
                } catch (error) {
                    const loggerData = new logDetailsObj('autoJobRestore', 'Activating restore automatically', false);
                    logger.info({ ...loggerData, errorMsg: error.message });
                    throw error;
                }
            }
        });
        DumpQueue.addItem(newDump);
    } catch (error) {
        const loggerData = new logDetailsObj('autoJobDump', 'Activating dump automatically', false);
        logger.info({ ...loggerData, errorMsg: error.message });
        throw error;
    }
}

module.exports = { autoJobDumpAndRestore, doDumpAndRestore };
