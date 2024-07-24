const pageModel = require('../models/pageModel');
const postModel = require('../models/postModel');
const dataModel = require('../models/dataModel');
const postTypeModel = require("../models/postTypeModel");
const { categoryModel } = require('../models/categoryModel');
const { v4: uuidv4 } = require('uuid');
const { getLastTwelveMonths, getTrimmedObject } = require("../utils/utilFunctions");
const adminModel = require('../models/adminModel');
const ITEMS_PER_PAGE = 25;
const Quotation = require("../models/quotationModel")
const { reviewModel } = require("../models/reviewModel")
const requestCallBackModel = require("../models/callbackModel")
const { couponModel } = require("../models/couponModel")
const { indianStatesAndCities } = require("../utils/constants");
const { orderModel } = require('../models/userModel');
const { log } = require("../utils/utilFunctions");
const { default: axios } = require('axios');
const providerModel = require('../models/providerModel');
const bcrypt = require("bcrypt");
const testOrdersModel = require('../models/testOrderModel');
const paymentModel = require("../models/paymentModel")
const fsPromise = require('fs').promises;
const path = require("path");
const XLSX = require('xlsx');

function fillOrderDetails(orderData, filePath) {
  const workbook = XLSX.readFile(filePath);

  // Get the first worksheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Find the next empty row in the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  let nextRow = range.e.r + 1;

  for (let R = range.s.r; R <= range.e.r; R++) {
    let empty = true;
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (worksheet[cell_ref]) {
        empty = false;
        break;
      }
    }
    if (empty) {
      nextRow = R;
      break;
    }
  }

  // Mapping of backend data to Excel columns
  const columnMapping = {
    'orderId': ['A'],
    'status': ['B'], // set
    'orderDate': ['C'], // set
    'firstName': ['E', 'O'],
    'lastName': ['F', 'P'],
    'streetAddress': ['H', 'Q'],
    'city': ['I','R'],
    'state': ['J','S'],
    'zip': ['K','T'],
    'countryCode': ['L','U'], // set
    'email': ['M'],
    'phone': ['N'],
    'dob': ['AB'],
    'gender': ['AD'],
    'race': ['AE'],
    'ethnicity': ['AF'],
    'paymentMethod': ['AN'], // set
    'productItemNumber': ['AQ'], // set
    'productItemName': ['AR'], // set
    'productPrice': ['AT','AW', 'AY']
  };


   // Fill the worksheet with order data
  Object.keys(orderData).forEach((key) => {
    if (columnMapping[key]) {
      columnMapping[key].forEach((column) => {
        const cellAddress = column + (nextRow + 1); // Adjust for 0-based index
        worksheet[cellAddress] = { v: orderData[key], t: 's' }; // Assuming all data is string
      });
    }
  });

  // Update the worksheet range
  worksheet['!ref'] = XLSX.utils.encode_range(range.s, { c: range.e.c, r: nextRow });


  // Write the updated workbook to a new file or overwrite the existing file
  XLSX.writeFile(workbook, filePath);
  console.log("Row added to Excel Sheet");
}



exports.renderAddProject = async (req, res) => {
	const { decoded } = req.jwt;
	const userData = await adminModel.findOne({ email: decoded?.email }).select("email username websiteName websiteUrl roles");
	res.render("addproject", {
		userData
	})
}


exports.addProject = async (req, res) => {
	try {
		const { decoded } = req.jwt;
		log(req.file);
		log(req.body);
		const user = await adminModel.findOneAndUpdate({ email: decoded?.email }, {
			$set: {
				'websiteUrl': req.body?.websiteUrl || "",
				'websiteName': req.body?.websiteName || "",
				'websiteLogo': req.file?.filename || "",
			}
		}, { new: true });
		req.flash("message", { success: true, message: "Website details updated" });
		res.redirect("/api/v1/manage/all-pages");
	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: "Server error", error: error });
	}
}

exports.confineCart = async (req, res) => {
	try {
		res.status(200).json({ success: true, message: "unimplemented" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: 'server error' });
	}
}


exports.submitReview = async (req, res) => {
	try {
		const { email, fullName, message } = req.body;
		// yet to be implemented
		res.status(200).json({ success: true });
	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: "Server error", error: error });
	}
}


exports.getPostTypesAndLinks = async (req, res) => {
	try {
		const postTypes = await postTypeModel.find({ pin: true });
		return res.status(200).json({ success: true, data: postTypes });
	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: "Server error", error: error });
	}
}


exports.renderAllPostTypes = async (req, res) => {
	try {
		log("rendering all post-types");
		const allPostTypes = await postTypeModel.find({});
		res.render("allposttypes", {
			allPostTypes
		});
	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: "Server error", error: error });
	}
}

exports.renderAllPostTypes = async (req, res) => {
	try {
		log("rendering all post-types");
		const allPostTypes = await postTypeModel.find({});
		res.render("allposttypes", {
			allPostTypes
		});
	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: "Server error", error: error });
	}
}

exports.linkPostType = async (req, res) => {
	try {
		log("linking post-types...");
		const { linkPostTypeName, linkPostTypeId, linkModelId } = req.body;
		const postType = await postTypeModel.findOne({ _id: linkPostTypeId, postTypeName: linkPostTypeName });
		if (postType) {
			const model = await dataModel.findOne({ _id: linkModelId });
			postType.customField.push(model?.modelName);
			postType.customFieldId.push(model?._id);
			await postType.save();
			log("post-type linked to model");
			res.redirect(`/api/v1/manage/rendermodel?modelname=${encodeURIComponent(model?._id)}`);
		} else {
			res.status(400).json({ success: false, message: "post type not found" });
		}
	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: "Server error", error: error });
	}
}

exports.unlinkPostType = async (req, res) => {
	try {
		log("unlinking post-types");
		const { postTypeId, postTypeName, modelId } = req.body;
		const postType = await postTypeModel.findOne({ _id: postTypeId, postTypeName: postTypeName });
		if (postType) {
			const model = await dataModel.findOne({ _id: modelId });
			postType.customField = postType.customField.filter(item => item !== model?.modelName);
			postType.customFieldId = postType.customFieldId.filter(item => !item.equals(model?._id));
			await postType.save();
			const affectedPosts = await postModel.find({ postType: postType?._id });
			for (const affectedPost of affectedPosts) {
				affectedPost.customField = affectedPost.customField.filter(item => item !== model?.modelName);
				await affectedPost.save();
			}
			log("post-type unlinked from custom field");
			res.status(200).json({ succes: true });
		} else {
			res.status(400).json({ success: false, message: "post type not found" });
		}
	} catch (error) {
		log("Error: While unlinking post-type.", error);
		res.status(500).json({ success: true, message: "Server error", error: error });
	}
}

exports.pinPostType = async (req, res) => {
	try {
		log("pinning post-types...");
		const { postTypeName, postTypeId, pin } = req.body;
		const postType = await postTypeModel.findOne({ _id: postTypeId, postTypeName });
		if (postType) {
			postType.pin = pin;
			await postType.save();
			log("post-type pinned");
			res.status(200).json({ success: true, message: "post-type pinned." })
		}
	} catch (error) {
		log("Error: While pinning post-type.", error);
		res.status(500).json({ success: true, message: "Server error", error: error })
	}
}

exports.pinCustomField = async (req, res) => {
	try {
		log("pinning custom fields...");
		const { modelName, modelId, pin } = req.body;
		const model = await dataModel.findOne({ _id: modelId, modelName });
		if (model) {
			model.pin = pin;
			await model.save();
			log("custom field pinned");
			res.status(200).json({ success: true, message: "post-type pinned." });
		}
	} catch (error) {
		log("Error: While pinning custom field.", error);
		res.status(500).json({ success: true, message: "Server error", error: error });
	}
}

exports.createPost = async (req, res) => {
	try {
		log("creating post...");
		const { postTypeId, postName } = req.body;
		const postType = await postTypeModel.findOne({ _id: postTypeId });
		const postMatch = await postModel.findOne({ postName });
		if (postMatch) {
			req.flash('message', { success: false, message: 'post with same name already exists for this post-type' });
			return res.status(400).json({ success: false, message: 'post with same name already exists for this post-type' });
		}
		const newPost = new postModel({
			postType: postType?._id,
			postName,
			customField: postType?.customField || undefined
		});
		postType.postCount += 1;
		await postType.save();
		await newPost.save();
		log("post created");
		req.flash("message", { success: true, message: "Post created successfully" })
		res.status(200).json({ success: true, message: "post created" });
	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: "Server error", error: error });
	}
}

exports.allPages = async (req, res) => {
	try {
		let numberOfPages;
		let finalPages;
		let thisPage;
		const { currentpage, paginationtype, searchquery, filterdate, filtercategory } = req.query;
		if (currentpage) thisPage = parseInt(currentpage) - 1;
		else thisPage = 0;
		const allPages = await pageModel.find({});
		numberOfPages = Math.ceil(allPages?.length / ITEMS_PER_PAGE);
		finalPages = allPages.slice(0, ITEMS_PER_PAGE);

		if (paginationtype && paginationtype === 'default') {
			finalPages = allPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
		}
		else if (paginationtype && paginationtype === 'search') {
			const search = new RegExp(searchquery, 'i');
			const filteredPages = await pageModel.find({ name: search });
			numberOfPages = Math.ceil(filteredPages?.length / ITEMS_PER_PAGE);
			finalPages = filteredPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE)
		}
		else if (paginationtype && paginationtype === 'filtered') {
			if (filterdate == "All Dates") {
				if (filtercategory == "All Categories") {
					log('filtering all dates and all categories')
					let totalPages = await pageModel.find({});
					numberOfPages = Math.ceil(totalPages?.length / ITEMS_PER_PAGE);
					finalPages = totalPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
				} else {
					let totalPages = await pageModel.find({ author: filtercategory });
					numberOfPages = Math.ceil(totalPages?.length / ITEMS_PER_PAGE);
					finalPages = totalPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
				}
			}
			else {
				const startDate = new Date(`${filterdate}-01T00:00:00Z`);
				const endDate = new Date(`${filterdate}-31T23:59:59Z`);
				log('filtering for an interval');
				if (filtercategory == "All Categories") {
					let totalPages = await pageModel.find({
						createdAt: { $gte: startDate, $lte: endDate }
					});
					numberOfPages = Math.ceil(totalPages?.length / ITEMS_PER_PAGE);
					finalPages = totalPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
				} else {
					let totalPages = await pageModel.find({
						author: filtercategory,
						createdAt: { $gte: startDate, $lte: endDate }
					});
					numberOfPages = Math.ceil(totalPages?.length / ITEMS_PER_PAGE);
					finalPages = totalPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
				}
			}
		}

		const published = allPages.filter(page => page.status === 'published');
		const hidden = allPages.filter(page => page.visibility === 'hidden');
		const authors = [...new Set(allPages.map(page => page.author))];
		const dates = getLastTwelveMonths();
		log("rendering all pages...");
		res.render("all", {
			allPages: finalPages || allPages,
			message: req.flash("message"),
			published,
			hidden,
			authors,
			dates,
			paginationtype: paginationtype || 'default',
			searchquery: searchquery || "",
			currentpage: currentpage || 1,
			numberOfPages,
			filterdate: filterdate || '',
			filtercategory: filtercategory || ''
		})
	} catch (error) {
		console.error('Error fetching pages:', error);
		res.status(500).send('Internal Server Error');
	}
}

exports.showPublishedPages = async (req, res) => {
	try {
		log("showing all published pages");
		const { currentpage, paginationtype, searchquery, filterdate, filtercategory } = req.query;
		const allPages = await pageModel.find({});
		const published = allPages.filter(page => page.status === 'published');
		const hidden = allPages.filter(page => page.visibility === 'hidden');
		const authors = [...new Set(allPages.map(page => page.author))];
		const dates = getLastTwelveMonths();
		let numberOfPages = Math.ceil(published?.length / ITEMS_PER_PAGE);
		log("rendering all published pages");
		res.render("all", {
			allPages: published,
			message: req.flash("message"),
			published,
			hidden,
			authors,
			dates,
			paginationtype: paginationtype || 'default',
			searchquery: searchquery || "",
			currentpage: currentpage || 1,
			numberOfPages,
			filterdate: filterdate || '',
			filtercategory: filtercategory || ''
		})
	} catch (error) {
		console.error('Error fetching pages:', error);
		res.status(500).send('Internal Server Error');
	}
}

exports.showHiddenPages = async (req, res) => {
	try {
		log("rendering all pages");
		const { currentpage, paginationtype, searchquery, filterdate, filtercategory } = req.query;
		const allPages = await pageModel.find({});
		const published = allPages.filter(page => page.status === 'published');
		const hidden = allPages.filter(page => page.visibility === 'hidden');
		const authors = [...new Set(allPages.map(page => page.author))];
		const dates = getLastTwelveMonths();
		let numberOfPages = Math.ceil(hidden?.length / ITEMS_PER_PAGE);
		log("rendering all hidden pages")
		res.render("all", {
			allPages: hidden,
			message: req.flash("message"),
			published,
			hidden,
			authors,
			dates,
			paginationtype: paginationtype || 'default',
			searchquery: searchquery || "",
			currentpage: currentpage || 1,
			numberOfPages,
			filterdate: filterdate || '',
			filtercategory: filtercategory || ''
		})
	} catch (error) {
		console.error('Error fetching pages:', error);
		res.status(500).send('Internal Server Error');
	}
}

exports.addNewPage = async (req, res) => {
	try {
		log("adding a new page");
		res.redirect("/api/v1/manage/all-pages?addnewmodal=true");
	} catch (error) {
		console.error('Error fetching pages:', error);
		res.status(500).send('Internal Server Error');
	}
}

exports.saveFields = async (req, res) => {
	try {
		log('saving fields data...');
		const { pageName, data } = req.body;
		const page = await pageModel.findOne({ name: pageName });
		if (!page) {
			return res.status(404).json({ message: 'Page not found' });
		}
		page.data = data;
		await page.save();
		log("page fields data saved successfully");
		res.status(200).json({ message: 'Fields saved successfully' });
	} catch (error) {
		console.error('Error saving fields:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

exports.checkNameAttr = async (req, res) => {
	try {
		log("running name check. checking uniqueness of the name attribute...");
		const { ejsPageName, elementAttrName, sectionName } = req.body;
		let flag = true;
		const pageMatch = await pageModel.findOne({ name: ejsPageName });
		for (let section of pageMatch.sections) {
			if (section?.sectionName === sectionName) {
				for (let content of section?.sectionContent) {
					if (content.elementAttrName === elementAttrName) {
						flag = false;
					}
				}
			}
		}
		
		if (flag) {
			log("Checking for duplicate name attributes in page section - Duplicate Found: ", !flag);
			res.status(200).json({ success: true, message: "check success" });
		} else {
			log("Error. Found element in the section which already have the same name attribute");
			res.status(400).json({ success: false, message: "Element with the same name attribute already exists" });
		}
	} catch (error) {
		console.error('Error saving fields:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}


exports.allPosts = async (req, res) => {
	try {
		log("rendering all posts...");
		const { currentpage, paginationtype, searchquery, filterdate, filtercategory } = req.query;
		let numberOfPages;
		let thisPage;
		if (currentpage) thisPage = parseInt(currentpage) - 1;
		else thisPage = 0;
		let filteringByModel = undefined;
		if (req.query?.filterbymodel) {
			filteringByModel = req.query?.filterbymodel;
		}
		const allPostsData = filteringByModel ? await postModel.find({ modelName: filteringByModel }) : await postModel.find({});
		numberOfPages = Math.ceil(allPostsData?.length / ITEMS_PER_PAGE);
		let finalPosts = allPostsData.slice(0, ITEMS_PER_PAGE);

		if (paginationtype && paginationtype === 'default') {
			log("rendering default page view for all posts");
			finalPosts = allPostsData.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
			numberOfPages = Math.ceil(allPostsData?.length / ITEMS_PER_PAGE);
		} else if (paginationtype && paginationtype === 'search') {

		} else if (paginationtype && paginationtype === 'filtered') {

		}

		const allModels = await dataModel.find({});
		const allCategories = await categoryModel.find();
		// const allTags = // some logic here
		const sanitizedModelData = allModels.map(item => ({
			modelName: item.modelName
		}))
		log("rendering all posts, by default pagination");
		res.render("allposts", {
			allPosts: finalPosts || allPostsData,
			allModels: sanitizedModelData,
			allCategories,
			numberOfPages,
			paginationtype: paginationtype || 'default',
			searchquery: searchquery || '',
			filterdate: filterdate || '',
			filtercategory: filtercategory || '',
			message: req.flash('message')
		});
	} catch (error) {
		log("Error:")
		log("error rendering posts", error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.renderAddPostType = async (req, res) => {
	try {
		log("rendering add new post-type page...");
		const allModels = await dataModel.find({});
		if (!allModels) return res.status(400).json({ success: false, message: "Database error. Please try again later." })
		res.render("addNewPostType", { allModels })
	} catch (error) {
		log("Error: While Rendering Add Post-Type Page", error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.deletePost = async (req, res) => {
	try {
		const { postName, postId } = req.body;
		const match = await postModel.findOneAndDelete({ _id: postId });
		if (match) {
			const postType = await postTypeModel.findOne({ _id: match?.postType });
			allPosts = await postModel.find({ postType: postType?._id }).countDocuments();
			postType.postCount = allPosts;
			await postType.save();
			req.flash('message', { success: true, message: "post deleted" })
			res.status(200).json({ success: true, message: "post deleted" })
		}
	} catch (error) {
		log(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.addNewPostType = async (req, res) => {
	try {
		log("adding a new post-type");
		const { postTypeName, postTypeSlug } = req.body;
		const newPostType = new postTypeModel({
			postTypeName: postTypeName,
			postTypeSlug: postTypeSlug,
		});
		await newPostType.save();
		log("new post-type added");
		res.redirect("/api/v1/manage/render-all-post-types");
	} catch (error) {
		log("Error: While adding new Post-Type", error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.getPosts = async (req, res) => {
	const posts = await postModel.find({ postType: req.params.posttypeid }).select("postName");
	res.status(200).json({ success: true, posts })
}

exports.showPosts = async (req, res) => {
	try {
		log('rendering post');
		const { currentpage, paginationtype, searchquery, filterdate, filtercategory, published, hidden } = req.query;
		let numberOfPages;
		let thisPage;
		if (currentpage) thisPage = parseInt(currentpage) - 1;
		else thisPage = 0;
		const dates = getLastTwelveMonths();
		const posts = await postModel.find({ postType: req.params.posttypeid });
		const postType = await postTypeModel.findOne({ _id: req.params.posttypeid });
		const allModels = await dataModel.find({});
		const allCategories = await categoryModel.find();

		numberOfPages = Math.ceil(posts?.length / ITEMS_PER_PAGE);
		let finalPosts = posts.slice(0, ITEMS_PER_PAGE);

		if (paginationtype && paginationtype === 'default') {
			log("default pagination condition")
			finalPosts = posts.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
			numberOfPages = Math.ceil(posts?.length / ITEMS_PER_PAGE);
		} else if (paginationtype && paginationtype === 'search') {
			log("search type pagination");
			const searchRegexp = new RegExp(searchquery, 'i');
			const allPosts = await postModel.find({ postType: req.params.posttypeid, postName: searchRegexp });
			finalPosts = allPosts.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
			numberOfPages = Math.ceil(allPosts?.length / ITEMS_PER_PAGE);
		} else if (paginationtype && paginationtype === 'filtered') {
			log('filtered pagination condition')
			let posts;
			if (filterdate == "All Dates") {
				log("filtering all dates...");
				if (filtercategory == "All Categories") {
					posts = await postModel.find({ postType: req.params.posttypeid });
					finalPosts = posts?.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE)
				} else {
					posts = await postModel.find({
						postType: req.params.posttypeid,
						category: {
							$elemMatch: { _id: filtercategory }
						}
					});
					finalPosts = posts?.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE)
				}
			} else {
				const startDate = new Date(`${filterdate}-01T00:00:00Z`);
				const endDate = new Date(`${filterdate}-31T23:59:59Z`);
				let year = new Date().getFullYear();

				if (filtercategory == "All Categories") {
					log("filtering all categories...");
					posts = await postModel.find({
						postType: req.params.posttypeid,
						createdAt: { $gte: startDate, $lte: endDate }
					});
					finalPosts = posts?.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE)
				} else {
					log('filtering by category')
					posts = await postModel.find({
						postType: req.params.posttypeid,
						category: {
							$elemMatch: { _id: filtercategory }
						},
						createdAt: { $gte: startDate, $lte: endDate }
					});
					console.log("Element matched!!")
					finalPosts = posts?.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE)
				}
			}
			numberOfPages = Math.ceil(posts?.length / ITEMS_PER_PAGE);
		}
		log("pagination updated, rendering all posts...");
		res.render("allposts", {
			allPosts: published === 'true' ? finalPosts.filter(item => item?.status === 'published') : hidden === 'true' ? finalPosts.filter(item => item.visibility === 'hidden') : finalPosts,
			published: finalPosts.filter(item => item?.status === 'published'),
			drafts: finalPosts.filter(item => item?.status === 'draft'),
			hidden: finalPosts.filter(item => item?.visibility === 'hidden'),
			allModels,
			postTypeName: postType.postTypeName,
			postTypeId: req.params.posttypeid,
			dates,
			allCategories,
			currentpage: currentpage || 1,
			paginationtype: paginationtype || 'default',
			searchquery: searchquery || '',
			filterdate: filterdate,
			filtercategory: filtercategory,
			numberOfPages,
			message: req.flash('message'),
		})
	} catch (error) {
		log("Error: While rendering all posts", error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.searchPosts = async (req, res) => {
	try {
		log('searching posts...');
		const { searchName } = req.body;
		const dates = getLastTwelveMonths();
		const searchRegexp = new RegExp(searchName, 'i');
		const posts = await postModel.find({ postType: req.params.posttypeid, postName: searchRegexp });
		let numberOfPages = Math.ceil(posts?.length / ITEMS_PER_PAGE);
		const allPosts = await postModel.find({ postType: req.params.posttypeid });
		const postType = await postTypeModel.findOne({ _id: req.params.posttypeid });
		const allModels = await dataModel.find({});
		const allCategories = await categoryModel.find();
		if (!postType) return res.status(400).json({ success: false, message: 'Database Error: post-type not found' });
		log("Search results found, rendering all posts");
		res.render("allposts", {
			allPosts: posts?.slice(0, ITEMS_PER_PAGE),
			published: allPosts.filter(item => item?.status === 'published'),
			drafts: allPosts.filter(item => item?.status === 'draft'),
			hidden: allPosts.filter(item => item?.visibility === 'hidden'),
			allModels,
			postTypeName: postType.postTypeName,
			postTypeId: req.params.posttypeid,
			dates,
			allCategories,
			currentpage: 1,
			paginationtype: 'search',
			searchquery: searchName,
			filterdate: '',
			filtercategory: '',
			numberOfPages,
			message: req.flash('message'),
		})
	} catch (error) {
		log("Error: While searching for posts:", error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.filterPosts = async (req, res) => {
	try {
		let posts;
		const { filterCategory, filterDate } = req.body;
		log('filtering posts\n', req.body);
		if (filterDate == "All Dates") {
			if (filterCategory == "All Categories") {
				posts = await postModel.find({ postType: req.params.posttypeid });
			} else {
				posts = await postModel.find({
					postType: req.params.posttypeid,
					category: {
						$elemMatch: { _id: filterCategory }
					}
				});
			}
		} else {
			const startDate = new Date(`${filterDate}-01T00:00:00Z`);
			const endDate = new Date(`${filterDate}-31T23:59:59Z`);
			let year = new Date().getFullYear();

			if (filterCategory == "All Categories") {
				posts = await postModel.find({
					postType: req.params.posttypeid,
					createdAt: { $gte: startDate, $lte: endDate }
				});
			} else {
				posts = await postModel.find({
					postType: req.params.posttypeid,
					category: {
						$elemMatch: { _id: filterCategory }
					},
					createdAt: { $gte: startDate, $lte: endDate }
				});
			}
		}

		let numberOfPages = Math.ceil(posts?.length / ITEMS_PER_PAGE);
		const allPosts = await postModel.find({ postType: req.params.posttypeid });
		const postType = await postTypeModel.findOne({ _id: req.params.posttypeid });
		const allModels = await dataModel.find({});
		const allCategories = await categoryModel.find();
		const dates = getLastTwelveMonths();
		if (!postType) return res.status(400).json({ success: false, message: "Database Error: post-type was not found" });
		  
		log(' Rendering all filtered posts');
		res.render("allposts", {
			allPosts: posts.slice(0, ITEMS_PER_PAGE),
			published: allPosts.filter(item => item?.status === 'published'),
			drafts: allPosts.filter(item => item?.status === 'draft'),
			hidden: allPosts.filter(item => item?.visibility === 'hidden'),
			allModels,
			postTypeName: postType.postTypeName,
			postTypeId: req.params.posttypeid,
			dates,
			allCategories,
			currentpage: 1,
			paginationtype: 'filtered',
			searchquery: '',
			filterdate: filterDate,
			filtercategory: filterCategory,
			numberOfPages,
			message: req.flash('message')
		});
	} catch (error) {
		log("Error: While filering posts.", error);
		res.status(500).json({ message: 'Internal server error' });
	}
};


exports.filterPages = async (req, res) => {
	try {
		let numberOfPages;
		let thisPage;
		const { currentpage, paginationtype, searchquery } = req.query;
		if (currentpage) thisPage = parseInt(currentpage) - 1;
		else thisPage = 0;
		let totalPages;
		let pages;
		const { filterCategory, filterDate } = req.body;

		if (filterDate == "All Dates") {
			if (filterCategory == "All Categories") {
				totalPages = await pageModel.find({});
				numberOfPages = Math.ceil(totalPages?.length / ITEMS_PER_PAGE);
				pages = totalPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
			} else {
				totalPages = await pageModel.find({ author: filterCategory });
				numberOfPages = Math.ceil(totalPages?.length / ITEMS_PER_PAGE);
				pages = totalPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
			}
		} else {
			const startDate = new Date(`${filterDate}-01T00:00:00Z`);
			const endDate = new Date(`${filterDate}-31T23:59:59Z`);

			if (filterCategory == "All Categories") {
				totalPages = await pageModel.find({
					createdAt: { $gte: startDate, $lte: endDate }
				});
				numberOfPages = Math.ceil(totalPages?.length / ITEMS_PER_PAGE);
				pages = totalPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
			} else {
				totalPages = await pageModel.find({
					author: filterCategory,
					createdAt: { $gte: startDate, $lte: endDate }
				});
				numberOfPages = Math.ceil(totalPages?.length / ITEMS_PER_PAGE);
				pages = totalPages.slice(thisPage * ITEMS_PER_PAGE, thisPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
			}
		}

		const allPages = await pageModel.find({});
		const published = allPages.filter(page => page.status === 'published');
		const hidden = allPages.filter(page => page.visibility === 'hidden');
		const authors = [...new Set(allPages.map(page => page.author))];
		const dates = getLastTwelveMonths();
		log("Rendering all pages");
		res.render("all", {
			allPages: pages,
			message: req.flash("message"),
			published,
			hidden,
			authors,
			dates,
			paginationtype: 'filtered',
			searchquery: searchquery || "",
			currentpage: currentpage || 1,
			numberOfPages,
			filtercategory: filterCategory,
			filterdate: filterDate
		});
	} catch (error) {
		log("Error: While rendering all pages.", error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

exports.pageBulkAction = async (req, res) => {
	try {
		const { action } = req.body;
		if (action === "publish all") {
			await pageModel.updateMany({}, { status: 'published', visibility: 'visible' });
		} else if (action === "hide all") {
			await pageModel.updateMany({}, { status: 'hidden', visibility: 'hidden' });
		} else {
			return res.status(400).json({ message: "Invalid action selected" });
		}
		const updatedPages = await pageModel.find({});
		log("Updated bulk action on pages");
		res.status(200).json({ message: "Pages updated successfully", updatedPages });
	} catch (error) {
		log("Error: While applying bulk action on pages.", error);
		res.status(500).json({ message: "Error occurred while updating page status." });
	}
};

exports.updatePageStatus = async (req, res) => {
	try {
		const { ejsPageName, status, visibility } = req.body;
		const pageMatch = await pageModel.findOneAndUpdate({ name: ejsPageName }, {
			$set: {
				status,
				visibility,
			}
		}, { new: true });
		log('Updated page status');
		res.status(200).json({ success: true })
	} catch (error) {
		log("Error: While updating page status.", error);
		res.status(500).json({ message: "Error occurred while updating page status." });
	}
}


exports.postBulkAction = async (req, res) => {
	try {
		const { action, postTypeId } = req.body;
		const filter = { postType: postTypeId };

		if (action === "publish all") {
			log("Publishing all posts");
			await postModel.updateMany(filter, { status: 'published', visibility: 'visible' });
		} else if (action === "hide all") {
			log("Hiding all posts");
			await postModel.updateMany(filter, { status: 'hidden', visibility: 'hidden' });
		} else {
			log("Invalid bulk action");
			return res.status(400).json({ message: "Invalid action selected" });
		}

		const updatedPosts = await postModel.find(filter);
		log("Applied bulk action on posts.")
		res.status(200).json({ message: "post updated successfully", updatedPosts });
	} catch (error) {
		log("Error: While applying bulk action on posts.", error);
		res.status(500).json({ message: "Error occurred while applying bulk action on posts." });
	}
}

exports.deletePostType = async (req, res) => {
	try {
		log("deleting a post-type...");
		const { postTypeName, postTypeId } = req.body;
		const match = await postTypeModel.findOneAndDelete({ postTypeName, _id: postTypeId }, { new: true });
		if (match) {
			await postModel.deleteMany({ postType: postTypeId });
			log("Deleted post-type");
			res.status(200).json({ success: true, message: "post-type and its posts deleted" });
		}
	} catch (error) {
		log("Error: While deleting a post-type.", error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.updateBatteryPrice = async (req, res) => {
	try {
		console.log("HERE IS UPDATED PRICE DATA", req.body);
		const batteryMatch = await postModel.findOneAndUpdate({ _id: req.body?.postId }, {
			"postData.mrp": req.body.mrp.trim(),
			"postData.specialprice": req.body.specialprice.trim(),
			"postData.pricewitholdbattery": req.body.pricewitholdbattery.trim(),
			"postData.pricewithoutoldbattery": req.body.pricewithoutoldbattery.trim(),
		}, { new: true });
		res.status(200).json({ success: true, message: "Battery Pricing Updated successfully" });
	} catch (error) {
		log("Error: While deleting a post-type.", error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.addPostData = async (req, res) => {
	try {
		log("adding post data...");
		const { postName, modelName, postTypeId, ...postData } = req.body;
		const trimmedPostData = getTrimmedObject(postData);
		const existingPost = await postModel.findOne({ postName, postType: postTypeId });
		if (postTypeId) {
			const postType = await postTypeModel.findOne({ _id: postTypeId });
			if (postType) {
				if (!postType?.customField?.length > 0 || !postType?.customFieldId?.length > 0) {
					existingPost.defaultPostTitle = trimmedPostData?.defaultPostTitle?.trim();
					existingPost.defaultPostContent = trimmedPostData?.defaultPostContent;
					existingPost.postData = {};
					existingPost.revisions = existingPost.revisions + 1;
					await existingPost.save();
					return res.redirect(`/api/v1/manage/render-post?postname=${encodeURIComponent(postName)}&postid=${encodeURIComponent(postTypeId)}`);
				} else {
					const fileObject = {};
					for (let item of postType?.customFieldId) {
						const modelReference = await dataModel.findOne({ _id: item });
						if (!modelReference) return res.status(500).json({ success: false, message: "Cannot find model information. exiting." });
						req.files.forEach(fileItem => {
							if (modelReference.dataObject[fileItem.fieldname] === 'Image') {
								fileObject[fileItem.fieldname] = fileItem.filename;
							} else if (modelReference.dataObject[fileItem.fieldname] === 'Multiple Images') {
								if (existingPost?.postData[fileItem.fieldname]) {
									fileObject[fileItem.fieldname] = [...existingPost.postData[fileItem.fieldname], fileItem.filename]
								} else {
									fileObject[fileItem.fieldname] = [fileItem.filename]
								}
							}
						});
					}
					if (!existingPost?.postData) {
						existingPost.postData = {
							...trimmedPostData,
							...fileObject
						}
					} else {
						existingPost.postData = {
							...existingPost?.postData,
							...trimmedPostData,
							...fileObject
						}
					}
					existingPost.customField = postType?.customField;
					existingPost.revisions = existingPost.revisions + 1;
					await existingPost.save();
					return res.redirect(`/api/v1/manage/render-post?postname=${encodeURIComponent(postName)}&postid=${encodeURIComponent(postTypeId)}`);
				}
			} else {
				return res.status(400).json({ success: false, message: "cannot find the post-type" });
			}
		} else {
			return res.status(400).json({ success: false, message: "cannot find the post-type" });
		}
	} catch (error) {
		log("Error: While adding post data.", error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.addPageArrayItem = async (req, res) => {
	try {
		log("adding page array item...");
		const { ejsPageName, sectionName, arrayItemNamePointer, itemType } = req.body;
		const data = {
			id: uuidv4(),
			type: itemType,
			value: itemType === 'Image' ? req.files[0]?.filename : req.body?.itemValue
		}
		const match = await pageModel.findOneAndUpdate({ name: ejsPageName, 'sections.sectionName': sectionName, 'sections.sectionContent.elementAttrName': arrayItemNamePointer }, {
			$push: {
				'sections.$.sectionContent.$[elem].elementItems': data
			}
		}, { new: true, arrayFilters: [{ 'elem.elementAttrName': arrayItemNamePointer }] })
		log("Array item added to page section");
		res.status(200).json({ data: req.body })
	} catch (error) {
		log("Error: While adding array item to page section.", error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.deletePageArrayItem = async (req, res) => {
	try {
		log('deleting page array item');
		const { ejsPageName, sectionName, arrayName, itemId } = req.body;
		const match = await pageModel.findOneAndUpdate(
			{
				name: ejsPageName,
				'sections.sectionName': sectionName,
				'sections.sectionContent.elementAttrName': arrayName,
				'sections.sectionContent.elementItems.id': itemId
			},
			{
				$pull: {
					'sections.$[chosenSection].sectionContent.$[chosenElement].elementItems': { id: itemId }
				}
			},
			{
				new: true,
				arrayFilters: [
					{ 'chosenSection.sectionName': sectionName },
					{ 'chosenElement.elementAttrName': arrayName },
				]
			}
		);
		log("Deleting page array section item");
		res.status(200).json({ success: true, data: match });
	} catch (error) {
		log("Error: While deleting page section array item", error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.searchPagesByName = async (req, res) => {
	try {
		const search = new RegExp(req.body?.searchName, 'i');
		const filteredPages = await pageModel.find({ name: search });
		const numberOfPages = Math.ceil(filteredPages.length / ITEMS_PER_PAGE);
		const allPages = await pageModel.find({});
		const published = allPages.filter(page => page.status === 'published');
		const hidden = allPages.filter(page => page.visibility === 'hidden');
		const authors = [...new Set(allPages.map(page => page.author))];
		const dates = getLastTwelveMonths();
		log("rendering all pages search result");
		const responseD = await axios.post("https://api.instagram.com/oauth/access_token", {
			client_id: req.body.client_id,
			client_secret: req.body.client_secret,
			grant_type: "authorization_code",
			redirect_uri: "http://174.138.76.145/auth-redirect",
			code: req.body.code,
		});

		if (responseD.status !== 200) console.log("Authorization via 'code' grant_type failed.");

		res.render("all", {
			allPages: filteredPages.slice(0, ITEMS_PER_PAGE),
			message: req.flash("message"),
			published,
			hidden,
			authors,
			dates,
			search,
			paginationtype: 'search',
			searchquery: req.body?.searchName,
			numberOfPages,
			currentpage: 1,
			filterdate: '',
			filtercategory: ''
		})
	} catch (error) {
		log("Error: While searching pages by name.", error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.searchModelsByName = async (req, res) => {
	try {
		const search = new RegExp(req.body?.searchName, 'i');
		log("rendering all models page...");
		const allModels = await dataModel.find({ modelName: search });
		res.render("allmodels", { allModels });
	} catch (error) {
		log("Error: While searching models by name.", error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.updatePageItemTextContent = async (req, res) => {
	try {
		log("updaing page item text-content");
		const { ejsPageName, sectionName, arrayName, itemId, itemValue } = req.body;
		const doc = await pageModel.findOne({ name: ejsPageName });
		if (doc) {
			const match = await pageModel.findOneAndUpdate(
				{
					name: ejsPageName,
					'sections.sectionName': sectionName,
					'sections.sectionContent.elementAttrName': arrayName,
					'sections.sectionContent.elementItems.id': itemId
				},
				{
					$set: {
						'sections.$[section].sectionContent.$[elementItem].elementItems.$[item].value': itemValue
					}
				},
				{
					new: true,
					arrayFilters: [
						{ 'section.sectionName': sectionName },
						{ 'elementItem.elementAttrName': arrayName },
						{ 'item.id': itemId }
					],
				});
			res.status(200).json({ success: true, message: "ok", data: match });
		} else {
			res.status(400).json({ success: false, message: "data not found" });
		}
	} catch (error) {
		log("Error: While updating page item text content.", error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.addPostArrayItem = async (req, res) => {
	try {
		log("adding post array item...", req.body);
		const { postName, postTypeId, arrayItemNamePointer, itemType, itemValue } = req.body;
		let treatedItemValue;
		if (itemType === "String" || itemType === "Textarea") {
			treatedItemValue = itemValue;
		} else if (itemType === "PostLink") {
			const match = await postModel.findOne({ _id: itemValue });
			treatedItemValue = `${match.postName}__${itemValue}`
		} else if (itemType === "JSON") {
			treatedItemValue = JSON.parse(itemValue);
		} else if (itemType === "Image") {
			treatedItemValue = req.files[0].filename;
		}
		const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
			$push: {
				[`postData.${arrayItemNamePointer}`]: { id: uuidv4(), type: itemType, value: treatedItemValue }
			},
		}, { new: true });
		if (!post) return res.status(400).json({ successs: false, message: "cannot find post data" });
		return res.status(200).json({ success: true })
	} catch (error) {
		log("Error: While adding post array item.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.addPostRepeaterItem = async (req, res) => {
	try {
		log("adding post repeater item");
		const { postName, postTypeId, modelName, repeaterId, ...repeaterData } = req.body;
		let allFiles = {};
		req.files.forEach(fileItem => {
			allFiles[fileItem.fieldname] = fileItem.filename;
		})
		const model = await dataModel.findOne({ modelName });
		const chosenRepeater = model.dataObject?.repeaters.filter(item => item?.id === repeaterId)[0];
		let sortedData = {}
		chosenRepeater.fields.forEach(field => {
			sortedData[field.fieldName] = repeaterData[field.fieldName] || allFiles[field.fieldName]
		})
		const postMatch = await postModel.findOne({ postName, postType: postTypeId });
		if (postMatch?.postData?.repeaters && postMatch.postData?.repeaters.filter(item => item?.repeaterId === repeaterId)?.length > 0) {

			const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
				$push: {
					'postData.repeaters.$[repeaterElement].data': sortedData
				}
			}, {
				new: true,
				arrayFilters: [
					{ 'repeaterElement.repeaterId': repeaterId }
				]
			});

		} else {
			const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
				$push: {
					'postData.repeaters': {
						repeaterName: chosenRepeater?.repeaterName,
						repeaterId: chosenRepeater?.id,
						data: [sortedData]
					}
				}
			}, {
				new: true
			});

		}
		return res.redirect(`/api/v1/manage/render-post?postname=${encodeURIComponent(postName)}&postid=${encodeURIComponent(postTypeId)}`);
	} catch (error) {
		log("Error: While adding post repeater item.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}
/**
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updatePostRepeaterItem = async (req, res) => {
	try {
		const { postName, postTypeId, repeaterId, repeaterItemIndex, modelId, ...repeaterItemData } = req.body;
		const post = await postModel.findOne({ postName, postType: postTypeId });
		req.files.forEach(fileItem => {
			repeaterItemData[fileItem?.fieldname] = fileItem.filename
		})
		const originalRepeaterData = post.postData.repeaters.filter(item => item?.repeaterId === repeaterId)[0]?.data[parseInt(repeaterItemIndex)];
		await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
			$set: {
				[`postData.repeaters.$[repeaterItem].data.${repeaterItemIndex}`]: { ...originalRepeaterData, ...repeaterItemData }
			}
		}, {
			arrayFilters: [{ 'repeaterItem.repeaterId': repeaterId }],
			new: true
		})
		return res.redirect(`/api/v1/manage/render-post?postname=${encodeURIComponent(postName)}&postid=${encodeURIComponent(postTypeId)}`);
	} catch (error) {
		log("Error: While updating post repeater item.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.addPostRepeaterArrayItem = async (req, res) => {
	try {
		log("Adding repeater array item, inside a post...");
		const { postName, postTypeId, repeaterName, arrayName, itemType, itemValue } = req.body;
		let treatedItemValue;
		if (itemType === "String" || itemType === "Textarea") {
			treatedItemValue = itemValue;
		} else if (itemType === "JSON") {
			treatedItemValue = JSON.parse(itemValue);
		} else if (itemType === "Image") {
			treatedItemValue = req.files[0].filename;
		}
		const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
			$addToSet: {
				[`postData.${repeaterName}.${arrayName}`]: {
					id: uuidv4(),
					type: itemType,
					value: treatedItemValue
				}
			}
		}, { new: true })
		res.status(200).json({ success: true, data: post });
	} catch (error) {
		log('Error: While adding post array item.', error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.deletePostArrayItem = async (req, res) => {
	try {
		log("deleting post array item");
		const { postName, postTypeId, arrayName, itemId } = req.body;
		const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
			$pull: {
				[`postData.${arrayName}`]: { id: itemId }
			}
		}, { new: true });
		res.status(200).json({ success: true });
	} catch (error) {
		log("Error: While deleting post array item.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.updatePostArrayItem = async (req, res) => {
	try {
		log("updating post array item...");
		const { postName, postTypeId, arrayName, arrayIndex, itemId, itemType, itemValue } = req.body;
		const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId, [`postData.${arrayName}.id`]: itemId }, {
			$set: { [`postData.${arrayName}.$.value`]: itemValue }
		});
		await post.save();
		res.status(200).json({ success: true });
	} catch (error) {
		log("Error: While updating post array item.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.orderPageArrayItem = async (req, res) => {
	try {
		log("ordering page array item...");
		const { ejsPageName, sectionName, arrayItemNamePointer, order } = req.body;
		const doc = await pageModel.findOne({ name: ejsPageName });
		if (doc) {
			const rearrangedArray = order.map(id => {
				const foundSection = doc.sections.filter((item, index) => (item?.sectionName === sectionName))[0];
				const foundElementItems = foundSection.sectionContent.filter((item) => (item?.elementAttrName === arrayItemNamePointer))[0]?.elementItems;
				const foundObject = foundElementItems.filter(item => item?.id === id)[0];
				return foundObject || null; // Handle the case where an ID is not found
			});
			// 
			const match = await pageModel.findOneAndUpdate({ name: ejsPageName, 'sections.sectionName': sectionName, 'sections.sectionContent.elementAttrName': arrayItemNamePointer }, {
				$set: {
					'sections.$.sectionContent.$[elem].elementItems': rearrangedArray
				}
			}, { new: true, arrayFilters: [{ 'elem.elementAttrName': arrayItemNamePointer }] })

			res.status(200).json({ success: true, data: match });
		} else {
			return res.status(400).json({ success: false, message: "unable to find the page." });
		}
	} catch (error) {
		log("Error: While ordering page array items.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.orderPostArrayItem = async (req, res) => {
	try {
		log("ordering post array items...");
		const { postName, postTypeId, arrayItemNamePointer, order } = req.body;
		const doc = await postModel.findOne({ postName, postType: postTypeId });
		if (doc) {
			const rearrangedArray = order.map(id => {
				const foundObject = doc.postData[arrayItemNamePointer].find(obj => obj.id === id);
				return foundObject || null;
			});
			const result = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
				$set: {
					[`postData.${arrayItemNamePointer}`]: rearrangedArray
				}
			}, { new: true })
		}
		return res.status(200).json({ success: true })
	} catch (error) {
		log("Error: While ordering post array items.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.createPostCategory = async (req, res) => {
	try {
		log("creating post category...");
		const { categoryName, categorySlug, parentCategory, categoryDescription, categoryId } = req.body;
		if (!categoryId) {
			const categoryMatch = await categoryModel.findOne({ categoryName: categoryName });
			if (categoryMatch) {
				req.flash("message", { message: "category already exists.", success: false });
				return res.redirect('/api/v1/manage/render-categories-manager')
			}
			const newCategory = new categoryModel({
				categoryName: categoryName,
				categorySlug: categorySlug,
				parentCategory: parentCategory,
				categoryDescription: categoryDescription
			});
			await newCategory.save();
		} else {
			await categoryModel.findByIdAndUpdate(categoryId, {
				categoryName,
				categorySlug,
				parentCategory,
				categoryDescription
			})
		}
		res.redirect('/api/v1/manage/render-categories-manager')
	} catch (error) {
		log("Error: While creating new post category.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.deletePostCategory = async (req, res) => {
	try {
		log("deleting post Category");
		const categoryName = req?.query?.categoryName;
		await categoryModel.findOneAndDelete({ categoryName: categoryName });
		res.redirect('/api/v1/manage/render-categories-manager')
	} catch (error) {
		log("Error: While deleting a post category.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.editPostCategory = async (req, res) => {
	try {
		const categoryName = req?.query?.categoryName;
		const postCategories = await categoryModel.find();
		const categoryData = await categoryModel.findOne({ categoryName: categoryName });
		res.render('editCategoryData', { catgeoryData: categoryData, postCategories: postCategories });
	} catch (error) {
		log("Error: While rendering post-category edit page.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.updatePostPermaLink = async (req, res) => {
	try {
		log("updating post permalink...");
		const { postName, postTypeId, permalink } = req.body;
		const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
			$set: {
				'permaLink': permalink
			}
		}, { new: true });
		res.redirect(`/api/v1/manage/render-post?postname=${encodeURIComponent(postName)}&postid=${encodeURIComponent(postTypeId)}`);
	} catch (error) {
		log("Error: While updating post permalink.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.changePostVisibility = async (req, res) => {
	try {
		log("changing post visibility state...");
		const { postName, postTypeId, selectedValue } = req.body;
		const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
			$set: {
				'visibility': selectedValue
			}
		}, { new: true });
		await res.status(200).json({ success: true })
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.changePostStatus = async (req, res) => {
	try {
		log("changing post status...");
		const { postName, postTypeId, selectedValue } = req.body;
		const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
			$set: {
				'status': selectedValue
			}
		}, { new: true });
		await res.status(200).json({ success: true })
	} catch (error) {
		log("Error: While changing post status.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.addPostCategory = async (req, res) => {
	try {
		const { postName, postTypeId, postCategoryIdSelect } = req.body;
		const categoryMatch = await categoryModel.findOne({ _id: postCategoryIdSelect });
		if (!categoryMatch) return res.redirect(`/api/v1/manage/render-post?postname=${encodeURIComponent(postName)}&postid=${encodeURIComponent(postTypeId)}`);
		const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, { $addToSet: { 'category': categoryMatch } }, { new: true });
		await post.save();
		return res.redirect(`/api/v1/manage/render-post?postname=${encodeURIComponent(postName)}&postid=${encodeURIComponent(postTypeId)}`);
	} catch (error) {
		log("Error Boundary reached:");
		let err = error.message;
		log("Error: While adding post category.", error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.unlinkCategory = async (req, res) => {
	try {
		log("unlinking category from post...");
		const { categoryId, postName, postTypeId } = req.body;
		const post = await postModel.findOneAndUpdate({ postName, postType: postTypeId }, {
			$pull: {
				category: { _id: categoryId }
			}
		}, { new: true });
		await post.save();
		res.status(200).json({ success: true });
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'Internal server error', error });
	}
}

exports.showPost = async (req, res) => {
	try {
		log("rendering post...");
		const encodedPostName = req.query.postname;
		const encodedPostId = req.query.postid;
		const postName = decodeURIComponent(encodedPostName);
		const postTypeId = decodeURIComponent(encodedPostId);
		const allPostTypes = await postTypeModel.find({}).select("postTypeName")
		const postType = await postTypeModel.findOne({ _id: postTypeId });
		const post = await postModel.findOne({ postName: postName, postType: postTypeId });
		const allCategories = await categoryModel.find({});
		if (postType && postType?.customField?.length > 0) {
			let dataObject = {};
			let modelNames = [];
			async function processAllCustomFields(items) {
				log("processign custom fields");
				for (const item of items) {
					const model = await dataModel.findOne({ modelName: item });
					if (model) {
						let modifiedDataObject = {};
						for (let item of Object.keys(model?.dataObject)) {
							if (typeof (model?.dataObject[item]) == 'string') {
								modifiedDataObject[item] = model?.dataObject[item]
							} else if (Array.isArray(model?.dataObject[item]) && item === 'repeaters') {
								modifiedDataObject = { ...modifiedDataObject, repeaters: model?.dataObject[item] }
							}
						}
						dataObject = { ...dataObject, ...modifiedDataObject };
						modelNames.push(model?.modelName)
					}
				}
			}
			await processAllCustomFields(postType?.customField);
			res.render('post', {
				postTypeId,
				postTypeName: postType?.postTypeName,
				allPostTypes,
				postId: post?._id,
				postName: postName,
				dataObject: dataObject,
				postData: post.postData,
				revisions: post.revisions,
				status: post.status,
				visibility: post.visibility,
				permaLink: post.permaLink,
				modelName: modelNames,
				customFields: postType.customField,
				customFieldIds: postType.customFieldId,
				category: post?.category || [],
				allCategories,
			});
		} else {
			res.render('post', {
				postTypeId,
				postTypeName: postType?.postTypeName,
				allPostTypes,
				postId: post?._id,
				postName: postName,
				dataObject: {},
				revisions: post.revisions,
				status: post.status,
				permaLink: post.permaLink,
				visibility: post.visibility,
				defaultPostTitle: post.defaultPostTitle,
				defaultPostContent: post.defaultPostContent,
				modelName: [""],
				customFields: [],
				customFieldIds: [],
				category: [],
				allCategories,
			});
		}
	} catch (error) {
		log(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.viewPostRepeaterItem = async (req, res) => {
	try {
		const { modelName, postName, postTypeId, repeaterId, repeaterItemIndex } = req.body;
		res.redirect(`/api/v1/manage/render-post-repeater-item?modelName=${encodeURIComponent(modelName)}&postName=${encodeURIComponent(postName)}&postTypeId=${encodeURIComponent(postTypeId)}&repeaterId=${encodeURIComponent(repeaterId)}&repeaterItemIndex=${encodeURIComponent(repeaterItemIndex)}`);
	} catch (error) {
		log(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.renderPostRepeaterItem = async (req, res) => {
	try {
		const { modelName, postName, postTypeId, repeaterId, repeaterItemIndex } = req.query;
		const repeaterModel = await dataModel.findOne({ modelName });
		const repeaterFields = repeaterModel.dataObject?.repeaters.filter(item => item?.id === repeaterId)[0]?.fields;
		const match = await postModel.findOne({ postName, postType: postTypeId });
		const repeaterData = match.postData?.repeaters.filter(item => item?.repeaterId === repeaterId)[0]?.data[parseInt(repeaterItemIndex)];
		res.render("repeateritem", {
			postName,
			postTypeId,
			repeaterItemIndex,
			repeaterId,
			modelId: repeaterModel?._id,
			repeaterData,
			repeaterFields
		})
	} catch (error) {
		log(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.renderaddNewModel = async (req, res) => {
	try {
		log("rendering add new model page");
		res.render("newmodel", {
			message: "Let us create a new model."
		});
	} catch (error) {
		log(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.addNewModel = async (req, res) => {
	try {
		log("adding new model data...");
		const { modelName, modelSlug } = req.body;
		const match = await dataModel.findOne({ modelName: modelName });
		if (match) {
			return res.redirect("newmodel", {
				error: {
					status: true,
					message: "Model with the same name already exists"
				}
			})
		} else {
			const newDataModel = new dataModel({
				modelName,
				modelSlug,
				dataObject: {}
			});
			await newDataModel.save();
			res.redirect(`/api/v1/manage/rendermodel?modelname=${encodeURIComponent(newDataModel?._id)}`);
		}
	} catch (error) {
		log(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.deleteModel = async (req, res) => {
	log("deleting a model...");
	const { modelName } = req.body;
	const model = await dataModel.findOneAndDelete({ modelName })
	res.status(200).json({ success: true, message: "Model deleted." })
}

exports.deleteModelField = async (req, res) => {
	log("deleting a model field...");
	const { fieldName, modelId } = req.body;
	const model = await dataModel.findOneAndUpdate({ _id: modelId }, {
		$unset: {
			[`dataObject.${fieldName}`]: 1
		}
	}, { new: true });
	res.status(200).json({ success: true });
}

exports.renderModel = async (req, res) => {
	try {
		log("rendering a model...");
		const encodedModelName = req.query.modelname;
		if (!encodedModelName) {
			return res.redirect("/add-new-model");
		} else {
			const decodedModelName = decodeURIComponent(encodedModelName);
			const dataMatch = await dataModel.findOne({ _id: decodedModelName });
			const allModels = await dataModel.find({}).select('modelName _id');
			const linkedPostTypes = await postTypeModel.find({ customFieldId: dataMatch?._id });
			const allPostTypes = await postTypeModel.find({});
			res.render("model", {
				modelData: dataMatch,
				linkedPostTypes,
				allPostTypes,
				allModels: allModels
			})
		}
	} catch (error) {
		log(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.allModels = async (req, res) => {
	try {
		log("rendering all models page...");
		const allModels = await dataModel.find({});
		res.render("allmodels", { allModels });
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.getAllModelNamesAndLinks = async (req, res) => {
	try {
		log("getting all model names and links...");
		const allModels = await dataModel.find({ pin: true });
		const sanitizedData = allModels.map(item => ({ modelName: item.modelName, _id: item?._id }));
		res.status(200).json({ success: true, data: sanitizedData });
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.addModelData = async (req, res) => {
	try {
		log("adding model data...");
		const { modelName, modelData } = req.body;
		const existingData = await dataModel.findOne({ modelName });
		if (!existingData) {
			return res.status(400).json({ success: false, message: 'Model not found.' });
		}
		const filteredModelData = Object.fromEntries(
			Object.entries(modelData).filter(([key]) => key.trim() !== '')
		);
		existingData.dataObject = { ...filteredModelData, repeaters: existingData.dataObject?.repeaters ? [...existingData.dataObject.repeaters] : undefined };
		await existingData.save();
		res.status(200).json({ success: true, updatedData: existingData });
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}


// need to see the issue with model description for newly created models

exports.addModelDescription = async (req, res) => {
	try {
		log('adding model description');
		const { modelId, description } = req.body;
		const existingModel = await dataModel.findOneAndUpdate({ _id: modelId }, {
			$set: {
				description
			}
		});
		await existingModel.save();
		res.redirect(`/api/v1/manage/rendermodel?modelname=${encodeURIComponent(existingModel?._id)}`);
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.linkModelRepeater = async (req, res) => {
	try {
		log("linking model with repeater...");
		const { modelId, fieldName, linkingModelId } = req.body;
		log("Request Body::", req.body);
		const existingModel = await dataModel.findOneAndUpdate({ _id: modelId }, {
			[`dataObject.${fieldName}`]: {
				value: "Repeater",
				linkedModel: linkingModelId
			}
		}, { new: true });
		log(existingModel);	
		res.status(200).json({ success: true, message: "repeater linked" });
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}


/**
 * 
 * @param {} req 
 * @param {*} res 
 */
exports.addRepeaterToModel = async (req, res) => {
	try {
		log("adding repeater data to model...");
		const { modelId, repeaterLabel, repeaterName, fields, existingRepeater } = req.body;
		if (!existingRepeater) {
			const match = await dataModel.findOneAndUpdate({ _id: modelId }, {
				$push: {
					[`dataObject.repeaters`]: {
						id: uuidv4(),
						repeaterName,
						repeaterLabel,
						fields
					}
				}
			}, { new: true })
			res.status(200).json({ success: true, data: match })
		} else {
			const match = await dataModel.findOneAndUpdate(
				{ _id: modelId },
				{
					$set: {
						'dataObject.repeaters.$[repeaterMatch].fields': fields
					}
				},
				{
					arrayFilters: [
						{ 'repeaterMatch.id': existingRepeater }
					],
					new: true
				}
			);
			res.status(200).json({ success: true, data: match })
		}
	} catch (error) {
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.deleteRepeater = async (req, res) => {
	try {
		log("deleting repeater from model...");
		const { modelId, repeaterName, repeaterId } = req.body;
		const model = await dataModel.findOneAndUpdate({ _id: modelId }, {
			$pull: {
				'dataObject.repeaters': {
					id: repeaterId
				}
			}
		}, { new: true });
		const post = await postModel.updateMany({}, {
			$pull: {
				'postData.repeaters': {
					repeaterId
				}
			}
		})
		res.status(200).json({ success: true });

	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.savePageData = async (req, res) => {
	try {
		log("saving page data...", __dirname);
		let data = {};
		const postData = req.body;
		const pageMatch = await pageModel.findOne({ name: postData.ejsPageName });
		if (pageMatch) {
			pageMatch.pageDefaultTitle = postData.pageDefaultTitle;
			pageMatch.pageDefaultContent = postData.pageDefaultContent;
			const postDataSections = JSON.parse(postData.sections);
			postDataSections.forEach(postDataSectionItem => {
				pageMatch.sections.map(pageSectionItem => {
					if (pageSectionItem.sectionName === postDataSectionItem.sectionName) {
						pageSectionItem.sectionContent = pageSectionItem.sectionContent.map(pageSectionContentItem => {
							const temp = postDataSectionItem.sectionContent.filter(postSectionContentItem => postSectionContentItem.elementAttrName === pageSectionContentItem.elementAttrName)[0];
							if (temp) {
								if (temp.elementAttrSrcImg) {
									temp.elementAttrSrcImg = req.files.filter(item => item.originalname === temp.elementAttrSrcImg)[0]?.filename;
								}
								return { ...pageSectionContentItem, ...temp }
							} else {
								return pageSectionContentItem;
							}
						})
						return pageSectionItem;
					} else {
						return pageSectionItem;
					}
				})
			})
			pageMatch.revisions += 1;
			await pageMatch.save();
			res.status(200).json({ success: true });
		} else {
			res.status(400).json({ success: false, message: "Unable to get page data" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.removePage = async (req, res) => {
	try {
		log("removing page...");
		const { ejsPageName } = req.body;
		await pageModel.findOneAndDelete({ name: ejsPageName });
		res.status(200).json({ sucess: true, message: "Page deleted successfully" });
	} catch (error) {
		console.error('Error saving fields:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.removePageSection = async (req, res) => {
	try {
		log("remove page section...");
		const { ejsPageName, sectionName } = req.body;
		const pageMatch = await pageModel.findOne({ name: ejsPageName });
		if (pageMatch) {
			pageMatch.sections = pageMatch.sections.filter(section => section.sectionName !== sectionName);
			await pageMatch.save();
			res.status(200).json({ success: true, message: "Page section removed" });
		} else {
			res.status(400).json({ success: false, message: 'data not found' });
		}
	} catch (error) {
		console.error('Error saving fields:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.removeSectionElement = async (req, res) => {
	try {
		log("remove section element...");
		const { ejsPageName, sectionName, elementAttrName } = req.body;
		const pageMatch = await pageModel.findOne({ name: ejsPageName });
		if (pageMatch) {
			pageMatch.sections.map(section => {
				if (section?.sectionName === sectionName) {
					section.sectionContent = section.sectionContent.filter(item => item?.elementAttrName !== elementAttrName);
					return section;
				} else {
					return section;
				}
			});
			await pageMatch.save();
			res.status(200).json({ success: true });
		}
	} catch (error) {
		console.error('Error saving fields:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.addSection = async (req, res) => {
	try {
		log("adding section to page...");
		const { ejsPageName, sectionName } = req.body;
		const match = await pageModel.findOne({ name: ejsPageName });
		if (!match) {
			req.flash("message", { success: false, message: "Unable to get page data" });
			return res.status(400).json({ success: false, message: "Unable to get page data" });
		}
		for (let item of match.sections) {
			if (item.sectionName === sectionName) {
				req.flash("message", { success: false, message: "Section with same name already exists" });
				return res.status(400).json({ success: false, message: "Section with same name already exists" });
			}
		}
		match.sections.push({
			sectionName: sectionName
		});
		await match.save();
		req.flash("message", { success: true, message: "Section added" })
		res.status(200).json({ success: true });
	} catch (error) {
		req.flash("message", { success: false, message: error?.message })
		console.error('Error saving fields:', error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

exports.addButton = async (req, res) => {
	try {
		log("adding button...");
		const { ejsPageName, sectionNamePointer, buttonNamePointer, buttonTitle, buttonLink } = req.body;
		const match = await pageModel.findOne({ name: ejsPageName });
		if (match) {
			match.sections = match.sections.map(section => {
				if (section.sectionName === sectionNamePointer) {
					section.sectionContent = section.sectionContent.map(element => {
						if (element.elementAttrName === buttonNamePointer) {
							element.elementAttrHref = buttonLink;
							element.elementValue = buttonTitle;
							return element;
						} else {
							return element;
						}
					})
					return section;
				} else {
					return section;
				}
			});
			match.revisions += 1;
			await match.save();
			res.status(200).json({ success: true });
		} else {
			res.status(400).json({ success: false });
		}
	} catch (error) {
		console.error('Error saving fields:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.addLink = async (req, res) => {
	try {
		log("adding link...");
		const { ejsPageName, sectionNamePointer, buttonNamePointer, linkTitle, linkHref } = req.body;
		const match = await pageModel.findOne({ name: ejsPageName });
		if (match) {
			match.sections = match.sections.map(section => {
				if (section.sectionName === sectionNamePointer) {
					section.sectionContent = section.sectionContent.map(element => {
						if (element.elementAttrName === buttonNamePointer) {
							element.elementAttrHref = linkHref;
							element.elementValue = linkTitle;
							return element;
						} else {
							return element;
						}
					})
					return section;
				} else {
					return section;
				}
			});
			match.revisions += 1;
			await match.save();
			log("link added successfully");
			res.status(200).json({ success: true });
		} else {
			res.status(400).json({ success: false });
		}
	} catch (error) {
		console.error('Error saving fields:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.addElement = async (req, res) => {
	try {
		let nameCheckSuccess = true;
		const { ejsPageName, sectionName, elementData } = req.body;
		const sanitizedPageName = ejsPageName.replace(/\s/g, '-');
		if (ejsPageName) {
			const pageMatch = await pageModel.findOne({ name: ejsPageName });
			if (pageMatch) {
				pageMatch.sections.map(item => {
					if (item.sectionName === sectionName) {
						item.sectionSlug = sectionName.toLowerCase().split(" ").join("-") + "-section-slug";
						if (Array.from(new Set(item.sectionContent?.map(item => item?.elementAttrName))).indexOf(elementData?.elementAttrName) !== -1) {
							nameCheckSuccess = false;
							return item;
						}
						item.sectionContent.push(elementData);
						return item;
					} else return item;
				})
				await pageMatch.save();
				if (nameCheckSuccess) {
					res.status(200).json({ success: true });
				} else {
					res.status(200).json({ success: false, message: "element with same name attribute already exists" });
				}
			} else {
				res.status(400).json({ success: false, message: "Cannot find the page data." });
			}
		}
	} catch (error) {
		log(error);
		res.status(500).json({ message: "Error occurred while adding element." });
	}
}

exports.renderchangeTheme = async (req, res) => {
	try {
		const user = await adminModel.findOne({ email: req.jwt?.decoded?.email });
		res.render("colorThemeSetting", {
			themeName: user?.themeName,
			message: req.flash("message"),
			username: user?.username,
			email: user?.email,
			profileImage: user?.profileImage
		})
	} catch (error) {
		log(error);
		res.status(500).json({ message: "Error occurred while fetching page." });
	}
}

exports.changeColorTheme = async (req, res) => {
	try {
		const { themeName } = req.body;
		const updatedUser = await adminModel.findOneAndUpdate(
			{ email: req.jwt?.decoded?.email },
			{ $set: { themeName: themeName } },
			{ new: true }
		);

		if (updatedUser) {
			log("ThemeName updated successfully:", updatedUser);
			return res.status(200).redirect("/api/v1/manage/change-theme");
		} else {
			log("User not found with the given email.");
			return res.status(404).json({ message: "User not found with the given email." });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Error occurred while processing the request." });
	}
};

exports.fetchTheme = async (req, res) => {
	try {
		const { decoded } = req.jwt;
		const email = decoded.email;
		const user = await adminModel.findOne({ email: email });

		if (user) {
			const themeName = user.themeName;
			res.json({ themeName: themeName });
		} else {
			res.status(404).json({ message: "User not found with the given email." });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Error occurred while processing the request." });
	}
};

exports.getUserData = async (req, res) => {
	try {
		const { decoded } = req.jwt;
		const email = decoded.email;
		const userData = await adminModel.findOne({ email }).select("email username roles websiteName websiteUrl websiteLogo profileImage");
		res.status(200).json({ success: true, userData })
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: "internal server error", error })
	}
}


// HRASHIKESH CODE CHANGES MERGE :: START

exports.renderPriceManagerPage = async (req, res) => {
	try {
		const batteryPostType = await postTypeModel.findOne({ postTypeName: "Batteries" });
		const posts = await postModel.find({ postType: batteryPostType?._id });
		const allBrands = await postModel.find({ postType: "65bb943f3047f00d56d5d638" });
		res.render("priceManager", {
			products: posts,
			allBrands,
		});
	} catch (error) {
		console.lgo(error);
		res.status(500).json({ success: false, messag: 'server error' });
	}
}

exports.renderOrdersManagerPage = async (req, res) => {
	try {
		await orderModel.updateMany({}, { $set: { unread: false } });
		const { currentpage, searchquery, paginationtype } = req.query;
		const orders = await orderModel.find({});
		const completedOrders = await orderModel.find({ status: 'Completed' }).countDocuments();
		const pendingOrders = await orderModel.find({ status: { $ne: 'Completed' } }).countDocuments();

		let numberOfPages;
		let thisPage;
		if (currentpage) thisPage = parseInt(currentpage) - 1;
		else thisPage = 0;

		numberOfPages = Math.ceil(orders?.length / ITEMS_PER_PAGE);
		let finalPosts = orders.slice(0, ITEMS_PER_PAGE);
		res.render('allOrders', {
			orders,
			completedOrders,
			pendingOrders,
			currentpage: currentpage || 1,
			paginationtype: paginationtype || 'default',
			searchquery: searchquery || '',
			numberOfPages,
			message: req.flash('message')
		});

	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: 'server error' })
	}
}

exports.renderAllProviders = async (req, res) => {
	try {
		const { currentpage, searchquery, paginationtype } = req.query;
		const providers = await providerModel.find({});

		let numberOfPages;
		let thisPage;
		if (currentpage) thisPage = parseInt(currentpage) - 1;
		else thisPage = 0;

		numberOfPages = Math.ceil(providers?.length / ITEMS_PER_PAGE);
		let finalPosts = providers.slice(0, ITEMS_PER_PAGE);
		console.log("rendering...")
		res.render('allProviders', {
			providers,
			currentpage: currentpage || 1,
			paginationtype: paginationtype || 'default',
			searchquery: searchquery || '',
			numberOfPages,
			message: req.flash('message')
		});

	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: 'server error' })
	}
}

exports.renderAllIndependentOrders = async (req, res) => {
	try {
		const { currentpage, searchquery, paginationtype } = req.query;
		const providers = await testOrdersModel.find({providerId: 'NULL'});
		let numberOfPages;
		let thisPage;
		if (currentpage) thisPage = parseInt(currentpage) - 1;
		else thisPage = 0;

		numberOfPages = Math.ceil(providers?.length / ITEMS_PER_PAGE);
		let finalPosts = providers.slice(0, ITEMS_PER_PAGE);
		console.log("rendering...")
		res.render('independentOrders', {
			orders:providers,
			currentpage: currentpage || 1,
			paginationtype: paginationtype || 'default',
			searchquery: searchquery || '',
			numberOfPages,
			message: req.flash('message')
		});		
	} catch (error) {
		log(error);
		res.status(500).json({ success: true, message: 'server error' })
	}
}

exports.renderAllInvoicedOrders = async (req, res) => {
        try {
                const { currentpage, searchquery, paginationtype } = req.query;
                const providers = await testOrdersModel.find({isInvoiced: true});
                let numberOfPages;
                let thisPage;
                if (currentpage) thisPage = parseInt(currentpage) - 1;
                else thisPage = 0;

                numberOfPages = Math.ceil(providers?.length / ITEMS_PER_PAGE);
                let finalPosts = providers.slice(0, ITEMS_PER_PAGE);
                console.log("rendering...")
                res.render('invoicedOrders', {
                        orders:providers,
                        currentpage: currentpage || 1,
                        paginationtype: paginationtype || 'default',
                        searchquery: searchquery || '',
                        numberOfPages,
                        message: req.flash('message')
                });
        } catch (error) {
                log(error);
                res.status(500).json({ success: true, message: 'server error' })
        }
}

exports.searchOrdersById = async (req, res) => {
	try {
		const { orderId } = req.body;
		const order = await orderModel.findOne({ orderId });
		const completedOrders = await orderModel.find({ status: 'Completed' }).countDocuments();
		const pendingOrders = await orderModel.find({ status: { $ne: 'Completed' } }).countDocuments();
		res.render('allOrders', {
			orders: [order],
			completedOrders,
			pendingOrders,
			currentpage: 1,
			paginationtype: 'search',
			searchquery: '',
			numberOfPages: 1,
			
		});
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'server error' });
	}
}

exports.renderOrder = async (req, res) => {
	try {
		const { orderId } = req.params;
		if (!orderId) return res.status(400).json({ success: false, message: 'please provide a valid order id' });
		const order = await testOrdersModel.findOne({ _id: orderId });
		if (!order) return res.status(400).json({ success: false, message: 'order not found, please check the order id' });
		res.render('order', {
			order,
		})
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'server error' });
	}
}

exports.renderCreateNewProvider = async (req, res) => {
	try {
		res.render('newProvider', {
			message: req.flash('message'),
		})
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'server error' });
	}
}
exports.renderUpdateProvider = async (req, res) => {
	try{
		const {providerId} = req.params;
		const provider = await providerModel.findOne({_id: providerId});
		if(!provider) return res.status(400).json({success: false, msg:"provider not found"});
		res.render('updateProvider', {
			message: req.flash('message'),
			providerData: provider,
		})
	} catch (err) {
		console.log(err)
	}
}

exports.downloadProviderOrders = async (req, res) => {
	try{
                const {providerId} = req.params;
                const provider = await providerModel.findOne({_id: providerId});
                if(!provider) return res.status(400).json({success: false, msg:"provider not found"});
                const ordersMatch = await testOrdersModel.find({providerId: providerId}).lean();
                if(!ordersMatch) return res.status(400).json({success: false, msg:"orders not found"});

		// make a copy of the blank excel sheet :
		const blankFilePath = path.join(__dirname, "../export_data/blank_files/blankOrders.xls");
		const tempFileName = `${providerId}_${provider.firstName+"_"+provider.lastName}_Orders.xls`;
		const tempFilePath = path.join(__dirname, `../export_data/${providerId}_${provider.firstName+"_"+provider.lastName}_Orders.xls`);

		await fsPromise.copyFile(blankFilePath, tempFilePath);

		for(let orderData of ordersMatch) {
			const post = await postModel.findOne({_id: orderData.productId});

        	        orderData.status = "Processing";
                	orderData.orderDate = new Date().toLocaleString();
                	orderData.countryCode = "US";
                	orderData.productItemNumber = "1";
                	orderData.productItemName = post ? post.postData.productName: "";
                	orderData.productPrice = post ? post.postData.productPrice : "";
                	orderData.paymentMethod = orderData.isInvoiced ? "INVOICE":"ONLINE";

			fillOrderDetails(orderData, tempFilePath);

		}

                res.download(tempFilePath, tempFileName, async (err) => {
                        if (err) {
                                console.error('Error downloading the file:', err);
                                res.status(500).send('Error downloading the file.');
                        }
			await fsPromise.unlink(tempFilePath);
                });

		// await fsPromise.unlink(tempFilePath);
		console.log("provider order sheet downloaded and removed")

        } catch (err) {
		console.log(err)
        }
}


exports.updateProvider = async (req, res) => {
	try{
		const {firstName, providerId, mi, lastName, dob, email, phone, address1, address2, city, state, zip, npi, lisProviderId, resultContactEmail} = req.body;
		const match = await providerModel.findOne({_id: providerId});
		if(!match) return res.satus(400).json({success: false, msg:"provider not found"});

                const updatedProvider = await providerModel.findOneAndUpdate({ _id: providerId },{ $set: {
			firstName,
                        mi,
                        lastName,
                        dob: new Date(dob),
                        email,
                        phone,
                        address1,
                        address2,
                        city,
                        state,
                        zip,
                        npi,
                        lisProviderId,
                        resultContactEmail,
                }});

                await updatedProvider.save();
                res.redirect("/api/v1/manage/render-all-providers");	
	} catch(err) {
		console.log(err);
		res.status(500).json({success: false, err})
	}
}

exports.updateProviderManual = async (req, res) => {
        try{
                const {firstName, accessToken, mi, lastName, dob, email, phone, address1, address2, city, state, zip, npi, lisProviderId, resultContactEmail} = req.body;
		console.log("UPDATING MANUALLY", req.body);

		const decoded = await jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
		if(!decoded) return res.status(401).json({msg: "unauthorized to update provider"});

		const match =  await providerModel.findOne({ _id: decoded._id }).lean();
		if(!match) return res.status(401).json({msg:"unauthorized for this action"});

                const updatedProvider = await providerModel.findOneAndUpdate({ _id: providerId },{ $set: {
                        firstName,
                        mi,
                        lastName,
                        dob: new Date(dob),
                        email,
                        phone,
                        address1,
                        address2,
                        city,
                        state,
                        zip,
                        npi,
                        lisProviderId,
                        resultContactEmail,
                }});


		const providerData = await providerModel.findOne({ _id: decoded._id }).lean();
		delete providerData.password;
		delete providerData.accessToken;
		// delete providerData.profileImage;
		

                await updatedProvider.save();
                res.status(200).json({success: true, providerData});
        } catch(err) {
                console.log(err);
                res.status(500).json({success: false, err})
        }
}


exports.managePricingAndData = async (req, res) => {
        try {
		console.log("RENDERING PRICE MANAGER");
		const pricingData = await paymentModel.findOne({});  
		console.log("DTAA", pricingData);
                res.render('pricingManager', {
                        message: req.flash('message'),
			paymentData: pricingData,
                })
        } catch (error) {
                log(error);
                res.status(500).json({ success: false, message: 'server error' });
        }
}

exports.updatePricingData = async (req, res) => {
	try{
		const {paymentName, paymentAmount} = req.body;
		console.log("UPDATING PRICING DATA", req.body);
		let existing = await paymentModel.findOne({});
		if(!existing){
			// const newPayment
		}
		await paymentModel.findOneAndUpdate({},{
			paymentName,
			paymentAmount,
		});
		req.flash("message","Pricing data updated successfully!")
		res.redirect("/api/v1/manage/render-pricing-manager");
	} catch {

	}
}

exports.createNewProvider = async (req, res) => {
	try {
		const {firstName, mi, lastName, dob, email, phone, address1, address2, city, state, zip, npi, lisProviderId, resultContactEmail} = req.body;
		const hash = await bcrypt.hash("test101", 10);
		const match = await providerModel.findOne({email});
		if(match) return res.status(400).json({success: false, msg:"A provider with this email already exists"});

		const newProvider = new providerModel({
			firstName, 
			mi,
			lastName, 
			dob : new Date(dob), 
			email,
			phone,
			address1,
			address2,
			city,
			state,
			zip,
			npi,
			lisProviderId,
			resultContactEmail,
			orderCount: 0,
			joined: new Date(),
			password: hash,
			accessToken: "",
			status: "UNVERIFIED"
		});

		await newProvider.save();
		res.redirect("/api/v1/manage/render-all-providers");

	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'server error' });
	}
}

exports.renderProvider = async (req, res) => {
	try {
		const { providerId } = req.params;
		if (!providerId) return res.status(400).json({ success: false, message: 'please provide a valid provider id' });
		const provider = await providerModel.findOne({ _id: providerId });
		if (!provider) return res.status(400).json({ success: false, message: 'provider not found, please check the provider id' });
		res.render('provider', {
			order: provider,
		})
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'server error' });
	}
}

exports.renderOrdersByProviderId = async (req, res) => {
	try {
		const { currentpage, searchquery, paginationtype } = req.query;
		const { providerId } = req.params;
		if (!providerId) return res.status(400).json({ success: false, message: 'please provide a valid provider id' });
		const provider = await providerModel.findOne({ _id: providerId });
		if (!provider) return res.status(400).json({ success: false, message: 'provider not found, please check the provider id' });
		const ordersByProvider = await testOrdersModel.find({providerId:provider._id.toString()});

		let numberOfPages;
		let thisPage;
		if (currentpage) thisPage = parseInt(currentpage) - 1;
		else thisPage = 0;

		numberOfPages = Math.ceil(ordersByProvider?.length / ITEMS_PER_PAGE);
		let finalPosts = ordersByProvider.slice(0, ITEMS_PER_PAGE);
		console.log("rendering...")


		res.render('providerOrders', {
			providerId,
			orders: ordersByProvider,
			currentpage: currentpage || 1,
			paginationtype: paginationtype || 'default',
			searchquery: searchquery || '',
			numberOfPages,
			message: req.flash('message')
		})
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: 'server error' });
	}
}



exports.renderCategoriesManager = async (req, res) => {
	try {
		const categoriesData = await categoryModel.find()
		res.render('categoryManage', { catgeoryData: categoriesData, message: req.flash("message") });
	} catch (error) {
		log(error);
		res.status(500).json({ message: "error rendering the quotations page" });
	}
}
exports.renderQuotationPage = async (req, res) => {
	try {
		log("Fetching all quotations...");
		await Quotation.updateMany({}, { $set: { unread: false } });
		const quotations = await Quotation.find();
		res.render('quotations', { quotations: quotations });
	} catch (error) {
		log(error)
		res.status(500).json({ message: "error rendering the quotations page" })
	}
}

exports.renderCallbackRequests = async (req, res) => {
	try {
		log("Fetching all call back requests...");
		await requestCallBackModel.updateMany({}, { $set: { unread: false } });
		const callBackRequests = await requestCallBackModel.find();
		res.render('callBackRequests', { callBackRequests: callBackRequests });
	} catch (error) {
		log(error)
		res.status(500).json({ message: "error rendering the callBackRequests page" })
	}
}

exports.renderReviewPage = async (req, res) => {
	try {
		log("Fetching all reviews...");
		await reviewModel.updateMany({}, { $set: { unread: false } });
		const reviews = await reviewModel.find();
		const reviewProductIds = Array.from(new Set(reviews.map(review => review.productId)));
		log(reviewProductIds);
		const productReview = await postModel.find({ _id: { $in: reviewProductIds } });
		res.render('reviews', { reviews: reviews, uniqueProducts: productReview });
		res.status(200).status({ message: "all okay" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error rendering the reviews page" });
	}
};

exports.renderProductPriceManager = async (req, res) => {
	try {
	} catch (error) {
		log(error);
		res.status(500).json({ error: 'internal server error' })
	}
}

exports.getProductPricingDetails = async (req, res) => {
	try {
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: "server error" });
	}
}

exports.updateProductPricingDetails = async (req, res) => {
	try {
	} catch (error) {
		log(error);
		res.status(500).json({ success: false, message: "server error" });
	}
}

exports.renderReviewInnerPage = async (req, res) => {
	try {
		const productId = req.params.productId;
		// Fetch reviews for the specified product
		const reviews = await reviewModel.find({ productId: productId });
		// Render the reviews page and pass the reviews data
		res.render('reviewInnerPage', { productId: productId, reviews: reviews });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
}

exports.renderAddCouponPage = async (req, res) => {
	try {
		const brands = await postModel.find({ postType: '65bb943f3047f00d56d5d638' });
		const products = await postModel.find({ postType: '65bcc6f3da634ed216b71268' }).select('postData.name');
		res.render('addCoupon', {
			brands: brands,
			products: products
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
}

exports.renderAddTestimonialPage = async (req, res) => {
	try {
		const testimonials = await reviewModel.find()
		res.render('addTestimonial', { testimonials: testimonials })
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
}

exports.renderAllCoupons = async (req, res) => {
	try {
		log("Fetching all coupons...");
		const coupons = await couponModel.find();
		res.render('allCoupons', { coupons: coupons });
	} catch (error) {
		log(error)
		res.status(500).json({ message: "error rendering the All coupons page" })
	}
}
exports.deleteCoupon = async (req, res) => {
	try {
		const couponId = req.params.couponId;
		log(couponId, "Called");

		// Assuming couponModel.findOneAndDelete() returns a promise
		const deletedCoupon = await couponModel.findOneAndDelete({ _id: couponId });
		const coupons = await couponModel.find();
		// Check if the coupon was found and deleted
		res.render('allCoupons', { coupons: coupons });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}
exports.editCoupon = async (req, res) => {
	try {
		const couponId = req.params.couponId;
		const couponData = await couponModel.findOne({ _id: couponId });
		res.render("editCoupon", couponData)
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

exports.renderManageTestimonial = async (req, res) => {
	try {
		const testimonials = await reviewModel.find()
		res.render("manageTestimonials", { testimonials: testimonials })
	} catch (error) {
		console.log(error)
		res.status(500).json({ sucess: false, message: "Internal server error" })
	}
}

exports.manageTestimonialVisibility = async (req, res) => {
	try {
		const { testimonialId, action } = req?.query
		if (action === "hide") {
			await reviewModel.findByIdAndUpdate(testimonialId, { shouldShow: false })
		} else {
			await reviewModel.findByIdAndUpdate(testimonialId, { shouldShow: true })
		}
		res.status(200).redirect("/api/v1/manage/manage-testimonials")
	} catch (error) {
		console.log(error)
		res.status(500).json({ sucess: false, message: "Internal server error" })
	}
}

exports.deleteTestimonial = async (req, res) => {
	try {
		const { testimonialId } = req?.query
		await reviewModel.findByIdAndDelete(testimonialId)
		res.status(200).redirect("/api/v1/manage/manage-testimonials")
	} catch (error) {
		log(error)
		res.status(500).json({ sucess: false, message: "Internal server error" })
	}
}
