const { razorpayInstance, stripe } = require("../config/paymentGatewayConfig");
const dataModel = require("../models/dataModel");
const postModel = require("../models/postModel");
const { v4: uuidV4 } = require("uuid");
const { orderModel, userModel } = require("../models/userModel");
const FRONTEND_URL = process.env.FRONTEND_URL;
const crypto = require("crypto");
const { log } = require("../utils/utilFunctions");
const sha256 = require('sha256');
const axios = require('axios')

/**
 * Create an Order	
 * Creates an order by providing basic details such as amount and currency.
 * amount, currency is required
 * @param {object} req 
 * @param {object} res
 * 
 * @returns {object}  
 */
exports.createOrder = async (req, res) => {
	try {
		const { orderId, notes } = req.body;
		const currency = "INR";
		const receipt = uuidV4();
		const match = await orderModel.findOne({ orderId });

		const razorpayOrder = await razorpayInstance.orders.create({
			amount: match.expressDelivery ? (match.orderTotal + match.quantity * 200) * 100 : match.orderTotal * 100,
			currency: currency || "INR",
			receipt: receipt,
		});

		const order = await orderModel.findOneAndUpdate({ orderId }, {
			razorpayOrderId: razorpayOrder.id,
			razorpayOrderReceipt: razorpayOrder.receipt,
		});
		await userModel.findOneAndUpdate({ email: req.jwt.decoded?.email }, {
			"currentOrder.razorpayOrderId": razorpayOrder.id,
			"currentOrder.razorpayOrderReceipt": razorpayOrder.receipt,
		})
		await userModel.findOneAndUpdate({ email: req.jwt.decoded?.email, "placedOrders.orderId": orderId }, {
			"placedOrders.$.razorpayOrderId": razorpayOrder.id,
			"placedOrders.$.razorpayOrderReceipt": razorpayOrder.receipt,
		})
		res.status(200).json({ success: true, message: 'Order created', razorpayOrder: razorpayOrder, order, key_id: process.env.key_id })
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, error: error })
	}
}

// exports.verifyPayment = async (req, res) => {
// 	console.log("\n\n Verifying Payment \n\n");
// 	console.log("PAYMENT VERIFICATION :: ",req.body);
// 	try {

// 		// const {
// 		// 	orderCreationId,
// 		// 	razorpayPaymentId,
// 		// 	razorpayOrderId,
// 		// 	razorpaySignature,
// 		// 	orderId,
// 		// } = req.body;


// 		// const shasum = crypto.createHmac("sha256", process.env.key_secret);

// 		// shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

// 		// const digest = shasum.digest("hex");

// 		// // comaparing our digest with the actual signature
// 		// if (digest !== razorpaySignature)
// 		// 	return res.status(400).json({ msg: "Transaction not legit!" });

// 		// // THE PAYMENT IS LEGIT & VERIFIED
// 		// // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT


// 		// log(req.body);
// 		res.status(400).json({data: req.body})
// 		// res.status(200).json({
// 		// 	msg: "success",
// 		// 	orderId: razorpayOrderId,
// 		// 	paymentId: razorpayPaymentId,
// 		// });
// 	} catch (error) {
// 		log(error);
// 		res.status(500).json({ success: false, error: error })
// 	}
// }

exports.createStripeCheckout = async (req, res) => {

	const { batteryData } = req.body;
	log(batteryData)
	const battery = await postModel.findOne({ postName: batteryData.name });
	if (!battery) return res.status(400).json({ success: false, message: "cannot find the product" })

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price_data: {
					currency: "INR",
					product_data: {
						name: battery?.postData?.name,
						images: ['https://cdn.shopify.com/s/files/1/0070/7032/files/universal_20product_20code.png?format=jpg&quality=90&v=1697911576&width=1024'],
					},
					unit_amount: parseInt(battery?.postData?.specialprice) * 100, 
				},
				quantity: 1,
			},
		],
		mode: 'payment',
		success_url: 'https://indorebattery.com/?status=success',
		cancel_url: 'https://indorebattery.com/?status=failure',
	});

	res.json({ id: session.id, publishable_key: process.env.STRIPE_PUBLISHABLE_KEY });
}

/**
 * Inititate PhonePe Payment
 * Initiates a payment via phonePe
 * @param {object} req
 * @param {object} res
 * 
 * @returns {object}
 */
exports.initiatePhonePePayment = async (req, res) => {
	try {
		let url = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
		let testSaltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
		let testSaltIndex = '1';

		let payload = {
			merchantId: "PGTESTPAYUAT",
			merchantTransactionId: "MT7850590068188104",
			merchantUserId: "MUID123",
			amount: 10000,
			redirectUrl: "https://indorebattery.com/success",
			redirectMode: "REDIRECT",
			mobileNumber: "9999999999",
			paymentInstrument: {
				type: "PAY_PAGE"
			}
		}
		// convert this payload into base64 encoding
		const payloadString = JSON.stringify(payload);
		const encodedPayload = Buffer.from(payloadString).toString('base64');
		const xVerify = sha256(encodedPayload+'/pg/v1/pay'+testSaltKey)+'###'+testSaltIndex;
		console.log('X-VERIFY', xVerify);


		const options = {
			method: 'post',
			url: url,
			headers: {
				'Content-Type': 'application/json',
				'X-VERIFY': xVerify,
			},
			data: {
				request: encodedPayload
			}
		};
		axios
			.request(options)
			.then(function (response) {
				console.log(response.data);
				res.status(200).json({data:response.data});
			})
			.catch(function (error) {
				console.error(error);
			});
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'server error' });
	}
}


/**
 * Verify Payment
 * Verifies the payment status of an existing order.
 * @param {object} req 
 * @param {object} res
 * 
 * @returns {object}
 */

exports.verifyPayment = async (req, res) => {
	try {
		const { response, orderId } = req.body;
		const secret = process.env.key_secret;
		const stringToSign = `${response.razorpay_order_id}|${response.razorpay_payment_id}`;
		const hmac = crypto.createHmac('sha256', secret);
		const signature = hmac.update(stringToSign).digest('hex');

		if (signature === response.razorpay_signature) {

			await userModel.findOneAndUpdate({ email: req.jwt.decoded?.email, "placedOrders.orderId": orderId }, {
				$set: {
					"placedOrders.$.status": "Completed",
					"currentOrder": null,
					"placedOrders.$.razorpayPaymentId": response.razorpay_payment_id,
					cart: [],
				}
			})

			const thisOrder = await orderModel.findOneAndUpdate({ orderId }, {
				$set: {
					"status": "Completed",
					razorpayPaymentId: response.razorpay_payment_id
				}
			}, {new: true})

			for( let orderItem of thisOrder.orderItems) {
				const post = await postModel.findOne({_id: orderItem?.productId});
				const updatedStockString = `${parseInt(post.postData?.stock) - orderItem?.productQuantity}`
				await postModel.findOneAndUpdate({_id: orderItem?.productId}, {
					"postData.stock": updatedStockString,
				})
			}

			res.status(200).json({ success: true, message: 'Payment verified', orderId });

		} else {
			// Invalid payment signature
			res.status(400).json({ success: false, message: 'Invalid payment signature' });
		}
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, error: error })
	}
}

/**
 * Get Payment Details
 * Get the detals regarding the payment for a particular order
 * @param {object} req 
 * @param {object} res
 * 
 * @returns {object}
 */

exports.getPaymentDetails = async (req, res) => {
	try {
		// get the receipt id from the request;
		const { receipt } = req.body;
		const localOrder = await orderModel.findOne({ receipt });
		if (!localOrder) return res.status(400).json({ success: false, message: "Bad receipt" });
		const order = await razorpayInstance.orders.fetch(localOrder.id);
		if (order) {
			res.status(200).json({ success: true, message: "Order details fetched", order })
		}
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, error: error })
	}
}