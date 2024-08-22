const mongoose = require("mongoose")

const OrderCounterSchema = new mongoose.Schema({
	nextId: { type: Number, default: 11500 },
})

const orderIdCounterModel = new mongoose.model("OrderCounter",OrderCounterSchema)
module.exports = orderIdCounterModel;
