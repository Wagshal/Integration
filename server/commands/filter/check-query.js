const { MongoClient } = require('mongodb');

const { insertFilter } = require('./add-filter');
const { validQuery } = require('./valid-query');

async function checkQuery(data) {
    data.query = validQuery(data.query);
    data.projection = validQuery(data.projection);
    try {
        const url = `${data.workspace}/`;
        const client = await MongoClient.connect(url);
        const connect = client.db(data.db);
        await connect.collection(data.collection)
            .find(JSON.parse(data.query), JSON.parse(data.projection))
            .toArray();
        client.close();
        const object = await insertFilter(data);
        return { isSucceeded: true, object: object };
    } catch (error) {
        return { isSucceeded: false, errorMsg: error.message };
    }
}

module.exports = { checkQuery };
