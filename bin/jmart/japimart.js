var japi = require('./japi.js');
var path = require('path');
var {NEDBconnect} =require('../storage/nedb-connector.js');

var j2vtables = {
  test:{
    jpack:(data)=>{
      console.log(data);
      return{
        WebMethod:'GJZJ82J',
        Option:data.option||'download',
        CompanyCode:'01',
        Template:data.template||'WO_HistoryBillingRecap_tbl',
        SELECT:data.select||[],
        WHERE:data.where||[]
      }
    }
  },
  custom:{
    jpack:(data)=>{
      console.log(data);
      return{
        WebMethod:'GJZJ82J',
        Option:data.option||'download',
        CompanyCode:'01',
        Template:data.template||'',
        SELECT:data.select||[],
        WHERE:data.where||[]
      }
    }
  },
  flatratebook:{
    jpack:(data)=>{
      console.log(data)
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'WO_FlatRateBookPricing_tbl',
        WHERE:[{OP:'=',FlatRateBookCode:data.bookcode||''}]
      }
    }
  },
  wonumber:{
    jpack:(data)=>{
      console.log(data)
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'WO_Headers_tbl',
        WHERE:[{OP:'=',WorkOrderNumber:data.wonum||''}]
      }
    }
  },
  contracttable:{
    jpack:(data)=>{
      console.log('SEARCH CUSTOMERS')
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'WO_SC_ServiceContractMaster_tbl',
        WHERE:[{OP:'=',CustomerCode:data.custcode||''}]
      }
    }
  },
  customertable:{
    jpack:(data)=>{
      console.log('SEARCH CUSTOMERS')
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'AR_CustomerMaster_tbl',
        WHERE:[{OP:'=',CustomerCode:data.custcode||''}]
      }
    }
  },
  custserviceitems:{
    jpack:(data)=>{
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'AR_CustomerServiceItems_tbl',
        WHERE:[{OP:'=',CustomerCode:data.custcode||''}]
      }
    }
  },
  woheaders:{
    jpack:(data)=>{
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'WO_Headers_tbl',
        SELECT:['WorkOrderNumber','CustomerCode','InvoiceNumber','DateCompleted','CostItem','SalesCategoryCode','ReferenceNumber','TechnicianID','TakenBy'],
        WHERE:[{OP:"BETWEEN",DateCompleted:['2022-09-01','2022-09-01']}]
      }
    }
  },
  woinvoicing:{
    jpack:(data)=>{
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'WO_InvoiceBillingRecap_tbl'

      }
    }
  },
  wod:{ //use for tech report // pay attention to sorting dates
    jpack:(data)=>{
      let where=[];
      let select=data.params.select!=undefined?data.params.select:[];
      if(data.params!=undefined){
        let params = data.params;
        if(params.CostType!=undefined){where.push({OP:'=',CostType:params.CostType})}
        if(params.fromdate!=undefined&&params.todate!=undefined){where.push({OP:'BETWEEN',PostingDate:[params.fromdate,params.todate]})}
      }
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'WO_WODDescription_tbl',
        WHERE:where,
        SELECT:select
      }
    },
    map:(it={})=>{
      if(!it||it==undefined){it={};}
      return{
        Amount: it.Amount!=undefined?it.Amount:0,
        AuditNumber: it.AuditNumber!=undefined?it.AuditNumber:null,
        BillingDate: it.BillingDate!=undefined?it.BillingDate:null,
        CostType: it.CostType!=undefined?it.CostType:'',
        Created: it.Created!=undefined?it.Created:'',
        DepositARCustomerCode: it.DepositARCustomerCode!=undefined?it.DepositARCustomerCode:'',
        EmployeeCode: it.EmployeeCode!=undefined?it.EmployeeCode:null,
        HoursUnits: it.HoursUnits!=undefined?it.HoursUnits:0,
        InvoiceNumber: it.InvoiceNumber!=undefined?it.InvoiceNumber:null,
        JournalType: it.JournalType!=undefined?it.JournalType:null,
        Notes: it.Notes!=undefined?it.Notes:'',
        PostingDate: it.PostingDate!=undefined?it.PostingDate:null,
        ReferenceDescription: it.ReferenceDescription!=undefined?it.ReferenceDescription:'',
        ReferenceNumber: it.ReferenceNumber!=undefined?it.ReferenceNumber:null,
        TypeOfHours: it.TypeOfHours!=undefined?it.TypeOfHours:null,
        WorkOrderNumber: it.WorkOrderNumber!=undefined?it.WorkOrderNumber:null
      }
    }
  },
  woeom:{
    jpack:(data)=>{
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template: 'WO_DetailHistory_tbl'
      }
    }
  },
  wohistory:{
    jpack:(data)=>{
      return{
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'WO_WorkOrderHistory_tbl'
      }
    }
  }
}

var GETj2vtable = (pak,all=true)=>{
  return new Promise((res,rej)=>{
    let resfail = {
      msg:'table not found',
      success:false,
      table:[]
    };
    if(j2vtables[pak.data.pack.table]){
      let params = j2vtables[pak.data.pack.table].jpack(pak.data.pack); //get params
      let map = j2vtables[pak.data.pack.table].map;
      if(params){japi.QUERYtable(params?params:null,map?map:undefined,all).then(
        result=>{
          pak.body=result;
          return res(true);
        });
      }
      else{
        pak.body=resfail;
        return res(false);
      }
    }else{
      pak.body=resfail;
      return res(false);}
  });
}

var JAPIroutes = (req,res,vpak,log)=>{
  return new Promise((res,rej)=>{

  });
}
/*
japi.GETj2vtable(
  {
    WebMethod:'GJZJ82J',
    Option:'download',
    CompanyCode:'01',
    Template:'WO_WorkOrder',
    WHERE: [{"OP":"=","SalesCategoryCode": "300"}]
  },false).then(
    result=>{console.log('done >',result)}
  )
*/

var afbookitem=(fbi={})=>{
  if(!fbi){fbi={}}
  console.log(fbi)
  return{
    book:fbi.FlatRateBookCode || '',
    task:fbi.TaskID || '',
    descr:fbi.Description || '',
    pl:fbi.PriceLevelCode ||'',
    price:fbi.SellingPrice || ''
  }
}
var UPDATEfbook=(pak)=>{
  return new Promise((resolve,reject)=>{
    let fbdescopts={
        table:'custom',
        option:'download',
        template:'WO_FlatRateBookHeader_tbl'

    }
    let fbpriceopts={
        table:'custom',
        option:'download',
        template:'WO_FlatRateBookPricing_tbl'
    }
    console.log(pak)
    pak.data.pack=fbdescopts
    GETj2vtable(pak).then(//get description table
      tres=>{
        let dtable = pak.body.table;
        if(tres){
          pak.data.pack=fbpriceopts;
          pak.body={};
          GETj2vtable(pak).then(
            pres=>{
              let ptable = pak.body.table;
              if(pres){
                for(let x=0;x<ptable.length;x++){
                  for(let y=0;y<dtable.length;y++){
                    if(ptable[x].TaskID===dtable[y].TaskID && ptable[x].FlatRateBookCode===dtable[y].FlatRateBookCode){
                      ptable[x].Description=dtable[y].Description1+(dtable[y].Description2?dtable[y].Description2:'');
                      ptable[x]=afbookitem(ptable[x]);
                      break;
                    }
                  }
                }
                pak.body=ptable;
                console.log(path.join(__dirname,'../../../data/store/jonas/SERVICE/jfbook.db'));
                ptable.push({task:'updated',date:new Date().toISOString()});
                let jbook = new NEDBconnect(path.join(__dirname,'../../../data/store/jonas/SERVICE/jfbook.db'));
                jbook.REMOVEdoc({},true).then(
                  rdocs=>{
                    console.log(rdocs);
                    jbook.INSERTdb(ptable).then(
                      indocs=>{console.log(indocs)}
                    );
                  }
                )

                //store ptable in datamart

              return resolve(true);
              }else{return resolve(false);}
            }
          )
        }
        else{return resolve(false);}
      }
    )
  });
}

module.exports={
  GETj2vtable,
  UPDATEfbook
}
