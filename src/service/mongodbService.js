const {MongoClient} = require('mongodb');

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const dbName = 'fitdevs';

function upsert(query, updateQuery, collection, options) {
    return client.db(dbName).collection(collection).findOneAndUpdate(query, updateQuery, {upsert: true, ...options});
}

//https://www.mongodb.com/docs/drivers/node/current/fundamentals/aggregation/
async function getAggregateTotal(query, collection) {
    const aggCursor = client.db(dbName).collection(collection).aggregate([
        {$group: {_id: null, total: {$sum: "$total"}}}
    ]);
    const {total} = await aggCursor.next();
    return total;
}

async function findOne(query, options, collection) {
    try {
        return await client.db(dbName).collection(collection).findOne();
    } catch (err) {
        console.error("Failed to run query: findOne", err)
    }
}

async function connect() {
    try {
        return await client.connect();
    } catch (error) {
        console.log("Problem connecting to mongo db", error);
        throw error;
    }
}

async function disconnect() {
    try {
        return await client.close();
    } catch (error) {
        console.log("Problem disconnecting to mongo db", error);
    }
}


module.exports = {
    mongodb: {
        connect,
        upsert,
        findOne,
        disconnect,
        getAggregateTotal
    }
}
