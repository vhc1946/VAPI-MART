const mongoose = require('mongoose');
const {Schema} = mongoose;

var leadSchema= new Schema({
    custCode: String,
    client: String,
    date: Date,
    email: String,
    phone: String,
    street: String,
    unit: String,
    city: String,
    zip: String,
    comp: String,
    dept: String,
    estimator: String,
    lead: String,
    source: String,
    tracking: Object,
    log: String    //logging lead through lifecycle
});

var cBidSchema = new Schema({
	date: Date,
	jobname: String,
	primary: String,
	profit: Number,
	amount: String,
	bid: String,
	estimator: String,
	location: String,
	sqft: Number,
	tonnage: Number,
	type: String,
	bldtype: String,
	margin: String,
	notes: String
});

module.exports={
    
}