require('dotenv').config()
const { MongoClient } = require('mongodb');

const { insertFilter } = require('../../commands/filter/add-filter');
const { checkQuery } = require('../../commands/filter/check-query');

describe('find', () => {

    it('should find object when query is some property', async () => {
        const testDoc = { name: 'Jhon', age: 5 };
        await insertFilter(testDoc);
        const data = {
            workspace: process.env.FILTERS_PORT,
            db: process.env.FILTER_DATA,
            collection: process.env.FILTER_COLLECTION,
            query: JSON.stringify({ name: 'Jhon' }),
            projection: JSON.stringify({ name: 1 })
        };
        const res = await checkQuery(data);
        expect(res.isSucceeded).toBe(true);
        await deleteDoc(testDoc._id);
        await deleteDoc(res.object.insertedId);
    });

    describe('Errors', () => {
        it('should throw an error if query is not object', async () => {
            const testDoc = { name: 'Jhon', age: 5 };
            await insertFilter(testDoc);
            const data = {
                workspace: process.env.FILTERS_PORT,
                db: process.env.FILTER_DATA,
                collection: process.env.FILTER_COLLECTION,
                query: JSON.stringify(1),
                projection: JSON.stringify({ name: 1 })
            };
            const res = await checkQuery(data);
            expect(res.isSucceeded).toBe(false);
            await deleteDoc(testDoc._id);
        });

    });

});


async function deleteDoc(id) {
    const url = `${config.FILTERS_PORT}/`;
    const client = await MongoClient.connect(url);
    const connect = client.db(config.FILTER_DATA);
    await connect.collection(config.FILTER_COLLECTION).deleteOne({ _id: id });
    client.close();
}

