
//CUSTOMERS///////////////
{
  "WebMethod":"GJZJ82J",
  "Option":"download",
  "CompanyCode":"01",
  "Template":"AR_Customers",
  "PageNum":1
}
///////////////////////////

//WORK ORDERS /////////////
{
  "WebMethod":"GJZJ82J",
  "Option":"download",
  "CompanyCode":"01",
  "Template":"WO_WorkOrder",
  "PageNum":1
}

{
  WebMethod:'GJZJ82J',
  Option:'download',
  CompanyCode:'01',
  Template:'WO_DetailHistory_tbl',
  SELECT:['WorkOrderNumber','Amount','BillingDate']
}
///////////////////////////

//work Order Service Items/
{
  "WebMethod":"GJZJ82J",
  "Option":"download",
  "CompanyCode":"01",
  "Template":"WO_ServiceItemsWorkedOn_tbl",
  "PageNum":1
}
///////////////////////////

//Service Items ///////////
{
  "WebMethod":"GJZJ82J",
  "Option":"download",
  "CompanyCode":"01",
  "Template":"AR_CustomerServiceItems_tbl",
  "PageNum":50
}
///////////////////////////

//Service Contracts////////
{
  "WebMethod":"GJZJ82J",
  "Option":"download",
  "CompanyCode":"01",
  "Template":"WO_ServiceContract",
  "PageNum":1
}
///////////////////////////

//FLAT RATE////////////////
{
  "WebMethod":"GJZJ82J",
  "Option":"download",
  "CompanyCode":"01",
  "Template":"WO_FlatRateBook",
  "WHERE":[
    {"OP":"=","FlatRateBookCode":"RES"}
  ],
  "PageNum":1
}
///////////////////////////
