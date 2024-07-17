const mongoose = require('mongoose')

const quotationSchema = new mongoose.Schema({
    product:{
        id:String,
        quantity:String
    },
    name:String,
    mobileNum:String,
    email:String,
    companyName:String,
    city:String,
    query:String,
	unread:{
		type:Boolean,
		default:true
	}
})

const quotationModel = new mongoose.model("quotations",quotationSchema); 

module.exports = quotationModel