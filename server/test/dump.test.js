const fs = require('fs').promises;
const { doDump } = require('../commands/dump')
const { getWorkspaceName } = require('../commands/dump')

describe("Do dump", _ => {
    it('Do dump may success', async () => {
        const obj = { workspace_to_dump: uri, dbs: [] };
        const result = await doDump(obj);
        expect(result.isSucceeded).toEqual(true);

    })

    it('Do dump may fail', async _ => {
        const obj = { workspace_to_dump: wrong_uri, dbs: [] };
        const result = await doDump(obj);
        expect(result.isSucceeded).toEqual(false);
    })

    it('Get correct workspace for MongoDB url', _ => {
        const url = uri;
        const workspaceName = getWorkspaceName(url);
        expect(workspaceName).toEqual("MongoDB");
    })
});
