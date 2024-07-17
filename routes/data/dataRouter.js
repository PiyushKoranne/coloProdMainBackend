const express = require("express");
const router = express.Router();
const pageController = require('../../controllers/pageController');
const dataController = require("../../controllers/manageController");
const uploader = require("../../middlewares/fileUploader");
const { verifyUserLogin, verifyAdmin, verifyLogin } = require("../../middlewares/verifyLogin");
const testOrdersModel = require("../../models/testOrderModel");
const providerModel = require("../../models/providerModel");
const upload = require("../../middlewares/fileUploader");
const { registrationHTML } = require("../../config/constants");
const { sendMail } = require("../../config/mailerConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const getAnAcceptPaymentPage = require("../../config/formTokenConfig");

// fetching data routes

// get already scheduled times
router.post("/booked-timings", dataController.getBookedTimingsByMonth);


router.get("/colo-pay", (req, res) => {
	console.log("Generating a form token");
	getAnAcceptPaymentPage((response) => { res.status(200).json({ code: response }); console.log("RESPONSE", response) });
})

router.post("/verify-payment", async (req, res) => {
	try {
		const { pv, regId } = req.body;
		const match = await testOrdersModel.findOne({ _id: regId });
		if (!match) return res.status(400).json({ success: true, msg: "bad request, no match found" });
		if (match.paymentInformation.paymentVerificationHash !== pv) {
			return res.status(400).json({ success: true, msg: "bad request, no verification token found" });
		}
		const decoded = await jwt.verify(match.paymentInformation.paymentVerificationHash, "Test101Credentials");
		if (!decoded || decoded.regId !== match._id.toString()) return res.status(400).json({ success: true, msg: "bad request, verification token invalid" });
		await testOrdersModel.findOneAndUpdate({ _id: regId }, {
			$set: {
				'paymentInformation.status': "COMPLETED",
				'paymentInformation.transactionId': "COMPLETED__" + match._id.toString(),
				'paymentInformation.paymentVerificationHash': "COMPLETED",
				paymentConfirmed: true,
			}
		})
		return res.status(200).json({ success: true, data: { scheduledAt: match.scheduledAt } });

	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error })
	}
})
router.post("/register-new-test-data", upload.any(), async (req, res) => {
	try {
		console.log("Registration data", req.body);
		const count = await testOrdersModel.countDocuments();


		const { providerId } = req.body;
		let checkProvider = false;
		if (providerId && providerId !== "undefined") {
			const providerMatch = await providerModel.findOne({ _id: providerId });
			if (providerMatch) checkProvider = true;
		}

		const newRegistration = new testOrdersModel({
			providerId: (req.body.providerId && checkProvider) ? req.body.providerId : 'NULL',
			orderId: `${11500 + count + 1}`,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			streetAddress: req.body.streetAddress,
			city: req.body.city,
			state: req.body.state,
			zip: req.body.zip,
			phone: req.body.phone,
			email: req.body.email,
			dob: req.body.dob,
			gender: req.body.gender,
			race: req.body.race,
			ethnicity: req.body.ethnicity,
			registrationConsent: req.body.confirm,
			scheduledAt: req.body.scheduledAt,
			paymentConfirmed: false,
			paymentInformation: {
				status: "PENDING",
				transactionId: "PENDING"
			}
		});
		await newRegistration.save();

		const paymentVerificationToken = await jwt.sign({ regId: newRegistration._id }, "Test101Credentials");
		await testOrdersModel.findOneAndUpdate({ _id: newRegistration._id }, {
			$set: {
				'paymentInformation.paymentVerificationHash': paymentVerificationToken
			}
		});

		// rename the pdf 
		if (req.body.providerId) {
			const oldPath = path.join(__dirname, "../../recforms", req.files[0].filename);
			const newPath = path.join(__dirname, "../../recforms", `PROV_${req.body.providerId}_${req.body.firstName}_${req.body.lastName}_${newRegistration._id.toString()}_${req.files[0].originalname}`);
			fs.renameSync(oldPath, newPath);
			console.log("Req form pdf saved and renamed");
		}

		getAnAcceptPaymentPage((error, response) => {
			if (error) {
				throw error;
			} else {
				res.status(200).json({ code: response.token, regid: response.regid })
			}
		}, newRegistration._id, paymentVerificationToken);

	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error })
	}
})

router.get("/download-rec-rpt", async (req, res) => {
	try {
		const orderId = req.query.oid;
		const providerId = req.query.pid;
		console.log("DOWNLOADING SCRIPT", req.query);
		if(!orderId || !providerId) return res.status(400).json({success: false, msg:"order id/provider id not found"});
		const orderMatch = await testOrdersModel.findOne({_id: orderId});
		if(!orderMatch) return res.status(400).json({success: false, msg:"order not found"});

		const directoryPath = path.join(__dirname,"../../recforms");
		const files = fs.readdirSync(directoryPath);
		const requiredFile = files.filter(file => file.startsWith(`PROV_${providerId}_${orderMatch.firstName}_${orderMatch.lastName}_${orderId}`))[0];
		const filePath = path.join(__dirname,"../../recforms", requiredFile);
		console.log(filePath)
		res.download(filePath, requiredFile, (err) => {
			if (err) {
				console.error('Error downloading the file:', err);
				res.status(500).send('Error downloading the file.');
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error });
	}
})


router.post("/register-provider", upload.single("profileImage"), async (req, res) => {
	try {
		const { firstName, lastName, dob, email, phone, password } = req.body;
		const match = await providerModel.findOne({ email: email });
		if (match) return res.status(400).json({ success: false, msg: "Email is already registered" });
		const hash = await bcrypt.hash(password, 10);
	
		const newProvider = new providerModel({
			firstName,
			lastName,
			dob,
			email,
			phone,
			password: hash,
			accessToken: "NULL",
			joined: new Date(),
			orderCount: 0,
			profileImage: req.file.filename,
		});

		await newProvider.save();

		sendMail(email, registrationHTML(newProvider), registrationSUB)

		res.status(200).json({ success: true, msg: "User registered" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error })
	}

});

router.post("/get-orders-for-provider", async(req, res) => {
	try {
		const {providerId} = req.body;
		console.log("Gettiong orders for the provider", providerId);
		if(!providerId) return res.status(400).json({success: false, msg:"provider is required"});
		const match = await providerModel.findOne({_id: providerId});
		if(!match) return res.status(400).json({success: false, msg:"cannot find provider"});
		const orders = await testOrdersModel.find({providerId: match._id.toString()});
		return res.status(200).json({success: true, orders:orders.map(item => ({orderId: item.orderId, _id:item._id.toString(), firstName: item.firstName, lastName: item.lastName, dob: item.dob}))});
		
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error })
	}
})

router.post("/provider-login", async (req, res) => {
	try {
		console.log(req.body);
		const { email, password, rememberMe } = req.body;
		if (!email) return res.status(400).json({ success: false, msg: "Bad request, email is missing" });
		if (!password) return res.status(400).json({ success: false, msg: "Bad request, password is missing" });

		const match = await providerModel.findOne({ email: email });
		if (!match) return res.status(400).json({ success: false, msg: "Bad request, please check your email" });

		if (await bcrypt.compare(password, match.password)) {
			const accessToken = jwt.sign({ email: email, id: match._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
			match.accessToken = accessToken;
			await match.save();
			return res.status(200).json({ success: true, msg: "Login success", data: { _id:match._id, firstName: match.firstName, mi: match.mi, lastName: match.lastName, dob: match.dob, email: match.email, phone: match.phone, orderCount: match.orderCount, joined: match.joined, accessToken: match.accessToken, profileImage: match.profileImage, address1: match.address1, address2: match.address2, city: match.city, state: match.state, zip: match.zip, npi: match.npi, lisProviderId: match.lisProviderId, resultContactEmail: match.resultContactEmail, } });
		} else {
			return res.status(400).json({ success: false, msg: "Bad request, please check your email and/or password" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error })
	}
});


router.post("/verify", async (req, res) => {
	try {
		const { accessToken } = req.body;
		if (!accessToken) return res.status(400).json({ success: false });
		const decoded = await jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
		if (decoded) {
			const match = await providerModel.findOne({ email: decoded.email });
			if (match.accessToken === accessToken) {
				res.status(200).json({ success: true });
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error });
	}
})

router.post("/password-reset", async (req, res) => {
	try {
		const { oldPassword, newPassword, newConfirmPassword, accessToken } = req.body;

		if (!accessToken) return res.status(401).json({ success: false });
		const decoded = await jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
		const match = await providerModel.findOne({ email: decoded.email });
		if (!match) return res.status(401).json({ success: false });
		if (await bcrypt.compare(oldPassword, match.password)) {
			const hash = await bcrypt.hash(newPassword, 10);
			match.password = hash;
			await match.save();
			res.status(200).json({ success: true, msg: "password changed successfully" })
		} else {
			return res.status(400).json({ success: false });
		}

	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error });
	}
})

router.get("/get-scheduled-times", async (req, res) => {
	try {
		console.log("This endpoint is called : getting scheduled times");
		const today = new Date();
		const matches = await testOrdersModel.find({ scheduledAt: { $gt: today } });
		const blockedTimes = matches.map(item => item.scheduledAt);
		res.status(200).json({ success: true, blockedTimes });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error })
	}
})

router.post("clear-scheduled-time", async (req, res) => {
	// if payment failed
	// clear the scheduled time
	// on payment success add this info to the user registrations to confirm. 
})

router.post("get-provider-orders", async (req, res) => {
	// get providerId
	// get test orders where provider id matches
	// filter according to search, page, and itemsPerPage query values
	// send
})

// provider related routes

// orders will be placed only after successful payment 
// order related routes
router.post("/place-order", verifyUserLogin, dataController.placeOrder);

// placing order by provider



module.exports = router;