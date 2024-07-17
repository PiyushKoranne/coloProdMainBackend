const mongoose = require("mongoose");

const quickDraftSchema = new mongoose.Schema({
    title:String,
    description:String,
    },{
    timestamps:true
})

const AdminSchema = new mongoose.Schema({
	email:{
		type:String,
		required:true,
		unique:true
	},
	username:{
		type:String,
		required:true,
		unique:true
	},
	profileImage:String,
	password:{
		type:String,
		required:true,
	},
	roles:[{
		type:String,
		required:true,
		default:"editor"
	}],
	status:{
		type:Boolean,
	},
	quickDrafts:[quickDraftSchema],
	otp:String,
	themeName:String,
	access_token:String,
	websiteName:String,
	websiteUrl:String,
	websiteLogo:String
})

const adminModel = mongoose.model("admin", AdminSchema);

module.exports = adminModel;