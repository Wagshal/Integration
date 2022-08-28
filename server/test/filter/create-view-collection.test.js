require('dotenv').config()
const { MongoClient } = require('mongodb');

const { insertFilter } = require('../../commands/filter/add-filter');
const { createViewCollection } = require('../../commands/filter/create-view-collection');


describe('create view collection', () => {

    it('should create collection by query', async () => {
        const testDoc = { name: 'Jhon', age: 5 };
        await insertFilter(testDoc);
        const data = {
            workspace: process.env.FILTERS_PORT,
            db: process.env.FILTER_DATA,
            collection: process.env.FILTER_COLLECTION,
            query: JSON.stringify({ name: 'Jhon' }),
            projection: JSON.stringify({ name: 1 }),
            description: "filter by name"
        };
        const res = await createViewCollection(data);
        expect(res).toEqual(`${process.env.FILTER_COLLECTION}_${"filter_by_name"}`);
        await deleteDoc(testDoc._id);
        await deleteCollection(res);
    });

});

async function deleteDoc(id) {
    const url = `${process.env.FILTERS_PORT}/`;
    const client = await MongoClient.connect(url);
    const connect = client.db(process.env.FILTER_DATA);
    await connect.collection(process.env.FILTER_COLLECTION).deleteOne({ _id: id });
    client.close();
}

async function deleteCollection(collection) {
    const url = `${process.env.FILTERS_PORT}/`;
    const client = await MongoClient.connect(url);
    const connect = client.db(process.env.FILTER_DATA);
    await connect.dropCollection(collection);
    client.close();
}

