require('dotenv').config()
const { MongoClient } = require('mongodb');

const { dropViewCollection } = require('../../commands/filter/drop-view-collection');

describe('drop view collection', () => {

    it('should drop collection by query', async () => {
        const url = `${process.env.FILTERS_PORT}/`;
        const client = await MongoClient.connect(url);
        const connect = client.db(process.env.FILTER_DATA);
        await connect.createCollection("test");
        const data = {
            workspace: process.env.FILTERS_PORT,
            db: process.env.FILTER_DATA,
            collection: "test",
        };
        const res = await dropViewCollection(data);
        client.close()
        expect(res).toEqual("Collection deleted");
    });

});

