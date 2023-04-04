//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      http = require('http');
var {exec} = require('child_process');

var {ROUTEdatamart,ROUTEadmindatamart,INITcollections} = require('./bin/mart/vapi-datamart.js');

var japi = require('./bin/jmart/japimart.js');

INITcollections(path.join(__dirname,process.env.DATAPATH?process.env.DATAPATH:'../data/'));

var ROUTEstore=(req,res,pak)=>{
  return new Promise((resolve,reject)=>{
    //console.log('PACK ',pak.data);
    let storereq = pak.data.access.request.toUpperCase() || '';
    switch(storereq){
      case 'MART':{
        console.log('run mart')
        return resolve(ROUTEdatamart(pak));
        break;
      }
      case 'JMART':{
        return resolve(japi.ROUTEjmart(pak));
        break;
      }
      case 'ADMIN':{
        return resolve(ROUTEadmindatamart(pak));
        break;
      }
      default:{
        pak.success=false;
        pak.msg="Bad Request";
        res.write(JSON.stringify(pak))
        res.end();
        return resolve(pak);
      }
    }
  });
}

var PORT = process.env.PORT || 8080//4050; //port for local host

var server = http.createServer();

server.on('request',(req,res)=>{
  //console.log('Request from mart');
  let data = '';
  req.on('data',chunk=>{data+=chunk;});

  req.on('end',()=>{
    //console.log(data)
    try{data=JSON.parse(data);}catch{data={};}

    let vpak=data;
    console.log('MART PACK',vpak);
    let log = { //prep request log
      process:'COREprocess',
      info:{
        url:req.url,
        cip:req.connection.remoteAddress,
      }
    }
    console.log(log);
    ROUTEstore(req,res,vpak).then(
      answr=>{
        console.log('DONE',answr);
        res.write(JSON.stringify(vpak));
        res.end();
      }
    ).catch(
      err=>{
        res.write(JSON.stringify({
          success:false,
          msg:err,
          body:{result:null}
        }));
        res.end();
      }
    )
  });
});

server.listen(PORT,()=>{console.log('VAPI Core Listening: ',PORT)});
