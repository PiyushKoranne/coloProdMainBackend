const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
	reviewerImage:{
		type:String,
	},
	reviewScore:{
		type:Number,
		required:true
	},
	reviewerName:{
		type:String,
		required:true
	},
	reviewContent:String,
	googleReviewLink: String,
	unread:{
		type:Boolean,
		default:true
	}
});

const reviewModel = mongoose.model("Reviews", ReviewSchema);

module.exports = { reviewModel }