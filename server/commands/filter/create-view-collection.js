const { MongoClient } = require('mongodb');

const { validCollectionName } = require('./valid-collection-name');

async function createViewCollection(data) {
console.log('createViewCollection')
    try {
        const url = `${data.workspace}/`;
        let viewCollectionName = `${data.collection}_${validCollectionName(data.description)}`;
        const client = await MongoClient.connect(url);
        const connect = client.db(data.db);
        let pipeline = [
            { '$match': JSON.parse(data.query) }
        ];
        if (data.projection !== '{}')
            pipeline = [...pipeline, { '$project': JSON.parse(data.projection) }];
        await connect.createCollection(
            viewCollectionName,
            {
                "viewOn": data.collection,
                "pipeline": pipeline
            }
        );
        client.close();
        return viewCollectionName;
    }
    catch (error) {
        return error;
    }
}

module.exports = { createViewCollection };
