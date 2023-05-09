
var vhpclient=require('./mongo/mongosetup.js');
var japi = require('./jmart/japimart.js');

//holds all routes, used in ROUTEstore
const routes = {
    //MART:vhpclient.ROUTErequest,
    //JMART:japi.ROUTEjmart
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
        let storereq = pak.access.request.toUpperCase() || '';
        switch(storereq){
            case 'MART':{return resolve(vhpclient.ROUTErequest(pak));break;}
            case 'JMART':{return resolve(japi.ROUTEjmart(pak));break;}
            default:{
                pak.success=false;
                pak.msg="Bad Request";
                return resolve(pak);
            }
        }
    });
}
var STARTrouter=(cback=()=>{return false})=>{
    return new Promise((resolve,reject)=>{
        //check if mongoclient.ROUTErequest
        //routes.MART = vhpclient.ROUTErequest;//assign mongo client router to MART route
        cback();
        return resolve(true);
    });
}

module.exports={
    ROUTEstore,
    STARTrouter
}