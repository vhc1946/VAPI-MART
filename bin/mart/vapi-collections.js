var fs = require('fs'),
    path = require('path');
var {VAPIStore}=require('./vapi-store.js');

/* Collection of Data Stores
*/
class VAPICollection{
  constructor(root,map,mappath){
    this.root=root;
    this.mappath=mappath;
    this.map=map;//holds the raw JSON as object
    this.stores={};

    for(let s in this.map.stores){
      this.stores[s]=new VAPIStore(path.join(this.root,this.map.root,this.map.name),s,this.map.stores[s]);
    }
  }

  ROUTEcollection(ask){
    return new Promise((resolve,reject)=>{
      let {access,pack}=ask.data;
      switch(pack.method){
        case 'template':{
          ask.body=this.map;
          return resolve(true);
        }
        default:{
          if(pack.db!=undefined&&pack.method!=undefined&&pack.options!=undefined){//check for good pack
            this.stores[pack.store].ACCESSstore(pack.db,pack.method,pack.options).then(
              reciept=>{console.log('RECIEPT',reciept);ask.body=reciept;return resolve(true);}
            );
          }else{ask.msg='Incorrect pack';return resolve(false)}
        }
      }
    });
  }

  ADMINcollection(ask){
    return new Promise((resolve,reject)=>{
      var waiter = null;
      let {access,pack}=ask.data;
      console.log('ADMIN>',ask)
      console.log(pack)
      switch(pack.method.toUpperCase()){
        case 'ADDSTORE':{
          waiter = this.ADDstore(pack.store);
          console.log('add store');
          break;
        }
        case 'REMOVESTORE':{
          waiter = this.REMOVEstore(pack.store);
          console.log('remove store')
          break;
        }
        case 'ADDDATABASE':{
          waiter = this.ADDdatabase(pack.store,pack.db,pack.options.dbrules||undefined);
          console.log('add database')
          break;
        }
        case 'REMOVEDATABASE':{
          waiter = this.REMOVEdatabase(pack.store,pack.db);
          console.log('remove database')
          break;
        }
      }
      if(waiter){
        waiter.then(
          answr=>{return resolve({msg:answr.msg,success:answr.success});}
        )
      }else{return resolve({msg:'Could not find method',success:false});}
    });
  }

  ADDstore(store){
    return new Promise((resolve,reject)=>{
      if(!this.stores[store]){
        this.map.stores[store]={};//create empty store

        this.stores[store]=new VAPIStore(path.join(this.root,this.map.root,this.map.name),store,this.map.stores[store]);
      }else{return resolve({msg:'Store Already exist',success:false});}

      fs.writeFile(this.mappath,JSON.stringify(this.map),(err)=>{
        if(err){return resolve({msg:'Error writing file',success:false});}
        else{return resolve({msg:'Store has been updated',success:true});}
      });
    })
  }

  REMOVEstore(store){
    return new Promise((resolve,reject)=>{
      if(this.map.stores[store]){
        this.map.stores[store]=undefined;
        this.stores[store] = undefined;
      }else{return resolve({msg:'Store does not Exist',success:false});}
      fs.writeFile(this.mappath,JSON.stringify(this.map),(err)=>{
        if(err){return resolve({msg:'Error writing file',success:false});}
        else{return resolve({msg:'Store was Removed',success:false});}
      });
    });
  }

  ADDdatabase(store=null,db=null,dbrules={}){
    return new Promise((resolve,reject)=>{
      if(store && this.map.stores[store]){
        if(db && !this.map.stores[store][db]){
          this.map.stores[store][db]={
            filename:db+'_table.db',
            ensure:{},
            map:{}
          }
          for(let opt in this.map.stores[store]){
            if(dbrules[opt]){this.map.stores[store][db][opt]=dbrules[opt]}
          }
          this.stores[store]=new VAPIStore(path.join(this.root,this.map.root,this.map.name),store,this.map.stores[store]);
        }else{return resolve({msg:'DB does exist or was left blank',success:false});}
      }else{return resolve({msg:'Store Does not exist',success:false});}
      fs.writeFile(this.mappath,JSON.stringify(this.map),(err)=>{
        if(err){return resolve({msg:'Error writing file',success:false});}
        else{return resolve({msg:'Database was Added',success:true});}
      });
    });
  }
  REMOVEdatabase(store=null,db=null){
    return new Promise((resolve,reject)=>{
      if(store&&this.map.stores[store]){
        if(db&&this.map.stores[store][db]){
          this.map.stores[store][db]=undefined;
        }else{return resolve({msg:'Database does NOT exist',success:false});}
      }else{return resolve({msg:'Store Does not Exist',success:false});}
      fs.writeFile(this.mappath,JSON.stringify(this.map),(err)=>{
        if(err){return resolve({msg:'Error writing file',success:false});}
        else{
          try{
            fs.unlinkSync(path.join(this.root,'store',this.map.name,store,this.map.stores[store][db].filename));
          }catch{return resolve({msg:'Error deleting file',success:false});}
          return resolve({msg:'Database was deleted',success:true});
        }
      });
    });
  }
  EDITstore(store,db){}

}

module.exports={
  VAPICollection
}
