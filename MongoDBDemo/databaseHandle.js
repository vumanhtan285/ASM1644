const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://vumanhtan285:vumanhtan123@cluster0.iqsl6.mongodb.net/test";
const dbName = "VuManhTan";

module.exports = {searchProduct, insertProduct, checkUser}

async function searchProduct(condition, collectionName){
    const dbo = await GetDBO();
    const searchCondition = new RegExp(condition,'i');
    var results = await dbo.collection(collectionName).
                find({name:searchCondition}).toArray();
    return results;
}

async function insertProduct(documentInsert,collectionName){
    const dbo = await GetDBO();
    await dbo.collection(collectionName).insertOne(documentInsert);
}

async function checkUser(usernameIn,passwordIn){
    const dbo = await GetDBO();
    const results = await dbo.collection("Users").
                findOne({$and:[{username:usernameIn},{password:passwordIn}]})
    if(results != null)
        return true;    
    else
        return false; 
}

async function GetDBO() {
    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    return dbo;
}



