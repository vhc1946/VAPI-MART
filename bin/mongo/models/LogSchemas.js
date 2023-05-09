const mongoose = require('mongoose');
const {Schema} = mongoose;
 var logSchema = new Schema({
    timein:Date,
    timecheck:Date,
    timeout:Date,
    msg:String,
    info:Object,
    track:Array
});

module.exports={
    Corelog:logSchema
}