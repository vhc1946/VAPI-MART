const mongoose = require('mongoose');
const {Schema} = mongoose;
var ticketSchema = new Schema({
    
},{
    strict:false
});

module.exports = {Ticket:ticketSchema}