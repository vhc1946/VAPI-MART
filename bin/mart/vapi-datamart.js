/* Datastores

  file used to initialize / manage data stores in a vapi instance.


  Data in any vapi is organized in an external, "data", folder. In the folder is
  an "info" folder holding collection maps. Collection are represented by folders
  with that hold store folders. Examples of collections are:
    admin
    apps
    jonas
  Each of the above can be described using a VAPIStore()

*/
var path = require('path'),
    fs = require('fs');

var {VAPIStore} =require('./vapi-store.js');
var {VAPICollection} = require('./vapi-collections.js');

var vcollects = {};
var storeroot = null;
//Initialize all collections in passed data folder
//if empty, create a new datamart
var INITcollections = (root)=>{
  fs.readdir(path.join(root,'info'),(err,dir)=>{
    if(!err){
      storeroot = root;
      vcollects={};
      for(let x=0;x<dir.length;x++){
        let map = null;
        try{
          map=require(path.join(root,'info',dir[x]));
          vcollects[map.name]=new VAPICollection(root,map,path.join(root,'info',dir[x]));
        }catch{console.log('Cannot Open Map');}
      }
    }else{console.log('Can NOT initialize collections...');}
  });
}

var ADDcollection=(name='')=>{
  return new Promise((resolve,reject)=>{
    if(name!=''&&!vcollects[name]){
      let mapfile = name+'map.json';
      fs.writeFile(path.join(storeroot,'info/'+mapfile),JSON.stringify({
          root:"store",
          name:name,
          stores:{}
        }),(err)=>{
        if(err){return resolve({msg:'there was an error creating the store file',success:false});}
        else{
          vcollects[name] = new VAPICollection(storeroot,require(path.join(storeroot,'info/'+mapfile)),path.join(storeroot,'info/'+mapfile));
          return resolve({msg:'Collection was created',success:true});
        }
      });
    }else{return resolve({msg:'Collection already Exists OR was left blank',success:false});}
  });
}

//Route Data store
var ROUTEdatamart=(ask)=>{
  return new Promise((res,rej)=>{
    console.log(ask);
    let {access,pack}=ask.data;
    console.log("DATAMART ASK", ask);
    if(pack.collect && vcollects[pack.collect]){
      vcollects[pack.collect].ROUTEcollection(ask).then(
        answr=>{return res(answr);}
      );
    }else{ask.msg='Collection Does not exist';return res(false)}
  });
}

var ROUTEadmindatamart=(ask)=>{
  return new Promise((resolve,reject)=>{
    let {access,pack}=ask.data;
    let waiter = null;
    switch(pack.method.toUpperCase()){
      case 'ADDCOLLECTION':{
        waiter = ADDcollection(pack.collect||undefined);
        break;
      }
      case 'REMOVECOLLECTION':{
        ask.msg='Removing Collections not setup',
        ask.success=false;
        return resolve(false);
        break;
      }
      case 'COLLECTIONMAPS':{
        let allmaps={};
        for(let c in vcollects){
          allmaps[c] = vcollects[c].map;
        }
        ask.body.result=allmaps;
        ask.msg="found maps";
        ask.success=true;
        return resolve(true);
        break;
      }
      default:{
        if('ADDDATABASE'==pack.method.toUpperCase()||'ADDSTORE'==pack.method.toUpperCase()|| 'REMOVESTORE'==pack.method.toUpperCase()  || 'REMOVEDATABASE'==pack.method.toUpperCase()){
          if(vcollects[pack.collect]){
            waiter=vcollects[pack.collect].ADMINcollection(ask)
          }
        }
      }
    }
    if(waiter){
      waiter.then(
        answr=>{
          ask.msg = answr.msg;
          ask.success = answr.success;
          return resolve(true);
        }
      )
    }else{ask.success=false;ask.msg = 'Could not find method';return resolve(false);}
  });
}

module.exports={
  INITcollections,
  ADDcollection,
  ROUTEdatamart,
  ROUTEadmindatamart
}
