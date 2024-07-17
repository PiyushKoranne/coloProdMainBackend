const adminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");
const { log } = require("../utils/utilFunctions");


exports.verifyLogin = async (req, res, next) => {
	try {
		const { access_token } = req.session;
		if (!access_token) return res.redirect("/api/v1/manage/auth/")
		const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
		if (!decoded) return res.redirect("/api/v1/manage/auth")
		const match = await adminModel.findOne({ email: decoded.email });
		if (match && access_token === match.access_token) {
			req.jwt = { decoded }
			next();
		} else {
			res.redirect("/api/v1/manage/auth")
		}
	} catch (error) {
		log("ERROR IN LOGIN VERIFICATION::", error.message);
		log(error);
		res.status(400).json({ success: false, error });
	}
}

exports.verifyUserLogin = async (req, res, next) => {
	try {
		const auth = req.headers.authorization || req.headers.Authorization;
		console.log('inside verify JWT : ');
		if (!auth.startsWith('Bearer ')) {
			res.status(403).json({ success: false, message: 'INVALID JWT TOKEN' })
		}
		const access_token = auth.split(" ")[1];
		if (!access_token) {
			log("access token not found")
			throw { status: 400 }
		}
		const decoded = jwt.verify(access_token, process.env.USER_ACCESS_TOKEN_SECRET);
		if (!decoded) {
			log("decoded data not found");
			throw { status: 400 }
		}
		const match = await userModel.findOne({ email: decoded.email });
		if (match && access_token === match.access_token) {
			req.jwt = { decoded }
			next();
		} else {
			log("Inside verify user else condition");
			throw { status: 400 }
		}
	} catch (error) {
		log(error);
		if (error.status === 400) {
			res.status(error.status).json({ success: false, message: "invalid token" });
		} else {
			res.status(500).json({ success: false, error, message: 'server error' });
		}
	}
}

exports.verifyAdmin = async (req, res, next) => {
	try {
		const { access_token } = req.session;
		if (!access_token) return res.redirect("/api/v1/manage/auth/")
		const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
		if (!decoded) return res.redirect("/api/v1/manage/auth/")
		const match = await adminModel.findOne({ email: decoded.email });
		if (match && match.roles.indexOf("admin") !== -1) {
			req.jwt = { decoded }
			next();
		} else {
			res.redirect("/api/v1/manage/auth")
		}
	} catch (error) {
		log(error);
		res.status(400).json({ success: false, error });
	}
}
