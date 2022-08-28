require('dotenv').config()
const fs = require('fs');
const request = require('supertest');

const app = require('../server');
const dump_folder = process.env.DUMP_FOLDER;

describe('check get dump file route', _ => {

    it('Does return a folder list and connect to the route', async() => {
        let file = fs.readdirSync(dump_folder)
        const response = await request(app).get('/get_dump_file');
        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.text)).toEqual(file);
    });
});
