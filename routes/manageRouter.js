const express = require('express')
const router = express.Router()
const authRouter = require("./auth/authRouter");
const dataRouter = require("./data/dataRouter");
const pagesRouter = require("./pages/pagesRouter");
const paymentsAndOrdersRouter = require("./paymentsAndOrders/paymentsAndOrdersRouter");
const pageModel = require('../models/pageModel');
const postModel = require('../models/postModel');
const postTypeModel = require('../models/postTypeModel');
const {getFormattedDate, log} = require("../utils/utilFunctions");
const { verifyAdmin } = require('../middlewares/verifyLogin');
const adminModel = require('../models/adminModel');


// Data Management Logics:
router.use("/auth/", authRouter);
router.use("/", dataRouter)
router.use("/", pagesRouter)
router.use("/", paymentsAndOrdersRouter)
router.get("/about", (req, res)=>{
	res.render("aboutUs")
})
router.get("/support", (req, res)=>{
	res.render("supportPage")
})
router.get("/feedback", (req, res)=>{
	res.render("feedback")
})
router.get("/documentation", (req, res)=>{
	res.render("documentation")
})
router.get("/dashboard", verifyAdmin, async (req, res) => {
	try {
		const email = req.jwt.decoded?.email
		const admin = await adminModel.findOne({email})
		const quickDrafts = admin.quickDrafts
		let posts = await postModel.find({}).select('postName createdAt').sort({createdAt : -1}).limit(5);
		posts = posts.map(post => {
			return {
				_id:post._id,
				postName:post?.postName,
				createdAt:getFormattedDate(post.createdAt)
			}
		})

		let pages = await pageModel.find({}).select('name createdAt').sort({createdAt:-1}).limit(5);
		pages = pages.map(page => {
			return {
				_id:page._id,
				name:page?.name,
				createdAt:getFormattedDate(page.createdAt)
			}
		})

		req.flash("message", {success:true, message:""})
		res.render('dashboardPage',{ 
			message:req.flash("message"),
			posts,
			pages,
			quickDrafts
		});
	} catch (error) {
		log(error);
		res.status(500).json({success:false, message:"server error", error:error})
	}
})
router.get("/guide", (req, res)=>{
	res.render("guide")
})


module.exports = router
