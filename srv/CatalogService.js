const cds = require("@sap/cds");
const MongoClient = require("mongodb").MongoClient;

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

// Get the credentials for a the mongo cluster service
const credentials = appEnv.getServiceCreds('my-mongo-cluster');
console.log(credentials);
const uri = credentials.uri;

console.log(credentials);

/*const dotenv = require('dotenv');
dotenv.config();
//Create .env file with Host_URL and keep the MongoDB there
const uri = process.env.HOST_URL;*/

const db_name = "BPATest";
const client = new MongoClient(uri);
const { ObjectId } = require("mongodb");



async function _createRate(req) {
    await client.connect();
    var db = await client.db(db_name);
    var rate = await db.collection("TRMCollect");
    const results = await rate.insertOne(req.data);

    if(results.insertedId) {
        req.data.id = results.insertedId.toString();
    }
    return req.data;
}

async function _getRates(req) {
    await client.connect();
    var dataBase = await client.db(db_name);
    var rate = await dataBase.collection("TRMCollect");

    var Limit, Offset, Filter;

    console.log(req.query.SELECT.one);
    if(req.query.SELECT.one) {
        var sId = req.query.SELECT.from.ref[0].where[2].val;
        Filter = {
            "_id": new ObjectId(sId)
        };
    }

    console.log(req.query.SELECT.limit)

    if(req.query.SELECT.limit) {
        Limit = req.query.SELECT.limit.rows.val;

        if (req.query.SELECT.limit.offset) {
            Offset = req.query.SELECT.limit.offset.val;
        } else {
            Offset = 0 
        }
    } else {
        Limit = 1000;
        Offset = 0 
    }

    var results = await rate.find(Filter).limit(Limit + Offset).toArray();

    for (var i = 0; i < results.length; i++) {
        results[i].id = results[i]._id.toString();
    }

    results = results.slice(Offset);

    return results;
}


async function _updateRate(req) {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    var db = await client.db(db_name);
    var sapUsers = await db.collection("TRMCollect");
    var data = req.data;
    var sId = new ObjectId(data.id);
    delete data.id;
    const results = await sapUsers.updateOne({ _id: sId }, { $set: data });

    if (results.modifiedCount === 1) { 
        delete data._id;
        data.id = sId;
        return data;
    } else {
        console.log(results.result); 
        return results.result;
    }
}

async function _deleteRate(req) {
    await client.connect();
    var db = await client.db(db_name);
    var sapUsers = await db.collection("TRMCollect");
    var data = req.data;
    var sId = new ObjectId(data.id);
    const results = await sapUsers.deleteOne({_id: sId}); 
    return results;
}


module.exports = cds.service.impl(function() {
    const {rate} = this.entities;
    this.on("INSERT", rate, _createRate) ; // Even handler para
    this.on("READ", rate, _getRates); //Event handler para leer
    this.on("UPDATE", rate, _updateRate),
    this.on("DELETE", rate, _deleteRate) 
});