const mongoose = require("mongoose");

const TestOrderSchema = new mongoose.Schema({
	orderId: { type: Number, unique: true },
	scheduledAt : {type: String, default: ""},
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
		amount: Number,
		hasDiscount: Boolean,
		productPrice: Number,
		couponUsed: String,
		transactionId:String,
		paymentVerificationHash: String,
	},
	testStatus: {
		type: String,
		enum: ["Testing Complete", "Rejected", "In Transit"],
		default:"In Transit"
	},
	testingStatusNotes: {
		type: String,
		default: "",
	},
	providerId: String
}, {timestamps: true })

const testOrdersModel = mongoose.model("TestOrders", TestOrderSchema);

module.exports = testOrdersModel;
