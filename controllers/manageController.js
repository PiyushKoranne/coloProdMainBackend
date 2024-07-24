const { brandModel, categoryModel, modelModel } = require("../models/brandModel");
const postModel = require("../models/postModel");
const { sendMail } = require("../config/mailerConfig");
const dataModel = require("../models/dataModel");
const pageModel = require("../models/pageModel");
const { userModel, orderModel } = require("../models/userModel");
const { couponModel } = require("../models/couponModel");
const { v4: uuidv4 } = require("uuid")
const Quotation = require("../models/quotationModel")
const { reviewModel } = require("../models/reviewModel")
const requestCallBackModel = require("../models/callbackModel");
const postTypeModel = require("../models/postTypeModel");
const { InternalServerError, BadRequestError, UnauthorizedError, NotFoundError } = require("../config/apiErrors");
const { log, sendInvoiceEmail, getFormattedDate } = require("../utils/utilFunctions")
const nodemailer = require("nodemailer");
const adminModel = require("../models/adminModel");
const mongoose = require("mongoose")
const testOrderModel = require("../models/testOrderModel");

// RENDERS :


// LOGICS :


exports.getBookedTimingsByMonth = async (req, res) => {
	try {
		console.log("Getting booked timings");
		// get month
		const {month, year} = req.body;
		const match = (await testOrderModel.find({})).filter(item => {
			let dt = new Date(item.scheduledAt);
			if(dt.getFullYear() === year){
				if(new Date(item.scheduledAt).getMonth() === month){
					return true
				} else {
					return false;
				}
			} else {
				return false;
			}
		})

		return res.status(200).json({success: true, data:match.map(item => item.scheduledAt)});
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: "server error" });
	}
}

exports.placeOrder = async (req, res) => {
	try {
		const {scheduledAt, confirm, firstName, lastName, dob, streetAddress, city, state, zip, phone, email, race, ethnicity} = req.body;
		const count = testOrderModel.find().countDocuments();
		const newOrder = new testOrderModel({
			orderId:`${11500+count+1}`,
			scheduledAt,
			confirm,
			firstName,
			lastName,
			dob,
			streetAddress,
			city,
			state,
			zip,
			phone,
			email,
			race,
			ethnicity,
			paymentConfirmed: false, 
			paymentInformation:{
				status:"PENDING",
				transactionId: "TXN_PENDING"
			}
		})
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: "server error" });
	}
}

exports.saveUserOrder = async (req, res) => {
	try {
		// not implemented
		res.status(200).json({ success: true, message: "unimplemented" });
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.editPostCategory = async (req, res) => {
	try {
		log("Rendering the post catgory edit page....");
		const categoryName = req?.query?.categoryName;
		const postCategories = await categoryModel.find();
		const categoryData = await categoryModel.findOne({ categoryName: categoryName });
		res.render('editCategoryData', { catgeoryData: categoryData, postCategories: postCategories });
	} catch (error) {
		log("Error: While editing post category.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}
