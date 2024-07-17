const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
	categoryName:String,
	categorySlug:String,
	parentCategory:String,
	categoryDescription:String
})

const categoryModel = mongoose.model("category", CategorySchema);

module.exports = {categoryModel, CategorySchema};