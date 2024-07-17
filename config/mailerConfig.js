const nodemailer = require("nodemailer");
const {log} = require("../utils/utilFunctions")

let mailTransporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: `${process.env.SMTP_MAIL}`, // generated user
		pass: `${process.env.SMTP_MAIL_PSWD}`  // generated password
	}
});


function sendMail(to, html, subject){
	let mailDetails = {
		from: `${process.env.SMTP_MAIL}`,
		to: to,
		subject: subject,
		html:html || ``
	}
	const result = mailTransporter.sendMail(mailDetails, (err, data)=>{
		if(err) {
			console.log('Failed To Send Email\n',err);
			return false;
		}
		else {
			log('Email Sent!')
			return true;
		}
	});

	return result;
}

module.exports = {sendMail};