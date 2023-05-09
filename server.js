//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      http = require('http');
var {exec} = require('child_process');

var {ROUTEdatamart,ROUTEadmindatamart,INITcollections} = require('./bin/mart/vapi-datamart.js');

var japi = require('./bin/jmart/japimart.js');

//INITcollections(path.join(__dirname,process.env.DATAPATH?process.env.DATAPATH:'../data/'));//delete

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
