const express = require("express");
const router = express.Router();
const pageController = require('../../controllers/pageController'); 
const manageController = require("../../controllers/manageController");
const uploader = require("../../middlewares/fileUploader");
const paymentsAndOrdersController = require("../../controllers/paymentsAndOrdersController");
const { verifyUserLogin } = require("../../middlewares/verifyLogin");

// for stripe
router.post("/create-checkout-session", paymentsAndOrdersController.createStripeCheckout)

// for phonepe
router.get("/initiate-phonepe-payment", paymentsAndOrdersController.initiatePhonePePayment)


module.exports = router;