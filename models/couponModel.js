const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
	couponId:String,
	couponType: {
		type: String,
		enum:['Percentage', 'Amount']
	},
	couponCode:String,
	couponDiscount:Number,
	maximumAllowedDiscount: Number,
	couponDescription:String,
	couponImage:String,
	conditions: {
		brand:[String],
		numberOfProducts:Number,
		products:[{
			type: mongoose.Schema.Types.ObjectId,
			ref:"posts"
		}],

	}
})

const couponModel = mongoose.model("Coupon", CouponSchema);

module.exports = {couponModel, CouponSchema}