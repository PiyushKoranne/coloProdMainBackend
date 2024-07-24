const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
	paymentName: String,
	paymentAmount: Number,
})

const paymentModel = mongoose.model("Pricing", PaymentSchema);

module.exports = paymentModel
