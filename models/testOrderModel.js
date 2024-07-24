const mongoose = require("mongoose");

const TestOrderSchema = new mongoose.Schema({
	orderId: String,
	scheduledAt : String,
	registrationConsent : Boolean,
	firstName : String,
	lastName : String,
	dob : String,
	gender: String,
	streetAddress : String,
	city : String,
	state : String,
	zip : String,
	phone : String,
	email : String,
	race : String,
	ethnicity : String,
	isInvoiced: { type: Boolean, default: false},
	orderConfirmation: { type: Boolean, default: false},
	productId:String,
	productName: String,
	paymentConfirmed: Boolean,
	paymentInformation:{
		status: {
			type: String,
			enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']
		},	
		transactionId:String,
		paymentVerificationHash: String,
	},
	providerId: String
})

const testOrdersModel = mongoose.model("TestOrders", TestOrderSchema);

module.exports = testOrdersModel;
