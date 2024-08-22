const mongoose = require("mongoose");

const CustomizationSchema = new mongoose.Schema({
	protalProviderWelcomeMessage: String,
	paperProviderWelcomeMessage: String,
	portalWelcomePDF: String,
	portalWelcomePDFName: String,
	paperWelcomePDF: String,
	paperWelcomePDFName: String,
	notEligiblePDF: String,
	notEligiblePDFName: String
})

const customizationModel = mongoose.model("Customization", CustomizationSchema);

module.exports = customizationModel;
