const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL;

async function Connectdb() {
	try {
		console.log("Trying to connect to database", MONGODB_URL);
		await mongoose.connect(MONGODB_URL)
	} catch (error) {
		console.log("Failed to connect to the database\n ------ERROR------\n", error)
	}
       
}

module.exports = { Connectdb };
