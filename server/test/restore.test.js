const fs = require('fs');

const { doRestore, restore } = require('../commands/restore');

const dumpFileTest = process.env.DUMP_FILE_TEST || "Q:/Integration_Project/trydump";
const uri = process.env.MONGODB || "mongodb://localhost:27017";

describe('Do restore', _ => {
    it('Do restore may success', async () => {
        let fileInside;
        fs.readdirSync(dumpFileTest).find(f => { file = f; return });
        let dumpFile = `${dumpFileTest}/${file}`;
        fs.readdirSync(dumpFile).find(f => { fileInside = f; return });
        dumpFile = `${dumpFile}/${fileInside}`;
        const obj = { "uri": uri, "dumpFile": dumpFile };
        const result = await restore(obj);
        expect(result).toEqual({ isSucceeded: true });
    });

    it('Do restore may fail', async () => {
        let file, fileInside
        fs.readdirSync(dumpFileTest).find(f => { file = f; return });
        let dumpFile = `${dumpFileTest}/${file}`;
        const expectedRes = {
            "errorMsg": "workspace is not found",
            "isSucceeded": false,
        };
        fs.readdirSync(dumpFile).find(f => { fileInside = f; return });
        dumpFile = `${dumpFile}/fileInside`;
        const obj = { "uri": uri, "dumpFile": dumpFile };
        const result = await restore(obj);
        expect(result).toEqual(expectedRes);
    });

    it('send to doResore - full file', async () => {
        let fI
        fs.readdirSync(dumpFileTest).find(f => { fI = f; return })
        const expectedRes =
            { isSucceeded: true };
        const obj = { "uri": uri, "dumpFile": fI }
        const result = await doRestore(obj, dumpFileTest)
        expect(result).toEqual(expectedRes)
    });

    it('send to doResore - full file', async () => {
        const result =
            { isSucceeded: true }
        let uriAndDump = { "uri": "mongodb://localhost:27017", "dumpFile": "MongoDB_2022-07-14T09.43.18.179Z" }
        let res = await doRestore(uriAndDump, dumpFileTest)
        expect(res).toEqual(result)
    });
});
