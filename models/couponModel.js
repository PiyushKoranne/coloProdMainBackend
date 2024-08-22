const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
	couponName:String,
	couponCode:String,
	couponDiscount:Number,
	maximumAllowedDiscount: Number,
	productId: String,
	couponDescription: String,
})

const couponModel = mongoose.model("Coupon", CouponSchema);

module.exports = {couponModel, CouponSchema}
