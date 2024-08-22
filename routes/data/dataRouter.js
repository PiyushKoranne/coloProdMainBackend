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
const XLSX = require('xlsx');
const postModel = require("../../models/postModel");
const { getNextOrderId } = require("../../utils/utilFunctions");
const customizationModel = require("../../models/customizationModel");
const {couponModel} = require("../../models/couponModel");
const nodemailer = require("nodemailer");

function fillOrderDetails(orderData) {
  // Path to your existing Excel file
  const filePath = path.join(__dirname, '../../excel_data/orders.xls');

  // Read the Excel file
  const workbook = XLSX.readFile(filePath);

  // Get the first worksheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Find the next empty row in the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  let nextRow = range.e.r + 1;

  for (let R = range.s.r; R <= range.e.r; R++) {
    let empty = true;
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (worksheet[cell_ref]) {
        empty = false;
        break;
      }
    }
    if (empty) {
      nextRow = R;
      break;
    }
  }

  // Mapping of backend data to Excel columns
  const columnMapping = {
    'orderId': ['A'],
    'status': ['B'], // set
    'orderDate': ['C'], // set
    'firstName': ['E', 'O'],
    'lastName': ['F', 'P'],
    'streetAddress': ['H', 'Q'],
    'city': ['I','R'],
    'state': ['J','S'],
    'zip': ['K','T'],
    'countryCode': ['L','U'], // set
    'email': ['M'],
    'phone': ['N'],
    'dob': ['AB'],
    'gender': ['AD'],
    'race': ['AE'],
    'ethnicity': ['AF'],
    'paymentMethod': ['AN'], // set
    'productItemNumber': ['AQ'], // set
    'productItemName': ['AR'], // set
    'productPrice': ['AT','AW', 'AY']
  };

  
   // Fill the worksheet with order data
  Object.keys(orderData).forEach((key) => {
    if (columnMapping[key]) {
      columnMapping[key].forEach((column) => {
        const cellAddress = column + (nextRow + 1); // Adjust for 0-based index
        worksheet[cellAddress] = { v: String(orderData[key]), t: 's' }; // Assuming all data is string
      });
    }
  });

  // Update the worksheet range
  worksheet['!ref'] = XLSX.utils.encode_range(range.s, { c: range.e.c, r: nextRow });


  // Write the updated workbook to a new file or overwrite the existing file
  XLSX.writeFile(workbook, filePath);
  console.log("Data added to Excel Sheet");
}

// fetching data routes

// get already scheduled times
router.post("/booked-timings", dataController.getBookedTimingsByMonth);


router.get("/colo-pay", (req, res) => {
	console.log("Generating a form token");
	getAnAcceptPaymentPage((response) => { res.status(200).json({ code: response }); console.log("RESPONSE", response) });
})

router.post("/check-coupon", async (req, res) => {
	try{
		const {couponCode} = req.body;
		const match = await couponModel.findOne({couponCode}).lean();
		if(!match) return res.status(400);
		return res.status(200).json({...match});
	} catch(err) {
		console.log(err);
		res.status(500).json({success: false, err})
	}
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
				orderConfirmation: true,
			}
		})

		// add data to the excel sheet 
		const post = await postModel.findOne({_id: match.productId});

		let orderData = await testOrdersModel.findOne({_id: regId}).lean();
		orderData.status = "Processing";
		orderData.orderDate = new Date().toLocaleString();
		orderData.countryCode = "US";
		orderData.productItemNumber = "1";
		orderData.productItemName = post ? post.postData.productName: "";
                orderData.productPrice = post ? post.postData.productPrice : "";
		orderData.paymentMethod = orderData.isInvoiced ? "INVOICE":"ONLINE";
		fillOrderDetails(orderData);
		return res.status(200).json({ success: true, data: { scheduledAt: match.scheduledAt } });

	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error })
	}
})

// route for getting invoiced orders 
// route for getting independent orders


router.post("/register-new-test-data", upload.any(), async (req, res) => {
	try {
		console.log("Registration data", req.body);
		const count = await testOrdersModel.countDocuments();
		const nextId = await getNextOrderId();

		const { providerId } = req.body;
		let checkProvider = false;
		let checkInvoice = false;
		let hasCoupon = false;
		let hasDiscount = false;
		if (providerId && providerId !== "undefined") {
			const providerMatch = await providerModel.findOne({ _id: providerId });
			if (providerMatch) checkProvider = true;
			if(req.body.isInvoiced && req.body.isInvoiced === 'true') checkInvoice = true;
		}

		if(!checkProvider){
		    if(req.body.coupon){
			hasCoupon = true;
		    }
		}

		const post = await postModel.findOne({postType:"669a3a1f348f5b66bf71bfe2", postName:"ColoHealth"});
		console.log("########################\n\n",post);
		if(!post) return res.status(400).json({success: false, msg:"Product not found to place order"});
		let amount = post.postData.productPrice;
		// if has discount then process discount first

		if(hasCoupon){
		    const productPrice = post.postData.productPrice;
		    const couponMatch = await couponModel.findOne({couponCode: req.body.coupon});
		    if(couponMatch){
			const discount = productPrice * (couponMatch.couponDiscount/100);
			const max = couponMatch.maximumAllowedDiscount;
			if(max) amount = discount >= max ? productPrice-max : productPrice-discount;
			else amount = productPrice-discount;
			hasDiscount = true;
		    } else {
			hasDiscount = false;
			amount = productPrice
		    }
		}

		const newRegistration = new testOrdersModel({
			providerId: (req.body.providerId && checkProvider) ? req.body.providerId : 'NULL',
			orderId: nextId,
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
			orderConfirmation: (checkInvoice && checkProvider) ? true : false,
			isInvoiced: checkInvoice,
			productId:post._id,
			productName: post.postData.productName,
			paymentConfirmed: (checkInvoice && checkProvider) ? true : false,
			paymentInformation: {
				status: "PENDING",
				amount,
				hasDiscount,
				productPrice: post.postData.productPrice,
				couponUsed: hasDiscount ? req.body.coupon : "NULL", 
				transactionId: (checkInvoice && checkProvider) ? "INVOICED" : "PENDING",
			}
		});
		await newRegistration.save();

		// created a payment verificatyion token for future
		const paymentVerificationToken = await jwt.sign({ regId: newRegistration._id }, "Test101Credentials");
		await testOrdersModel.findOneAndUpdate({ _id: newRegistration._id }, {
			$set: {
				'paymentInformation.paymentVerificationHash': paymentVerificationToken
			}
		});

		// rename the pdf as it came from frontend
		if (req.body.providerId) {
			const oldPath = path.join(__dirname, "../../recforms", req.files[0].filename);
			const newPath = path.join(__dirname, "../../recforms", `PROV_${req.body.providerId}_${req.body.firstName}_${req.body.lastName}_${newRegistration._id.toString()}_${req.files[0].originalname}`);
			fs.renameSync(oldPath, newPath);
			console.log("Req form pdf saved and renamed");
		}

		if(checkInvoice){
			let orderData = await testOrdersModel.findOne({_id: newRegistration._id}).lean();
  	                orderData.status = "Processing";
                	orderData.orderDate = new Date().toLocaleString();
                	orderData.countryCode = "US";
                	orderData.productItemNumber = "1";
  	               	orderData.productItemName = post.postData.productName;
			orderData.productPrice = post.postData.productPrice;
			orderData.paymentMethod = orderData.isInvoiced ? "INVOICE":"ONLINE";
                	fillOrderDetails(orderData);
			return res.status(200).json({ regid: newRegistration._id })
		}
		
		// generate a payment token
		!checkInvoice && getAnAcceptPaymentPage((error, response) => {
			if (error) {
				throw error;
			} else {
				res.status(200).json({ code: response.token, regid: response.regid })
			}
		}, newRegistration._id, paymentVerificationToken, amount);

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

router.get("/download-welcome-pdf", async (req, res) => {
        try {
                const providerId = req.query.pid;
                console.log("DOWNLOADING SCRIPT", req.query);
                if(!providerId) return res.status(400).json({success: false, msg:"order id/provider id not found"});
	
		const customizationData = await customizationModel.findOne({});


 

                const directoryPath = path.join(__dirname,"../../recforms");
                const files = fs.readdirSync(directoryPath);
                const requiredFile = files.filter(file => file.startsWith(`${customizationData.portalWelcomePDF}`))[0];
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

router.get("/download-info-noteleg", async (req, res) => {
        try {

                const customizationData = await customizationModel.findOne({});

                const directoryPath = path.join(__dirname,"../../recforms");
                const files = fs.readdirSync(directoryPath);
                const requiredFile = files.filter(file => file.startsWith(`${customizationData.notEligiblePDF}`))[0];
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

router.post("/noteleg-info-submit", async (req, res) => {
        try {
		const customizationData = await customizationModel.findOne({});

                const directoryPath = path.join(__dirname,"../../recforms");
                const files = fs.readdirSync(directoryPath);
                const requiredFile = files.filter(file => file.startsWith(`${customizationData.notEligiblePDF}`))[0];
                const filePath = path.join(__dirname,"../../recforms", requiredFile);

		const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
                user: `${process.env.SMTP_MAIL}`, // generated user
                pass: `${process.env.SMTP_MAIL_PSWD}`  // generated password
        }
});
const ip = "http://174.138.76.145/" //change this when you change the ip address


const mailOptions = {
        from: 'hrashikeshapandey@gmail.com',
        to: email,
        subject: 'Welcome to New Day Diagnostics!',
        attachments: [
                {
                        filename: `ColoHealth_Eligibility_Information.pdf`, // The name of the attachment file
                        path: filePath
                }
        ],
        html:``
}

transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
                console.error(error);
        } else {
                log('Email sent: ' + info.response);
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
		const orders = await testOrdersModel.find({providerId: match._id.toString(), orderConfirmation: true});
		return res.status(200).json({success: true, orders:orders.map(item => ({orderId: item.orderId, _id:item._id.toString(), firstName: item.firstName, lastName: item.lastName, dob: item.dob, testStatus: item.testStatus, testingStatusNotes: item.testingStatusNotes}))});
		
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
		let matches = await testOrdersModel.find({}).lean();
		matches = matches.filter((item)=>{
			let dt = new Date(item.scheduledAt);
			if(dt >= today) return true;
			else return false;
		})
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
// router.post("/place-order", verifyUserLogin, dataController.placeOrder);

// placing order by provider



module.exports = router;
