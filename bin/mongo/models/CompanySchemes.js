const mongoose = require('mongoose');
const {Schema} = mongoose;

var empSchema = new Schema({
	empID: String,
	name: String,
	fName: String,
	lName: String,
	
	coid: String,
	title: String,
	type: String,
	repTo: String, //empID
	
	jobDesc: String,
	joined: Date,
	bday: Date,
	skills: String,
	interest: String,

	tasks: Array,
	goals: Array,
	picture: String,
},
{	
	toJSON:{virtuals:true},
	toObject:{virtuals:true},
	strictQuery: false,
	timestamps:true,
    virtuals: {
        fullName: {
            get(){
                return this.fName + ' ' + this.lName;
            },
            set(v){
                this.fName = v.substr(0, v.indexOf(' '));
                this.lName = v.substr(v.indexOf(' ')+1);
            }
        },
		Account: {
			options:{
				ref: 'Account',
				localField: 'empID',
				foreignField: 'empID'
			}
		},
		Device: {
			options:{
				ref: 'Device',
				localField: 'empID',
				foreignField: 'empID'
			}
		}
    }
});

var devSchema = new Schema({
	devID: String,
	empID: String,
	name: String,
	type: String,
	model: String,
	serial: String,
	cardNum: String,
	cardRef: String,
	iccid: String,
	lock: String,
	
	purchaseDate: Date,
	upgradeDate: Date
});

var accSchema = new Schema({
	empID: String,
	type: String,
	user: String, // email OR username
	pswrd: String,
	twoFactors: [{type:String,contact:String}],
	active: Boolean,
	resetPswrd: Date
});

var userSchema = new Schema({
	empID: String,
	user: String,
	pswrd: String,
	apps: Array,
	permissions: Array,
	admin: Boolean
});

module.exports={
    Employee:empSchema,
    Device:devSchema,
    Account:accSchema,
	User:userSchema
}
