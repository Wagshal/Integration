const { MongoClient } = require('mongodb');

async function dropViewCollection(data) {
    try {
        const url = `${data.workspace}/`;
        const client = await MongoClient.connect(url);
        const connect = client.db(data.db);
        await connect.dropCollection(data.collection);
        client.close();
        return "Collection deleted";
    }
    catch (error) {
        return error;
    }
}

module.exports = { dropViewCollection };
