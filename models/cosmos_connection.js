//db connection
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require('./cosmosSchema');

/* This script ensures that the DB is setup and populate correctly*/
async function create(client, databaseId, containerId){
    const partitionKey = config.partitionKey;

    //Create database if it doesnt exist
const {database} = await client.databases.createIfNotExists({
    id: databaseId
});
console.log(`Connection to cosmosDB successfull!:\n${database.id}\n`)

//Create the container if it doesn not exist
const {container} = await client
.database(databaseId)
.containers.createIfNotExists(
    { id: containerId, partitionKey},
    { offerThroughput: 400}
);
console.log(`Connection to container:\n${container.id}\n`);
}

module.exports = {create}