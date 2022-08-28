require('dotenv').config()
const { MongoClient } = require('mongodb');


async function insertFilter(data) {
    try {
        const url = `${process.env.FILTERS_PORT}/`;
        const client = await MongoClient.connect(url);
        const connect = client.db(process.env.FILTER_DATA);
        const object = await connect
            .collection(process.env.FILTER_COLLECTION)
            .insertOne(data);
        client.close();
        return object;
    } catch (error) {
        throw error;
    }
}

module.exports = { insertFilter };
