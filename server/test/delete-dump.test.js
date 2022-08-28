require('dotenv').config()
const fs = require('fs');

const routing_to_dump = process.env.DUMP_FOLDER;
const { deleteDumpFiles } = require('../commands/delete-dump-files');

describe("Delete dump files per date", () => {
    it('get valid date from name folder', async () => {
        const filenames = fs.readdirSync(routing_to_dump)
        const date = (new Date(filenames[0].slice((filenames[0]).indexOf('_') + 1, (filenames[0]).indexOf('T')))).toString();
        expect(date).not.toEqual("Invalid Date");
    })

    it('delete dump folder', async () => {
        const filenames1 = fs.readdirSync(routing_to_dump);
        deleteDumpFiles();
        const filenames2 = fs.readdirSync(routing_to_dump);
        expect(filenames1.length).not.toEqual(filenames2.length);
    })
});
