const adminModel = require("../models/adminModel");
const { userModel } = require("../models/userModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { NotFoundError, ValidationError } = require("../config/apiErrors");
const { generateOTP, log } = require("../utils/utilFunctions");

exports.renderLoginPage = async (req, res) => {
	try {
		log("rendering login page");
		res.render("login", {
			message: req.flash("login-message")
		});
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: error.message, error })
	}
}

exports.handleAdminRegister = async (req, res) => {
	try {
		log("trying to register new admin");
		const { email, username, password, confirmPassword } = req.body;
		const match = await adminModel.findOne({ $or: [{ email: email }, { username: username }] });
		if (match) return res.status(400).json({ success: false, message: "email and/or username already exists" });
		if (password !== confirmPassword) {
			return res.status(400).json({ success: false, message: "passwords do not match" });
		}
		const hash = await bcrypt.hash(password, 10);
		const newAdmin = new adminModel({
			email,
			username,
			password: hash,
			roles: ["admin"],
			status: false,
			themeName: "Default"
		});
		await newAdmin.save();
		res.status(200).json({ success: true, message: "user registered successfully" })
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: error.message, error })
	}
}

exports.handleAdminLogin = async (req, res) => {
	try {
		log("admin logging in ...\n\n\n", req.body,"\n\n\n");
		const { email, password } = req.body;
		const match = await adminModel.findOne({ email });
		if (!match) {
			req.flash("login-message", { success: false, message: "Oops! Email and/or password are incorrect." })
			return res.redirect("/api/v1/manage/auth");
		}
		if (await bcrypt.compare(password, match.password)) {
			console.log("PASSWORD MATCH")
			const access_token = jwt.sign({ email, roles: match.roles }, process.env.ACCESS_TOKEN_SECRET);
			match.access_token = access_token;
			match.status = true;
			req.session.access_token = access_token;
			await match.save();
			res.redirect("/api/v1/manage/dashboard");
		} else {
			log("PASSWORD IS INCORRECT")
			req.flash("login-message", { success: false, message: "Oops! Email and/or password are incorrect." })
			res.redirect("/api/v1/manage/auth");
		}
	} catch (error) {
		req.flash("login-message", { success: false, message: error.message })
		res.status(200).json({ success: false, error: error.message })
	}
}

exports.checkLoginStatus = async (req, res) => {
	try {
		log("checking login status...");
		const { access_token } = req.session;
		if (!access_token) return res.status(400).json({ success: false, message: "token invalid" });
		const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
		if (!decoded) return res.status(400).json({ success: false, message: "token invalid" });
		res.status(200).json({ success: true });
	} catch (error) {
		req.flash("login-message", { success: false, message: error.message })
		res.status(500).json({ success: false, message: 'server error' })
	}
}

exports.handleAdminLogout = async (req, res) => {
	try {
		log("admin logging out");
		const { access_token } = req.session;
		if (!access_token) return res.redirect("/api/v1/manage/auth/")
		const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
		if (decoded) {
			const match = await adminModel.findOne({ email: decoded.email });
			if (!match) return res.redirect("/api/v1/manage/auth/")
			match.access_token = "";
			match.status = false;
			req.session.access_token = "";
			await match.save();
			res.status(200).json({ success: true, message: 'logged out' })
		}
	} catch (error) {
		log("logging error");
		log(error);
		res.status(500).json({ success: false, message: error.message, error })
	}
}

exports.handleForgotPassword = async (req, res) => {
	try {
		log("rendering forgot password page");
		res.render("forgotPassword")
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: error.message, error });
	}
}

exports.generateOtp = async (req, res) => {
	try {
		log('generating OTP...');
		const { email } = req.body
		function generateOTP() {
			return Math.floor(1000 + Math.random() * 9000).toString();
		}
		const otp = generateOTP();
		const user = await adminModel.findOne({ email: email });
		user.otp = otp;
		await user.save();

		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: `${process.env.SMTP_MAIL}`, // generated user
				pass: `${process.env.SMTP_MAIL_PSWD}`  // generated password
			}
		});
		const ip = "batterybackend.react.stagingwebsite.co.in" //change this when you change the ip address

		const mailOptions = {
			from: 'hrashikeshapandey@gmail.com',
			to: email,
			subject: 'Password Reset OTP',
			html: `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;margin:0px auto;max-width:600px;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
			<tbody>
			   <tr>
				  <td style="border-collapse:collapse">
					 <span>
						<table style="border-collapse:collapse;font-family:Roboto,arial;font-weight:normal;margin:0px auto;max-width:600px;width:100%" width="100%" cellspacing="0" cellpadding="0" align="center">
						   <tbody>
							  <tr>
								 <td style="border-collapse:collapse;font-size:0px;padding:32px 5px 28px;text-align:center" align="center">
									<div style="display:inline-block;float:left;max-width:290px;vertical-align:top;width:100%">
									   <table style="border-collapse:collapse;font-family:Roboto,arial;font-weight:normal" width="100%" cellspacing="0" cellpadding="0">
										  <tbody>
											 <tr>
												<td style="border-collapse:collapse;font-size:15px;padding:2px 0px 0px">
												   <table style="border-collapse:collapse;font-family:roboto,arial;font-weight:500;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0">
													  <tbody>
														 <tr>
															<td style="border-collapse:collapse;text-align:left"><img style="height:auto;outline:none;text-decoration:none" src="${ip}/static/mailLoginIcon.svg" alt="logo " width="50" height="auto" class="CToWUd" data-bit="iit">
																<figcaption>Your branding here</figcaption>
															</td>
														 </tr>
													  </tbody>
												   </table>
												</td>
											 </tr>
										  </tbody>
									   </table>
									</div>
									<div style="display:inline-block;float:right;max-width:290px;vertical-align:top;width:100%">
									   <table style="border-collapse:collapse;font-family:Roboto,arial;font-weight:normal" width="100%" cellspacing="0" cellpadding="0">
										  <tbody>
											 <tr>
												<td style="border-collapse:collapse;font-size:15px;padding:10px 0px 0px">
												   <table style="border-collapse:collapse;font-family:roboto,arial;font-weight:500;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0">
													  <tbody>
														 <tr>
															<td style="border-collapse:collapse;padding-right:0px;padding-top:0px">
															   <table style="border-collapse:collapse;font-family:roboto,arial;font-weight:500;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0">
																  <tbody>
																	 <tr>
																		<td style="border-collapse:collapse;color:rgb(144,164,174);font-family:Roboto,arial;font-size:15px;font-weight:bold;line-height:16px;text-align:right" align="right" width="100%"><a style="color:rgb(0,0,0);font-family:Roboto,arial;font-size:18px;font-weight:700;line-height:16px;text-decoration:none" href="https://emailssignature.com" rel="noopener" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://emailssignature.com&amp;source=gmail&amp;ust=1700029623404000&amp;usg=AOvVaw3GmZFuNorLZ1Vr1ikcRs9u">U-CMS</a></td>
																	 </tr>
																  </tbody>
															   </table>
															</td>
														 </tr>
													  </tbody>
												   </table>
												</td>
											 </tr>
										  </tbody>
									   </table>
									</div>
								 </td>
							  </tr>
						   </tbody>
						</table>
					 </span>
					 <table style="border-collapse:collapse;border-left:1px solid rgb(221,221,221);border-right:1px solid rgb(221,221,221);border-top:1px solid rgb(221,221,221);font-family:Arial,sans-serif;font-weight:normal;max-width:600px;width:100%;background-color:rgb(255,255,255)" border="0" width="100%" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
						<tbody>
						   <tr>
							  <td style="border-collapse:collapse">
								 <table style="background-color:#0396FF;max-width:600px;border-collapse:collapse;width:100%" border="0" width="600" cellspacing="0" cellpadding="0">
									<tbody>
									   <tr>
										  <td style="max-width:600px;border-collapse:collapse;font-size:16px;padding-right:40px" align="left" width="600">
											 <span>
												<table style="background-color:#0396FF;max-width:600px;border-collapse:collapse;width:100%" border="0" width="600" cellspacing="0" cellpadding="0">
												   <tbody>
													  <tr>
														 <td style="max-width:69px;padding-right:12px;padding-left:40px;border-collapse:collapse;padding-top:37px" align="left" width="69"><img style="outline:none;text-decoration:none" src="https://ci6.googleusercontent.com/proxy/c0ae1pHN2D5fZXqAEQywogYhm0u47xu3Ug_yWDvpIIefHp_hSpPLG9enPt24Wgyqx3GxsHnWStIKNZZIpUheM2h7vtHQx5guBqvJm7cEHDUO4urWvvDQnHzPiMnulfbB1Q=s0-d-e1-ft#http://services.google.com/fh/files/emails/hero_icon_project_reinstatement.png" alt="Notification" width="17" height="18" class="CToWUd" data-bit="iit"></td>
														 <td style="width:100%;max-width:531px;font-family:Roboto,arial;font-weight:500;font-size:14px;color:rgb(255,255,255);letter-spacing:0.6px;border-collapse:collapse;padding-top:33px" align="left" width="531">Password Reset Confirmation
														 </td>
													  </tr>
												   </tbody>
												</table>
											 </span>
											 <table style="background-color:#0396FF;max-width:600px;border-collapse:collapse;width:100%;font-family:Roboto,arial;font-weight:500;color:rgb(255,255,255);line-height:32px;font-size:24px" border="0" width="600" cellspacing="0" cellpadding="0">
												<tbody>
												   <tr>
													  <td style="width:100%;max-width:531px;border-collapse:collapse;font-family:Roboto,arial;font-weight:500;color:rgb(255,255,255);line-height:32px;font-size:24px;padding:13px 12px 24px 40px" align="left" width="531">&nbsp; Welcome to U-CMS</td>
												   </tr>
												</tbody>
											 </table>
										  </td>
									   </tr>
									</tbody>
								 </table>
								 <table style="max-width:600px;border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;width:100%" border="0" width="600" cellspacing="0" cellpadding="0">
									<tbody>
									   <tr>
										  <td style="width:100%;max-width:520px;padding-top:25px;padding-left:40px;padding-right:40px" width="520">
											 <table style="max-width:520px;border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;width:100%" border="0" width="520" cellspacing="0" cellpadding="0">
												<tbody>
												   <tr>
													  <td style="padding-bottom:16px;font-family:Roboto,arial;font-weight:normal;font-size:14px;color:rgb(69,90,100);line-height:24px">Hey there!</td>
												   </tr>
												   <tr>
													  <td style="padding-bottom:16px;font-family:Roboto,arial;font-size:14px;line-height:24px">
														 <p style="font-weight: bold;">OTP: ${otp}</p>
														 <p>To complete the password reset process, please use the following One-Time Password (OTP): ${otp}. Enter this code on the reset password page.<br>
															</p>

															<p style="font-weight: bold;">Didn't Request This?</p>

													  <p></p> If you didn't request a password reset, no worries! Your account is safe and secure. Feel free to ignore this email.
															
													  <p>
														<span style="font-weight: bold;"> Need Help?</span><br>

														If you encounter any issues or need further assistance, don't hesitate to reach out to our support team at .<br>
																															
														Once again, thanks for being a part of our HRMS community. We appreciate your trust and are here to help you every step of the way.<br>
																															
													   </p>                                                                            
														 <p style="color:rgb(69,90,100);font-weight:normal"><span style="color:rgb(52,152,219)">

													  </span></p></td>
												   </tr>
												</tbody>
											 </table>
										  </td>
									   </tr>
									</tbody>
								 </table>
								 <span>
									<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal" border="0" width="100%" cellspacing="0" cellpadding="0">
									   <tbody>
										  <tr>
											 <td style="border-bottom:1px solid rgb(221,221,221);border-collapse:collapse;padding-left:40px;width:100%;padding-right:22px" width="100%">
												<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal" border="0" cellspacing="0" cellpadding="0">
												   <tbody>
													  <tr>
														 <td style="border-collapse:collapse;color:rgb(69,90,100);font-family:Roboto,arial;font-size:14px;font-weight:normal;line-height:24px;padding-bottom:7px;padding-top:14px">Thanks,</td>
													  </tr>
													  <tr>
														 <td style="border-collapse:collapse;color:rgb(69,90,100);font-family:Roboto,arial;font-size:16px;font-weight:700;line-height:24px;padding-bottom:20px">U-CMS Team</td>
													  </tr>
												   </tbody>
												</table>
											 </td>
										  </tr>
									   </tbody>
									</table>
								 </span>
							  </td>
						   </tr>
						</tbody>
					 </table>
				  </td>
			   </tr>
			   <tr>
				  <td style="border-collapse:collapse">
					 <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;margin:0px auto;max-width:600px;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
						<tbody>
						   <tr>
							  <td style="border-collapse:collapse;color:rgb(117,117,117);font-family:Roboto,arial;font-size:12px;line-height:16px;padding:36px 40px 0px;text-align:center" align="center"><img style="outline:none;text-decoration:none" src="${ip}/static/mailLoginIcon.svg" alt="your branding here" width="50" class="CToWUd" data-bit="iit">
							<span style="display: block;color: #000;font-weight: 600;">© 2023&nbsp; your branding here</span> </td>
						   </tr>
						   <tr>
							  <td style="border-collapse:collapse;color:rgb(117,117,117);font-family:Roboto,arial;font-size:12px;line-height:16px;padding:10px 40px 20px;text-align:center" align="center">You have received this mandatory service announcement to update you about important changes/actions to your U-CMS account. <br>All Rights Reserved.</td>
						   </tr>
						</tbody>
					 </table>
				  </td>
			   </tr>
			</tbody>
		 </table>`,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error(error);
			} else {
				log('Email sent: ' + info.response);
			}
		});
		res.status(200).render("verifyotp", { email })

	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: error.message, error })
	}
}

exports.verifyOtp = async (req, res) => {
	try {
		log('verifying OTP');
		const { otp1, otp2, otp3, otp4, email } = req.body;
		const enteredOtp = otp1 + otp2 + otp3 + otp4;
		const user = await adminModel.findOne({ email: email });
		if (user && user.otp === enteredOtp) {
			user.otp = null;
			await user.save();
			const message = ""
			res.status(200).render("addNewPass", { email, message })
		} else {
			res.status(400).json({ success: false, message: 'Incorrect OTP' });
		}
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: error.message, error })
	}
}

exports.updatePassword = async (req, res) => {
	try {
		log("updating password...");
		const { email, password, confirmPassword } = req.body
		if (password !== confirmPassword) {
			const message = "password and confirm password don't match"
			return res.status(400).render("addNewPass", { message });
		}
		const user = await adminModel.findOne({ email: email })
		const hash = await bcrypt.hash(password, 10);
		user.password = hash
		await user.save();
		res.status(200).redirect("/api/v1/manage/auth/")
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: error.message, error });
	}
}

exports.updateUserProfile = async (req, res) => {
	try {
		log("updating user profile");
		const { decoded } = req.jwt;
		const haveImage = req.file?.filename;
		if (!haveImage) {
			// const user = await adminModel.findOneAndUpdate({email:decoded?.email})
			const user = await adminModel.findOneAndUpdate({ email: decoded?.email }, {
				$set: {
					"username": req.body?.username,
					"email": req.body?.email,
					"profileImage": req.body?.profileImage
				}
			}, { new: true });
			if (user) {
				req.flash("message", { success: true, message: "User information updated successfully" });
			} else {
				req.flash("message", { success: false, message: "Some error occurred" });
				log("some error occurred while updating user profile/");
			}
		} else {
			const user = await adminModel.findOneAndUpdate({ email: decoded?.email }, {
				$set: {
					"username": req.body?.username,
					"email": req.body?.email,
					"profileImage": req.file?.filename
				}
			}, { new: true });
			if (user) {
				req.flash("message", { success: true, message: "User information updated successfully" });
			} else {
				req.flash("message", { success: false, message: "Some error occurred" });
				log("some error occurred while updating user profile/");
			}
		}
		return res.redirect("/api/v1/manage/change-theme")
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: error.message, error })
	}
}


exports.handleUserRegister = async (req, res) => {
	try {
		log("registering new user");
		const { email, password, confirmPassword, firstName, lastName, phone, addressLineOne, addressLineTwo, state, city, pinCode, country } = req.body;
		const hash = await bcrypt.hash(password, 10);

		const match = await userModel.findOne({ email: email });
		if (match) throw new Error("User / Email has already been registered");

		const newUser = new userModel({
			username: firstName + ' ' + lastName,
			email,
			verificationOTP: 0,
			isVerified: false,
			status: "unverified",
			password: hash,
			firstName,
			lastName,
			phone,
			addressLineOne,
			addressLineTwo,
			state,
			city,
			pinCode,
			country,
			deliveryAddresses: [{
				addressName: "Default",
				addressType: "Default",
				addressLineOne,
				addressLineTwo,
				state,
				city,
				pinCode,
				country
			}]
		});
		await newUser.save();
		log("User saved successfully");
		res.status(200).json({ success: true, message: "user registered successfully" })
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: error.message, error })
	}
}

exports.sendVerificationEmail = async (req, res, next) => {
	try {
		log("sending verification email");
		const { email } = req.body;
		const match = await userModel.findOne({ email });
		if (match.status === 'verified' || match.isVerified) {
			throw new Error("user already verified")
		}
		const otp = generateOTP();
		await userModel.findOneAndUpdate({ email }, {
			verificationOTP: otp,
		});
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: `${process.env.SMTP_MAIL}`, // generated user
				pass: `${process.env.SMTP_MAIL_PSWD}`  // generated password
			}
		});
		const ip = "batterybackend.react.stagingwebsite.co.in" //change this when you change the ip address

		const mailOptions = {
			from: 'hrashikeshapandey@gmail.com',
			to: email,
			subject: 'Verify Your Email',
			html: `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;margin:0px auto;max-width:600px;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
			<tbody>
			   <tr>
				  <td style="border-collapse:collapse">

					 <table style="border-collapse:collapse;border-left:1px solid rgb(221,221,221);border-right:1px solid rgb(221,221,221);border-top:1px solid rgb(221,221,221);font-family:Arial,sans-serif;font-weight:normal;max-width:600px;width:100%;background-color:rgb(255,255,255)" border="0" width="100%" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
						<tbody>
						   <tr>
							  <td style="border-collapse:collapse">
								 <table style="background-color:#ff7637;max-width:600px;border-collapse:collapse;width:100%" border="0" width="600" cellspacing="0" cellpadding="0">
									<tbody>
									   <tr>
										  <td style="max-width:600px;border-collapse:collapse;font-size:16px;padding-right:40px" align="left" width="600">
											 <span>
												<table style="background-color:#ff7637;max-width:600px;border-collapse:collapse;width:100%" border="0" width="600" cellspacing="0" cellpadding="0">
												   <tbody>
													  <tr>
														 <td style="max-width:69px;padding-right:12px;padding-left:40px;border-collapse:collapse;padding-top:37px" align="left" width="69"><img style="outline:none;text-decoration:none" src="https://ci6.googleusercontent.com/proxy/c0ae1pHN2D5fZXqAEQywogYhm0u47xu3Ug_yWDvpIIefHp_hSpPLG9enPt24Wgyqx3GxsHnWStIKNZZIpUheM2h7vtHQx5guBqvJm7cEHDUO4urWvvDQnHzPiMnulfbB1Q=s0-d-e1-ft#http://services.google.com/fh/files/emails/hero_icon_project_reinstatement.png" alt="Notification" width="17" height="18" class="CToWUd" data-bit="iit"></td>
														 <td style="width:100%;max-width:531px;font-family:Roboto,arial;font-weight:500;font-size:14px;color:rgb(255,255,255);letter-spacing:0.6px;border-collapse:collapse;padding-top:33px" align="left" width="531">Password Reset Confirmation
														 </td>
													  </tr>
												   </tbody>
												</table>
											 </span>
											 <table style="background-color:#ff7637;max-width:600px;border-collapse:collapse;width:100%;font-family:Roboto,arial;font-weight:500;color:rgb(255,255,255);line-height:32px;font-size:24px" border="0" width="600" cellspacing="0" cellpadding="0">
												<tbody>
												   <tr>
													  <td style="width:100%;max-width:531px;border-collapse:collapse;font-family:Roboto,arial;font-weight:500;color:rgb(255,255,255);line-height:32px;font-size:24px;padding:13px 12px 24px 40px" align="left" width="531">&nbsp; Welcome to U-CMS</td>
												   </tr>
												</tbody>
											 </table>
										  </td>
									   </tr>
									</tbody>
								 </table>
								 <table style="max-width:600px;border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;width:100%" border="0" width="600" cellspacing="0" cellpadding="0">
									<tbody>
									   <tr>
										  <td style="width:100%;max-width:520px;padding-top:25px;padding-left:40px;padding-right:40px" width="520">
											 <table style="max-width:520px;border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;width:100%" border="0" width="520" cellspacing="0" cellpadding="0">
												<tbody>
												   <tr>
													  <td style="padding-bottom:16px;font-family:Roboto,arial;font-weight:normal;font-size:14px;color:rgb(69,90,100);line-height:24px">Hey there!</td>
												   </tr>
												   <tr>
													  <td style="padding-bottom:16px;font-family:Roboto,arial;font-size:14px;line-height:24px">
														 <p style="font-weight: bold;">OTP: ${otp}</p>
														 <p>To complete the password reset process, please use the following One-Time Password (OTP): ${otp}. Enter this code on the reset password page.<br>
															</p>

															<p style="font-weight: bold;">Didn't Request This?</p>

													  <p></p> If you didn't request a password reset, no worries! Your account is safe and secure. Feel free to ignore this email.
															
													  <p>
														<span style="font-weight: bold;"> Need Help?</span><br>

														If you encounter any issues or need further assistance, don't hesitate to reach out to our support team at .<br>
																															
														Once again, thanks for being a part of our HRMS community. We appreciate your trust and are here to help you every step of the way.<br>
																															
													   </p>                                                                            
														 <p style="color:rgb(69,90,100);font-weight:normal"><span style="color:rgb(52,152,219)">

													  </span></p></td>
												   </tr>
												</tbody>
											 </table>
										  </td>
									   </tr>
									</tbody>
								 </table>
								 <span>
									<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal" border="0" width="100%" cellspacing="0" cellpadding="0">
									   <tbody>
										  <tr>
											 <td style="border-bottom:1px solid rgb(221,221,221);border-collapse:collapse;padding-left:40px;width:100%;padding-right:22px" width="100%">
												<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal" border="0" cellspacing="0" cellpadding="0">
												   <tbody>
													  <tr>
														 <td style="border-collapse:collapse;color:rgb(69,90,100);font-family:Roboto,arial;font-size:14px;font-weight:normal;line-height:24px;padding-bottom:7px;padding-top:14px">Thanks,</td>
													  </tr>
													  <tr>
														 <td style="border-collapse:collapse;color:rgb(69,90,100);font-family:Roboto,arial;font-size:16px;font-weight:700;line-height:24px;padding-bottom:20px">U-CMS Team</td>
													  </tr>
												   </tbody>
												</table>
											 </td>
										  </tr>
									   </tbody>
									</table>
								 </span>
							  </td>
						   </tr>
						</tbody>
					 </table>
				  </td>
			   </tr>
			   <tr>
				  <td style="border-collapse:collapse;background-color:#000000d6">
					 <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;margin:0px auto;max-width:600px;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
						<tbody>
						   <tr>
							  <td style="border-collapse:collapse;color:#ffffffa6;font-family:Roboto,arial;font-size:12px;line-height:16px;padding:36px 40px 0px;text-align:center" align="center"><img style="outline:none;text-decoration:none" src="https://indorebattery.com/images/logo.png" alt="Indore Battery" width="50" class="CToWUd" data-bit="iit">
							<span style="display: block;color: #ffffffa6;font-weight: 600;">© 2023&nbsp; Indore Battery</span> </td>
						   </tr>
						   <tr>
							  <td style="border-collapse:collapse;color:#ffffffa6;font-family:Roboto,arial;font-size:12px;line-height:16px;padding:10px 40px 20px;text-align:center" align="center">You have received this mandatory service announcement to update you about important changes/actions to your U-CMS account. <br>All Rights Reserved.</td>
						   </tr>
						</tbody>
					 </table>
				  </td>
			   </tr>
			</tbody>
		 </table>`,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error(error);
			} else {
				log('Email sent: ' + info.response);
			}
		});
		res.status(200).json({ success: true, email: "verification email sent" })
	} catch (error) {
		log(error)
		if (error.message === 'user already verified') {
			next(new ValidationError(error.message, error))
		}
	}
}

exports.verifyEmail = async (req, res, next) => {
	try {
		log("verifying otp", req.body?.email, req.body?.otp, typeof req.body?.otp);
		const { email, otp } = req.body;
		const match = await userModel.findOne({ email });
		if (!match) throw new Error("NotFoundError");
		if (match.verificationOTP === parseInt(otp)) {
			await userModel.findOneAndUpdate({ email }, {
				verificationOTP: 1,
				isVerified: true,
				status: "verified"
			})
			res.status(200).json({ success: true, message: "email verified" })
		} else {
			res.status(400).json({ success: true, message: "otp is incorrect" })
		}
	} catch (error) {
		log(error);
		if (error.message === "NotFoundError") {
			next(new NotFoundError("user not found", error))
		}
	}
}

exports.passwordReset = async (req, res, next) => {
	try {
		const { email, password, confirmPassword, otp } = req.body;
		const user = await userModel.findOne({ email });
		if (!user) throw new Error("User not found");
		if (!password === confirmPassword) throw new Error("Passwords do not match");
		if (user.passwordResetOTP !== parseInt(otp)) {
			throw new Error("OTP Invalid. Please check the OTP you have entered");
		}
		const hash = await bcrypt.hash(password, 10);
		user.password = hash;
		user.passwordResetOTP = null;
		await user.save();
		res.status(200).json({ success: true, message: "Password has been reset" });
	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: 'server error' })
	}
}

exports.initiatePasswordReset = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await userModel.findOne({ email: email });
		if (!user) throw new Error("user not found")
		const otp = generateOTP();
		user.passwordResetOTP = otp;
		await user.save();
		console.log("req.jwt", req.jwt);
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: `${process.env.SMTP_MAIL}`, // generated user
				pass: `${process.env.SMTP_MAIL_PSWD}`  // generated password
			}
		});
		const ip = "batterybackend.react.stagingwebsite.co.in" //change this when you change the ip address

		const mailOptions = {
			from: 'hrashikeshapandey@gmail.com',
			to: email,
			subject: 'Password Reset OTP',
			html: `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;margin:0px auto;max-width:600px;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
			<tbody>
			   <tr>
				  <td style="border-collapse:collapse">
				
					 <table style="border-collapse:collapse;border-left:1px solid rgb(221,221,221);border-right:1px solid rgb(221,221,221);border-top:1px solid rgb(221,221,221);font-family:Arial,sans-serif;font-weight:normal;max-width:600px;width:100%;background-color:rgb(255,255,255)" border="0" width="100%" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
						<tbody>
						   <tr>
							  <td style="border-collapse:collapse">
								 <table style="background-color:#FF7637;max-width:600px;border-collapse:collapse;width:100%" border="0" width="600" cellspacing="0" cellpadding="0">
									<tbody>
									   <tr>
										  <td style="max-width:600px;border-collapse:collapse;font-size:16px;padding-right:40px" align="left" width="600">
											 <span>
												<table style="background-color:#FF7637;max-width:600px;border-collapse:collapse;width:100%" border="0" width="600" cellspacing="0" cellpadding="0">
												   <tbody>
													  <tr>
														 <td style="max-width:69px;padding-right:12px;padding-left:40px;border-collapse:collapse;padding-top:37px" align="left" width="69">
														 	<img style="outline:none;text-decoration:none" src="https://ci6.googleusercontent.com/proxy/c0ae1pHN2D5fZXqAEQywogYhm0u47xu3Ug_yWDvpIIefHp_hSpPLG9enPt24Wgyqx3GxsHnWStIKNZZIpUheM2h7vtHQx5guBqvJm7cEHDUO4urWvvDQnHzPiMnulfbB1Q=s0-d-e1-ft#http://services.google.com/fh/files/emails/hero_icon_project_reinstatement.png" alt="Notification" width="17" height="18" class="CToWUd" data-bit="iit"></td>
														 <td style="width:100%;max-width:531px;font-family:Roboto,arial;font-weight:500;font-size:14px;color:rgb(255,255,255);letter-spacing:0.6px;border-collapse:collapse;padding-top:33px" align="left" width="531">Password Reset Confirmation
														 </td>
													  </tr>
												   </tbody>
												</table>
											 </span>
											 <table style="background-color:#FF7637;max-width:600px;border-collapse:collapse;width:100%;font-family:Roboto,arial;font-weight:500;color:rgb(255,255,255);line-height:32px;font-size:24px" border="0" width="600" cellspacing="0" cellpadding="0">
												<tbody>
												   <tr>
													  <td style="width:100%;max-width:531px;border-collapse:collapse;font-family:Roboto,arial;font-weight:500;color:rgb(255,255,255);line-height:32px;font-size:24px;padding:13px 12px 24px 40px" align="left" width="531">&nbsp; Welcome to Indore Battery</td>
												   </tr>
												</tbody>
											 </table>
										  </td>
									   </tr>
									</tbody>
								 </table>
								 <table style="max-width:600px;border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;width:100%" border="0" width="600" cellspacing="0" cellpadding="0">
									<tbody>
									   <tr>
										  <td style="width:100%;max-width:520px;padding-top:25px;padding-left:40px;padding-right:40px" width="520">
											 <table style="max-width:520px;border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;width:100%" border="0" width="520" cellspacing="0" cellpadding="0">
												<tbody>
												   <tr>
													  <td style="padding-bottom:16px;font-family:Roboto,arial;font-weight:normal;font-size:14px;color:rgb(69,90,100);line-height:24px">Hey there!</td>
												   </tr>
												   <tr>
													  <td style="padding-bottom:16px;font-family:Roboto,arial;font-size:14px;line-height:24px">
														 <p style="font-weight: bold;">OTP: ${otp}</p>
														 <p>To complete the password reset process, please use the following One-Time Password (OTP): ${otp}. Enter this code on the reset password page.<br>
															</p>

															<p style="font-weight: bold;">Didn't Request This?</p>

													  <p></p> If you didn't request a password reset, no worries! Your account is safe and secure. Feel free to ignore this email.
															
													  <p>
														<span style="font-weight: bold;"> Need Help?</span><br>

														If you encounter any issues or need further assistance, don't hesitate to reach out to our support team at .<br>
																															
														Once again, thanks for being a part of our HRMS community. We appreciate your trust and are here to help you every step of the way.<br>
																															
													   </p>                                                                            
														 <p style="color:rgb(69,90,100);font-weight:normal"><span style="color:rgb(52,152,219)">

													  </span></p></td>
												   </tr>
												</tbody>
											 </table>
										  </td>
									   </tr>
									</tbody>
								 </table>
								 <span>
									<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal" border="0" width="100%" cellspacing="0" cellpadding="0">
									   <tbody>
										  <tr>
											 <td style="border-bottom:1px solid rgb(221,221,221);border-collapse:collapse;padding-left:40px;width:100%;padding-right:22px" width="100%">
												<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal" border="0" cellspacing="0" cellpadding="0">
												   <tbody>
													  <tr>
														 <td style="border-collapse:collapse;color:rgb(69,90,100);font-family:Roboto,arial;font-size:14px;font-weight:normal;line-height:24px;padding-bottom:7px;padding-top:14px">Thanks,</td>
													  </tr>
													  <tr>
														 <td style="border-collapse:collapse;color:rgb(69,90,100);font-family:Roboto,arial;font-size:16px;font-weight:700;line-height:24px;padding-bottom:20px">Indore Battery Team</td>
													  </tr>
												   </tbody>
												</table>
											 </td>
										  </tr>
									   </tbody>
									</table>
								 </span>
							  </td>
						   </tr>
						</tbody>
					 </table>
				  </td>
			   </tr>
			   <tr>
				  <td style="border-collapse:collapse">
					 <table style="border-collapse: collapse;
    							font-family: Arial,sans-serif;
    							font-weight: normal;
    							margin: 0px auto;
    							max-width: 600px;
    							border: 1px solid rgba(0,0,0,0.25);
    							width: 100%;
    							border-top: 0;
    							background-color: #000000d6;" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
						<tbody>
						   <tr>
							  <td style="border-collapse:collapse;color:#ffffffa6;font-family:Roboto,arial;font-size:12px;line-height:16px;padding:36px 40px 0px;text-align:center" align="center"><img style="outline:none;text-decoration:none"  src="https://indorebattery.com/images/logo.png" alt="your branding here" width="50" class="CToWUd" data-bit="iit">
							<span style="display: block;color: #ffffffa6;font-weight: 600;">© 2023&nbsp;Indore Battery</span> </td>
						   </tr>
						   <tr>
							  <td style="border-collapse:collapse;color:#ffffffa6;font-family:Roboto,arial;font-size:12px;line-height:16px;padding:10px 40px 20px;text-align:center" align="center">You have received this mandatory service announcement to update you about important changes/actions to your Indore Battery account. <br>All Rights Reserved.</td>
						   </tr>
						</tbody>
					 </table>
				  </td>
			   </tr>
			</tbody>
		 </table>`,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error(error);
			} else {
				log('Email sent: ' + info.response);
			}
		});
		res.status(200).json({ success: true, message: "OTP sent to your email" })
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'server error' });
	}
}

exports.handleUserLogin = async (req, res) => {
	try {
		log("user logging in");
		const { email, password } = req.body;
		log(req.body)
		const match = await userModel.findOne({ email });
		if (!match) {
			return res.status(400).json({ success: false, message: "user not found" })
		}
		if (match.status === 'unverified' || !match.isVerified) {
			return res.status(403).json({ success: false, message: "please verify your email" })
		}
		if (await bcrypt.compare(password, match.password)) {
			const access_token = jwt.sign({ email }, process.env.USER_ACCESS_TOKEN_SECRET);
			const user = await userModel.findOneAndUpdate({ email }, {
				access_token,
			})
			// req.session.access_token = access_token;
			// log("loggin user in", req.session)
			res.status(200).json({ success: true, message: 'logged in', userData: { email: user?.email, userName: user?.firstName, isLoggedIn: true, access_token } })
		} else {
			res.status(401).json({ success: false, message: "email or password is incorrect" })
		}
	} catch (error) {
		req.flash("login-message", { success: false, message: error.message });
		res.status(400).json({ success: false, error: error.message });
	}
}

exports.handleLoginCheck = async (req, res) => {
	try {
		log("user login check");
		const auth = req.headers.authorization || req.headers.Authorization;
		console.log('inside verify JWT : ');
		if (!auth.startsWith('Bearer ')) {
			res.status(403).json({ success: false, message: 'INVALID JWT TOKEN' })
		}
		const access_token = auth.split(" ")[1];
		if (!access_token) {
			log("access token not found")
			return res.status(200).json({ success: false })
		}
		const decoded = jwt.verify(access_token, process.env.USER_ACCESS_TOKEN_SECRET);
		if (!decoded) {
			log("decoded data not found");
			res.status(200).json({ success: false })
		}
		const match = await userModel.findOne({ email: decoded.email });
		if (match && access_token === match.access_token) {
			res.status(200).json({ success: true, userData: { email: match?.email, userName: match?.firstName, isLoggedIn: true } })
		} else {
			log("Inside verify user else condition");
			log(access_token, match?.access_token);
			res.status(200).json({ success: false })
		}
	} catch (error) {
		log(error)
		res.status(200).json({ success: false })
	}
}

exports.handleUserLogout = async (req, res) => {
	try {
		console.log("Trying to log out")
		const match = await userModel.findOne({email:req.jwt?.decoded?.email});
		match.access_token = '';
		await match.save();

		return res.status(200).json({ success: true });
	} catch (error) {
		log(error);
		res.status(200).success({ success: true })
	}
}
