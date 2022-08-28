require('dotenv').config()
const { MongoClient } = require('mongodb');


async function getFilters() {
    try {
        const url = `${process.env.FILTERS_PORT}/`;
        const client = await MongoClient.connect(url);
        const connect = client.db(process.env.FILTER_DATA);
        console.log({connect})
        const filters = await connect
            .collection(process.env.FILTER_COLLECTION)
            .find({}, {}).toArray();
        client.close();
        return filters;
    } catch (error) {
        throw error;;
    }
}

module.exports = { getFilters };
