const { MongoClient } = require('mongodb');

async function checkConnection(url) {
    let isSucceeded;
    console.log({url})
    try {
        const client = await MongoClient.connect(url)
        isSucceeded = true;
        client.close()
    } catch (error) {
        isSucceeded = false;
    }
    return isSucceeded;
}

module.exports = { checkConnection };
