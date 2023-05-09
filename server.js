//Libraries used in project
const http = require('http');
const {STARTrouter,ROUTEstore}=require('./bin/martrouter.js');

const PORT = process.env.PORT || 8080//4050; //port for local host

var server = http.createServer();

STARTrouter(()=>{server.listen(PORT,()=>{console.log('VAPI Core Listening: ',PORT)});})

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
        cip:req.connection.remoteAddress
      }
    }
    ROUTEstore(req,res,vpak).then(
      answr=>{
        console.log('DONE',answr);
        res.write(JSON.stringify(answr));//may not want to do this, return only result of request and strip rest of pack
        res.end();
        //Log event
      }
    )/*.catch(
      err=>{
        res.write(JSON.stringify({
          success:false,
          msg:err,
          body:{result:null}
        }));
        res.end();
      }
    )*/
  });
});