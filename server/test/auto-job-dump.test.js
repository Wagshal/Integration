const cron = require('node-cron');
const request = require('supertest')
const app = require("../server")
const { doDumpAndRestore } = require('../commands/auto-job-dump');
const DumpModule = require('../commands/dump');
const RestoreModule = require('../commands/restore');

jest.mock('../commands/dump', _ => {
    return {
        ...jest.requireActual('../commands/dump'),
        doDump: jest.fn()
    };
});

jest.mock('../commands/restore', _ => {
    return {
        ...jest.requireActual('../commands/restore'),
        doRestore: jest.fn()
    };
});

let cronScheduleSpy, doDumpSpy, doRestoreSpy;

const date = new Date('2022-07-25T14:59:17.817Z');
const month = date.getMonth() + 1;
const day = date.getDate();
const hour = date.getHours();
const minute = date.getMinutes();

describe('check function auto jobs to dump and restore', _ => {
    describe('check the object to do dump and restore ', _ => {
        beforeEach(async _ => {
            cronScheduleSpy = jest
                .spyOn(cron, 'schedule')
                .mockReturnValue({
                    start: _ => { }
                });

            const date = new Date('2022-07-25T14:59:17.817Z');
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
        });

        afterEach(async () => {
            cronScheduleSpy && cronScheduleSpy.mockRestore();
        });

        it('check autoJobDumpAndRestore by constant frequency-Every Hour', async _ => {
            objectToAutoDump = {
                "date": "2022-07-25T14:59:17.817Z",
                "frequency": "Every Hour",
                "state": {
                    "workspace_to_dump": "mongodb://docker:mongopw@localhost:49153",
                    "dbs": [],
                    "workspace_to_restore": ""
                }
            }

            const timeToAutoDump = '0 * * * *'
            const response = await request(app)
                .post('/dump_auto_job/')
                .set('Content-type', 'application/json')
                .send(objectToAutoDump);
            expect(response.statusCode).toEqual(200);
            expect(cronScheduleSpy).toHaveBeenCalledTimes(1)
            expect(cronScheduleSpy.mock.calls[0][0]).toEqual(timeToAutoDump)
        });

        it('check autoJobDumpAndRestore by constant frequency-Everyday', async _ => {
            objectToAutoDump = {
                "date": "2022-07-25T14:59:17.817Z",
                "frequency": "Everyday",
                "state": {
                    "workspace_to_dump": "mongodb://docker:mongopw@localhost:49153",
                    "dbs": [],
                    "workspace_to_restore": ""
                }
            }

            const timeToAutoDump = `${minute} ${hour} * * *`
            const response = await request(app)
                .post('/dump_auto_job/')
                .set('Content-type', 'application/json')
                .send(objectToAutoDump);
            expect(response.statusCode).toEqual(200);
            expect(cronScheduleSpy).toHaveBeenCalledTimes(1)
            expect(cronScheduleSpy.mock.calls[0][0]).toEqual(timeToAutoDump)
        });

        it('check autoJobDumpAndRestore by constant frequency-Monthy', async _ => {
            objectToAutoDump = {
                "date": "2022-07-25T14:59:17.817Z",
                "frequency": "Monthy",
                "state": {
                    "workspace_to_dump": "mongodb://docker:mongopw@localhost:49153",
                    "dbs": [],
                    "workspace_to_restore": ""
                }
            }
            const timeToAutoDump = `${minute} ${hour} ${day} * *`
            const response = await request(app)
                .post('/dump_auto_job/')
                .set('Content-type', 'application/json')
                .send(objectToAutoDump);
            expect(response.statusCode).toEqual(200);
            expect(cronScheduleSpy).toHaveBeenCalledTimes(1)
            expect(cronScheduleSpy.mock.calls[0][0]).toEqual(timeToAutoDump)
        });

        it('check autoJobDumpAndRestore by constant frequency-Yearly', async _ => {
            objectToAutoDump = {
                "date": "2022-07-25T14:59:17.817Z",
                "frequency": "Yearly",
                "state": {
                    "workspace_to_dump": "mongodb://docker:mongopw@localhost:49153",
                    "dbs": [],
                    "workspace_to_restore": ""
                }
            }
            const timeToAutoDump = `${minute} ${hour} ${day} ${month} *`
            const response = await request(app)
                .post('/dump_auto_job/')
                .set('Content-type', 'application/json')
                .send(objectToAutoDump);
            expect(response.statusCode).toEqual(200);
            expect(cronScheduleSpy).toHaveBeenCalledTimes(1)
            expect(cronScheduleSpy.mock.calls[0][0]).toEqual(timeToAutoDump)
        });

        it('check autoJobDumpAndRestore by constant frequency-Once', async _ => {
            objectToAutoDump = {
                "date": "2022-07-25T14:59:17.817Z",
                "frequency": "Once",
                "state": {
                    "workspace_to_dump": "mongodb://docker:mongopw@localhost:49153",
                    "dbs": [],
                    "workspace_to_restore": ""
                }
            }
            const timeToAutoDump = `${minute} ${hour} ${day} ${month} *`
            const response = await request(app)
                .post('/dump_auto_job/')
                .set('Content-type', 'application/json')
                .send(objectToAutoDump);
            expect(response.statusCode).toEqual(200);
            expect(cronScheduleSpy).toHaveBeenCalledTimes(1)
            expect(cronScheduleSpy.mock.calls[0][0]).toEqual(timeToAutoDump)
        });

        it('check autoJobDumpAndRestore by constant frequency-Weekly', async _ => {
            objectToAutoDump = {
                "date": "2022-07-25T14:59:17.817Z",
                "frequency": "Weekly:Sunday",
                "state": {
                    "workspace_to_dump": "mongodb://docker:mongopw@localhost:49153",
                    "dbs": [],
                    "workspace_to_restore": ""
                }
            }
            const timeToAutoDump = `${minute} ${hour} * * Sunday`
            const response = await request(app)
                .post('/dump_auto_job/')
                .set('Content-type', 'application/json')
                .send(objectToAutoDump);
            expect(response.statusCode).toEqual(200);
            expect(cronScheduleSpy).toHaveBeenCalledTimes(1)
            expect(cronScheduleSpy.mock.calls[0][0]).toEqual(timeToAutoDump)
        });
    })

    describe('check doDumpAndRestore function powered by autoJobDumpAndRestore', _ => {
        let dumpFile = 'dumpFileName';
        beforeEach(async _ => {
            doRestoreSpy = jest
                .spyOn(RestoreModule, 'doRestore')
                .mockReturnValue({
                    isSucceeded: true
                });
        });

        afterEach(async _ => {
            doDumpSpy && doDumpSpy.mockRestore();
            doRestoreSpy && doRestoreSpy.mockRestore();
        });

        it('get false from dump function powered by doDumpAndRestore function that get workspace_to_restore', async _ => {
            doDumpSpy = jest
                .spyOn(DumpModule, 'doDump')
                .mockReturnValue({
                    isSucceeded: false
                });

            const objectToDump = {
                "workspace_to_dump": 'mongodb://docker:mongopw@localhost:49153',
                "dbs": []
            }

            const workspace_to_restore = 'mongodb://docker:mongopw@localhost:49153';

            await doDumpAndRestore(objectToDump, workspace_to_restore)

            expect(doDumpSpy).toHaveBeenCalledTimes(1)
            expect(doDumpSpy.mock.calls[0][0]).toEqual(objectToDump)
            expect(doRestoreSpy).toHaveBeenCalledTimes(0)
        });

        it('get false from dump function powered by doDumpAndRestore function that not get workspace_to_restore ', async _ => {
            doDumpSpy = jest
                .spyOn(DumpModule, 'doDump')
                .mockReturnValue({
                    isSucceeded: false
                });
            const objectToDump = {
                "workspace_to_dump": 'mongodb://docker:mongopw@localhost:49153',
                "dbs": []
            }

            const workspace_to_restore = '';

            await doDumpAndRestore(objectToDump, workspace_to_restore)

            expect(doDumpSpy).toHaveBeenCalledTimes(1)
            expect(doDumpSpy.mock.calls[0][0]).toEqual(objectToDump)
            expect(doRestoreSpy).toHaveBeenCalledTimes(0)
        });

        it('get true from dump function powered by doDumpAndRestore function that not get workspace_to_restore', async _ => {
            doDumpSpy = jest
                .spyOn(DumpModule, 'doDump')
                .mockReturnValue({
                    isSucceeded: true,
                    dumpFile
                });

            const objectToDump = {
                "workspace_to_dump": 'mongodb://docker:mongopw@localhost:49153',
                "dbs": []
            }
            const workspace_to_restore = '';

            await doDumpAndRestore(objectToDump, workspace_to_restore);;

            expect(doDumpSpy).toHaveBeenCalledTimes(1);
            expect(doDumpSpy.mock.calls[0][0]).toEqual(objectToDump);
            expect(doRestoreSpy).toHaveBeenCalledTimes(0);
        });

        it('get true from dump function powered by doDumpAndRestore function that get workspace_to_restore', async _ => {
            doDumpSpy = jest
                .spyOn(DumpModule, 'doDump')
                .mockReturnValue({
                    isSucceeded: true,
                    dumpFile
                });

            const objectToDump = {
                "workspace_to_dump": 'mongodb://docker:mongopw@localhost:49153',
                "dbs": []
            };

            const workspace_to_restore = 'mongodb://docker:mongopw@localhost:49153';

            await doDumpAndRestore(objectToDump, workspace_to_restore);

            const objectToRestore = {
                "dumpFile": dumpFile,
                "uri": workspace_to_restore
            };

            expect(doDumpSpy).toHaveBeenCalledTimes(1);
            expect(doDumpSpy.mock.calls[0][0]).toEqual(objectToDump);
            expect(doRestoreSpy).toHaveBeenCalledTimes(1);
            expect(doRestoreSpy.mock.calls[0][0]).toEqual(objectToRestore);
        });
    })
});
