const { MongoClient } = require('mongodb');

async function importDBS(data) {
    const workspace = data.workspace;
    let arrDBNames = [];
    try {
        const client = await MongoClient.connect(workspace);
        const connect = client.db().admin();
        const db = await connect.listDatabases();
        arrDBNames = db.databases.map((db) => (db.name));
        client.close()
    } catch (error) {
        arrDBNames = null;
    }
    return arrDBNames;
}

async function importCollections(data) {
    const databaseName = data.db;
    const url = data.workspace;
    let collectionsName = [];

    try {
        const client = await MongoClient.connect(url);
        const connect = client.db(databaseName);
        const collections = await connect.listCollections().toArray();
        collections.map((collection) => {
            if (!collection.name.startsWith("system."))
                collectionsName = [...collectionsName, collection.name];
        });
        client.close()
        return collectionsName;
    } catch (err) {
        throw err;
    }
}

module.exports = { importDBS, importCollections };
