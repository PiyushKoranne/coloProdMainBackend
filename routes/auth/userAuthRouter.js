const express = require("express");
const router = express.Router();
const pageController = require('../../controllers/pageController'); 
const manageController = require("../../controllers/manageController");
const uploader = require("../../middlewares/fileUploader");
const authController = require("../../controllers/authController");
const { verifyLogin } = require("../../middlewares/verifyLogin");

// userRouter
router.post("/user-register",authController.handleUserRegister);
router.post("/user-email-verify", authController.verifyEmail);
router.post("/initiate-password-reset", authController.initiatePasswordReset);
router.post("/password-reset", authController.passwordReset);
router.post("/send-verification-email", authController.sendVerificationEmail);
router.post("/user-login",authController.handleUserLogin);
router.get("/login-check",authController.handleLoginCheck);
router.get("/user-logout",authController.handleUserLogout);


module.exports = router;