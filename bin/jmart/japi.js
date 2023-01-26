/* JONAS API ///////////////////////////////////////////////////////////////////
    Utilizes SOAP protocol to communicate
    url = https://websvc.jonasportal.com/jonasAPI/japi.asmx
    Security code = 3a4d6080ef9393fa1675fa0ce0132f1b

*/
var j2vconvert = require('./tables/jonas-table-headers.json');

const soapreq = require('easy-soap-request');
var parsexml = require('xml2js').parseString;

const url = 'https://websvcazure.jonasportal.com/jonasAPI/japi.asmx';
const sampleHeaders = {
  'Content-Type':'text/xml'
};
const access = {//JONAS credentials
  user:'VOGCH',
  pswrd:'vogel123',
  token:'3a4d6080ef9393fa1675fa0ce0132f1b'
}

/* Create a JONAS Soap Envelope
    PASS:
    - params:{
        token:'security token'
        user: 'JONAS username'
        pswrd: 'JONAS user password'
        params: {pass as opject matching JONAS schema}
      }
    - token:'security token'
    - user: 'JONAS username'
    - pswrd: 'JONAS user password'
    - params: {pass as opject matching JONAS schema}
*/
var CREATErequest=(params)=>{
  return`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jon="jonas.jonasportal.com/">
     <soapenv:Header/>
     <soapenv:Body>
        <jon:JonasAPI>
           <jon:securityToken>${access.token}</jon:securityToken>
           <jon:username>${access.user}</jon:username>
           <jon:password>${access.pswrd}</jon:password>
           <jon:apiParams>${JSON.stringify(params)}</jon:apiParams>
        </jon:JonasAPI>
     </soapenv:Body>
  </soapenv:Envelope>`
}

/* Send the create JONAS request > then wait
*/
var SENDrequest=(params)=>{
  return new Promise((res,rej)=>{
  (async () => {
    const { response } = await soapreq(
      { url: url,
        headers: sampleHeaders,
        xml: CREATErequest(params)
      });

    const { headers, body, statusCode } = response;
    return res({headers,body,statusCode});
  })();

});
}

var convertJitem=(item,map)=>{
  let nitem={};
  for(let i in item){
    if(map[i]!=''&&map[i]!=undefined){
      nitem[map[i]]=item[i];
    }
  }
  return nitem;
}
var jtableconvert=(template,table)=>{
  for(let x=0;x<table.length;x++){
    table[x]=convertJitem(table[x],j2vconvert[template]);
  }
  return table;
}

/* Parse JONAS Soap response
*/
var PARSEresponse=(body)=>{
  return new Promise((res,rej)=>{
    parsexml(body,(err,result)=>{//parse the body
      let bod = JSON.parse(result['soap:Envelope']['soap:Body'][0]['JonasAPIResponse'][0]['JonasAPIResult']);
      try{bod.data = JSON.parse(bod.data);}catch{}
      console.log(bod);
      bod.success = true; //body marked for intenrnal use
      try{
        if(bod.data!=null && bod.data.errorsFound==0||bod.data.errorsFound==undefined){ //test for errors *MORE NEEDED HERE
          if(bod.data[bod.data.Template]!=undefined){
            if(bod.data.Option=='download'&&j2vconvert[bod.data.Template]){
              bod.data['table']=jtableconvert(bod.data.Template,bod.data[bod.data.Template]);
            }else{bod.data['table']=bod.data[bod.data.Template];}
            bod.data[bod.data.Template]=undefined;
          }else{bod.data['table']=[]}
        }else{
          try{bod.msg = bod.data.error[0];}
          catch{bod.msg=bod.message}
          bod.success = false;
        }
      }catch{
        try{bod.msg = bod.data.error[0];}
        catch{bod.msg=bod.message}
        bod.success = false;
      }
      return res(bod);
    });
  })
}

var CLEANtable=(table=[],map=(it)=>{return it;})=>{
  let mtable = [];
  try{
    for(let x=0;x<table.length;x++){mtable.push(map(table[x]));}
  }catch{return table;}
  return mtable.length==table.length?mtable:table;
}

/*
   PASS:{
      params:{},
      all: TRUE || FALSE,
      table: [] (holds sum of all tables)
      pagecount: int (count of current page request)
    }
*/
var QUERYtable=(params,map=(it={})=>{return it;},all=true,table=[],pagecount=1)=>{
  return new Promise((res,rej)=>{
    params.PageNum = pagecount++;
    SENDrequest(params).then(
      response=>{
        PARSEresponse(response.body).then(
          pbody=>{
            let jpak={ //setup response pack
              success:pbody.success,
              msg:pbody.msg,
              table:table
            };
            if(pbody.success){
              if(all&&pbody.data.PageMax>=pagecount){ //count iterates 1+ PageMax, JONAS has PageMax+1=last page
                try{table = table.concat(CLEANtable(pbody.data.table,map));}catch{}//combine the tables to one list
                return res(QUERYtable(params,map,all,table,pagecount));
              }else{
                try{jpak.table=table.concat(CLEANtable(pbody.data.table,map));}
                catch{jpak.table=table;}
                return res(jpak);
              }
            }else{return res(jpak);}
          }
        )
      }
    )
  });
}

module.exports={
  QUERYtable
}
