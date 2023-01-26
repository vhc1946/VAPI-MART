
var path = require('path');
var {NEDBconnect}=require('../storage/nedb-connector.js');


/*
  Need to figure a way where connections to a store can be created and stay
  available for any other request during its life. So if the first connection is
  still being processed, request from the store through the same connection. If
  there is nothing qued for a connection it is closed.
  This is in fear that two request will be sent for a store and two seperate
  instances of the class are created. Both of the classes would then fight over
  the same file and cause some of the data to go missing.
  It is also likely keeping the connections open for longer will speed up the
  request process when there are a lot of requests at one time.
*/
class VAPIStore{
  constructor(storeroot,storename,storemap){
    this.root=storeroot;
    this.store=storename;
    this.dbmap=storemap;
  }

  ACCESSstore=(db,method,options)=>{
    return new Promise((res,rej)=>{
      let reciept={
        success:false,
        method:method,
        result:null
      };

      let appdb = this.CONNECTstore(db);
      if(appdb){
        appdb.docs.loadDatabase();
        let runner;
        switch(method){
          case 'update':{runner = this.UPDATEstore(appdb,options);break;}
          case 'insert':{runner = this.INSERTstore(appdb,options);break;}
          case 'remove':{runner = this.REMOVEstore(appdb,options);break;}
          case 'query':{runner = this.QUERYstore(appdb,options);break;}
          default:{return res(reciept)}
        }
        runner.then(
          result=>{

            console.log('Result>',result)
            reciept.result = result;
            reciept.success = true;
            return res(reciept);
          }
        )
      }else{res(reciept)}
    });
  }

  CONNECTstore=(db)=>{
    if(this.dbmap[db]!=undefined){
      return new NEDBconnect(
        {filename:path.join(this.root,this.store,this.dbmap[db].filename)},
        this.dbmap[db].ensure
      );
    }else{return null;}
  }

  UPDATEstore=(db,opts)=>{
    return new Promise((res,rej)=>{
      if(!opts.query||!opts.update||!opts.options){return res({numrep:0,err:'bad options'});}
      return res(db.UPDATEdb(opts.query,opts.update,opts.options));
    });
  }
  INSERTstore=(db,opts)=>{
    return new Promise((res,rej)=>{
      if(!opts.docs){return res({doc:[],err:'bad options'});}
      return res(db.INSERTdb(opts.docs));
    });
  }
  REMOVEstore=(db,opts)=>{
    return new Promise((res,rej)=>{
      if(!opts.query){return res({num:0,err:'bad options'});} //if query{} then the list is emptied. May want to protect *only for admin*
      if(!opts.multi){opts.multi=true;}
      if(Object.keys(opts.query).length===0&&!opts.allow){return res({num:0,err:'missing allow when clearing all docs'})}
      return res(db.REMOVEdoc(opts.query,opts.multi));
    });
  }
  QUERYstore=(db,opts)=>{
    return new Promise((res,rej)=>{
      if(!opts.query){return res({doc:[],err:'bad options'})}
      return res(db.QUERYdb(opts.query));
    });
  }
}

module.exports={
  VAPIStore
}
