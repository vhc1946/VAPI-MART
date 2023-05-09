const mongoose = require('mongoose'),
        path = require('path'),
        fs = require('fs');

const schemas = require('../models/vhp-schemas');
class VHPMongoClient{
    /**
     * Will attempt to connect to a mongodb server based on the
     * uri passed. You can pass function to afterConnect to run
     * after a connection has been successful.
     * 
     * @param {String} uri 
     * @param {Function} afterConnect 
     */
    constructor(uri,afterConnect=()=>{}){
        let startup = mongoose.createConnection(uri).asPromise();
        this.connection = null; //hold original conneciton
        this.admin = null; //hold admin access

        startup.then(conn=>{
            console.log('Connected');
            this.connection = conn;
            this.admin = this.connection.db.admin();
            afterConnect()
        }).catch(err=>{console.log(err)})
    }

    /**
     * Here are some notes on this
     * 
     * Employee_Account
     * 
     * @param {{db:String,collect:String,method:String,options:Object}} pack
     * @returns 
     */
    ROUTErequest(pack){
        return new Promise((resolve,reject)=>{
            var dbcursor = null; //holds the database to be request from
            var populates = []; //holds an array of items to collect at once
            this.CHECKforDB(pack.db!=undefined?pack.db:'').then(dbexists=>{
                if(dbexists){
                    //split collection OR check for '_' in collection field
                    populates = pack.collect.split('_');
                    pack.collect=populates.shift();
                    if(schemas[pack.collect]){//check that pack.collect has a schema
                        dbcursor = this.connection.useDb(pack.db,{useCache:true}).model(pack.collect,schemas[pack.collect]);
                            if(pack.options!=undefined){
                                switch(pack.method!=undefined?pack.method.toUpperCase():''){
                                    case 'QUERY':{console.log('query');return resolve(this.QUERYdocs(dbcursor,pack,populates));break;}
                                    case 'REMOVE':{console.log('remove');return resolve(this.REMOVEdocs(dbcursor,pack));break;}
                                    case 'UPDATE':{console.log('update');return resolve(this.UPDATEdocs(dbcursor,pack));break;}
                                    case 'INSERT':{console.log('insert');return resolve(this.INSERTdocs(dbcursor,pack));break;}
                                }
                                return resolve({success:false,msg:'Could not resolve method',results:null});
                            }else{return resolve({success:false,msg:'No Options',results:null})}
                    }else{return resolve({success:false,msg:'Not a collection',results:null});}
                }else{return resolve({success:false,msg:'Not a database',results:null})}
            }).catch(err=>{return resolve({success:false,msg:'Failed to resolve request',results:null})})
        });
    }

    QUERYdocs(dbcursor, pack,poplist=[]){
        return new Promise((resolve,reject)=>{
            let request = null;
            if(pack.options.query){
                if(poplist.length>0){//if there are things to populate, loop through and establish the connection
                    for(let x=0,l=poplist.length;x<l;x++){
                        if(schemas[pack.collect].virtuals[poplist[x]]){
                            this.connection.useDb(pack.db,{useCache:true}).model(schemas[pack.collect].virtuals[poplist[x]].options.ref,schemas[schemas[pack.collect].virtuals[poplist[x]].options.ref]);
                        }
                    }
                    request = dbcursor.find(pack.options.query,pack.options.projection,pack.options.options).populate(poplist);
                }else{request = dbcursor.find(pack.options.query,pack.options.projection,pack.options.options);}
                request.then((res)=>{
                    console.log(res);
                    return resolve({success:true,msg:'Queried',result:res});
                });
            }else{return resolve({success:false,msg:'No query option',result:null})}
        });
    }

    REMOVEdocs(dbcursor,pack){
        return new Promise((resolve,reject)=>{
            let {query}=pack.options;
            if(query!=undefined){
                dbcursor.deleteMany(pack.options.query).then(result=>{
                    return resolve({success:true,msg:'',result:result})
                })
            }else{return resolve({success:false,msg:'bad options',result:null})}
        });
    }

    INSERTdocs(dbcursor,pack){
        return new Promise((resolve,reject)=>{
            if(pack.options.docs){
                dbcursor.insertMany(pack.options.docs).then(result=>{
                    return resolve({success:true,msg:'',result:result})
                })
            }else{return resolve({success:false,msg:'bad options',result:null})}
        });
    }
    UPDATEdocs(dbcursor,pack){
        return new Promise((resolve,reject)=>{
            if(pack.options.query!=undefined&&pack.options.update!=undefined){
                dbcursor.updateMany(pack.options.query,pack.options.update).then(result=>{
                    return resolve({success:true,msg:'',result:result})
                })
            }else{return resolve({success:false,msg:'bad options',result:null})}
        });
    }


    CHECKforDB(db){
        return new Promise((resolve,reject)=>{
            this.admin.listDatabases().then(res=>{
                if(res.databases){
                    for(let x=0,l=res.databases.length;x<l;x++){if(db===res.databases[x].name){return resolve(true);}}
                    return resolve(false);
                }else{return resolve(false);}
            }).catch(err=>{return resolve(false);})
        })
    }
}
module.exports=VHPMongoClient;

