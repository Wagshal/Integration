const request = require('supertest');

const app = require("../server");

describe('check submit route for dump and restore', () => {

    it('check connection for dump function', async () => {
        await request(app)
            .post(`/submit/dump`)
            .set('Content-type', 'application/json')
            .expect(200);
    });

    it('check connection for restore function', async () => {
        const query = {
            uri: "mongodb://localhost:27017",
            dumpFile: "MongoDB_2022-07-18T09.40.51.116Z"
        };
        await request(app)
            .post(`/submit/restore`)
            .set('Content-type', 'application/json')
            .send({ query })
            .expect(200);
    });
});
