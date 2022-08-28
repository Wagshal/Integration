require('dotenv').config()
const request = require('supertest');
const app = require("../server");

const { importWorkspaces } = require('../commands/config-workspaces-get-url');
const defaultDumpUrl = process.env.DEFAULT_DUMP_URL;

describe('Check import workspaces response for both dump n=and restore', () => {
    const dumpPath = process.env.DUMP_PATH || 'config/workspaces-configuration-dump.json';
    const restorePath = process.env.DUMP_PATH || 'config/workspaces-configuration-restore.json';
    let dumpWorkspaces;
    let restoreWorksapces;

    beforeAll(async () => {
        dumpWorkspaces = importWorkspaces(dumpPath),
            restoreWorksapces = importWorkspaces(restorePath)
    });

    it('Check import workspaces for dump', async () => {
        const response = await request(app).get('/get_workspaces_dump');
        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.text)).toEqual({
            responeWorkspacesDump: dumpWorkspaces,
            config: defaultDumpUrl
        });
    });

    it('Check import workspace for restore', async () => {
        const response = await request(app).get('/get_workspaces_restore');
        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.text)).toEqual({
            responeWorkspacesRestore: restoreWorksapces
        });
    });

});
