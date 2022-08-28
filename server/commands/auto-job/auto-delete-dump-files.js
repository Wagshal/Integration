require('dotenv').config()
const cron = require('node-cron');
const fs = require('fs');

const routing_to_dump = process.env.DUMP_FILE;
const delete_dump_files_details = require('../../config/delete-dump-files-date.json');
const logger = require('../../services/loggerService');
const logDetailsObj = require('../../classes/details-for-log');

function deleteDumpFiles() {
    const dateForDalete = new Date();
    dateForDalete.setDate(dateForDalete.getDate() - delete_dump_files_details.Last_Date);
    const filenames = fs.readdirSync(routing_to_dump);
    let numDelete = 0;
    filenames.map((filename) => {
        const filenameDate = new Date(filename.slice((filename).indexOf('_') + 1, (filename).indexOf('T')));
        if (filenameDate.valueOf() <= dateForDalete.valueOf()) {
            numDelete += 1;
            fs.rmSync(`${routing_to_dump}/${filename}`, { recursive: true });
        }
    });
    const loggerData = new logDetailsObj('deleteDumpFiles', 'Deleting old dump files', true);
    logger.info({ ...loggerData, Deleted_at: `${delete_dump_files_details.Hour_To_Delete_Dump}:00`, Number_of_folders_deleted: numDelete });
}

function cronFunction() {
    const time = `${00} ${delete_dump_files_details.Hour_To_Delete_Dump} * * * `;
    cron.schedule(time, _ => {
        deleteDumpFiles();
    })
}

module.exports = { deleteDumpFiles, cronFunction };
