const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema({
	providerType: {
		type: String,
		enum:['portal','paper']
	},
	firstName: String,
	mi: String,
	lastName: String,
	dob: Date,
	email: String,
	phone: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: String,
	npi: String,
	lisProviderId: String,
	resultContactEmail: String,
	orderCount: Number,
	joined: Date,
	password: String,
	accessToken: String,
	profileImage: String,
	status: {
		type:String,
		enum:['ACTIVE','DORMANT','UNVERIFIED'],
		default:'UNVERIFIED'
	}
})

const providerModel = mongoose.model("Provider", ProviderSchema);

module.exports = providerModel;

