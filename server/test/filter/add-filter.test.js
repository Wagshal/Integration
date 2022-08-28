require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb');

const { insertFilter } = require('../../commands/filter/add-filter');
const { getRandomObject } = require('../helpers/object-generator');


describe('insertOne', () => {

    it('should return a object with insertedId ObjectId property', async () => {
        const testDoc = getRandomObject();
        const { insertedId } = await insertFilter(testDoc);
        expect(insertedId).toBeDefined();
        expect(insertedId).toBeInstanceOf(ObjectId);
        const url = `${process.env.FILTERS_PORT}/`;
        const client = await MongoClient.connect(url);
        const connect = client.db(process.env.FILTER_DATA);
        const object = await connect
            .collection(process.env.FILTER_COLLECTION)
            .findOne({ _id: insertedId });
        expect(object).toEqual({
            _id: insertedId,
            ...testDoc
        });
        await connect
            .collection(process.env.FILTER_COLLECTION)
            .deleteOne({ _id: insertedId });
        client.close();
    });
});

