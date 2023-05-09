const {VHPMongoClient}=require('./mongoapi.js');
//TEST Credentials 
const connectInfo ={
    user: 'christianv',
    pswrd: 'AMracing5511',
    db:'',
    cluster:'cluster0'
}

//TEST connection string
let creds = `mongodb+srv://${connectInfo.user}:${connectInfo.pswrd}@${connectInfo.cluster}.0awfqdk.mongodb.net/${connectInfo.db}?retryWrites=true&w=majority`

var vhpclient = new VHPMongoClient(creds);
/**
 * 
 * @param {Function} cback -> to run after the connection to the database
 * @param {String} uri -> The connection string to pass to MongoDB
 * @returns -> the vhp client used to make connections
 */
module.exports = {vhpclient}