
var CONNECTmongo=require('./mongo/mongosetup.js');
var japi = require('./jmart/japimart.js');

//holds all routes, used in ROUTEstore
var routes = {
    MART:()=>{return{success:false,msg:'Mongo Mart not connected',result:null}},
    JMART:japi.ROUTEjmart
}

/**
 * 
 * @param {Object} req -> request from http server
 * @param {Object} res -> response from http server
 * @param {*} pak -> vhp api request pack (full pack from core)
 * @returns 
 */
var ROUTEstore=(req,res,pak)=>{
    return new Promise((resolve,reject)=>{
        //console.log('PACK ',pak.data);
        let storereq = pak.data.access.request.toUpperCase() || '';
        if(routes[storereq]){return resolve(routes[storereq](pak))}//check for route
        else{
            pak.success=false;
            pak.msg="Bad Request";
            return resolve(pak);
        }
    });
}
var STARTrouter=(cback=()=>{return false})=>{
    return new Promise((resolve,reject)=>{
        let mongoclient = CONNECTmongo(cback);//connect to mongo
        //check if mongoclient.ROUTErequest
        routes.MART = mongoclient.ROUTErequest;//assign mongo client router to MART route
        return resolve();
    });
}

module.exports={
    ROUTEstore,
    STARTrouter
}