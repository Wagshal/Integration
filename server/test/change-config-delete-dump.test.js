const fs = require('fs');

const { changeConfigFile } = require('../commands/config-delete-dump-files');

describe("Change config delete dump files", () => {

    it('Change date in delete dump config file', async () => {
        const details = {
            Frequency_Of_Deleting_Dump: null,
            Last_Date: 20
        };
        const result = await changeConfigFile(details);
        expect(result).toEqual({ Succeeded: true });

    })

    it('Anything in delete-dump-configuration is null', async () => {
        const delete_dump_files_details = require('../config/delete-dump-files-date.json');
        let result = true;
        await Object.entries(delete_dump_files_details).filter(([key, value]) => {
            if (value == null) {
                result = false
            }
        });
        expect(result).toEqual(true);
    })
});
