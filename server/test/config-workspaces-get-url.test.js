require('dotenv').config()
const request = require('supertest');

const app = require("../server");
const config = process.env.DEFAULT_DUMP_URL;

const { importWorkspaces } = require('../commands/config-workspaces-get-url');

describe('check function return workspace for dump and restore get url', () => {

    let dumpRespone
    let workspaceRestore

    beforeAll(async () => {
        dumpRespone = importWorkspaces('config/workspaces-configuration-dump.json'),
            workspaceRestore = importWorkspaces('config/workspaces-configuration-restore.json')
    });

    it('check router config workspace dump', async () => {
        const response = await request(app).get('/get_workspaces_dump');
        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.text)).toEqual({
            responeWorkspacesDump: dumpRespone,
            config
        });
    });

    it('check router config workspace restore', async () => {
        const response = await request(app).get('/get_workspaces_restore');
        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.text)).toEqual({
            responeWorkspacesRestore: workspaceRestore
        });
    });
});
