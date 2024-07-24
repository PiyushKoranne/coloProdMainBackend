const cookieSession = require('cookie-session')
const express = require('express')
const app = express()
const PORT = 4001
require('dotenv').config();
const manageRouter = require('./routes/manageRouter')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const ejs = require('ejs');
const { Connectdb } = require('./config/dbConn')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fs = require('fs')
const pageModel = require('./models/pageModel')
const { defaultPage } = require('./utils/constants')
const flash = require('connect-flash');
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");
const helmet = require('helmet');
const { apiErrorHandler } = require('./middlewares/apiErrorHandler');
const {log} = require("./utils/utilFunctions");
const testOrdersModel = require('./models/testOrderModel');
const providerModel = require('./models/providerModel');

/**
 * Connecting to database
 */
Connectdb();

app.set('trust proxy', 1);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
		// res.header("Access-Control-Allow-Credentials", 'true')
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.json());
// app.use(morgan(process.env.MODE === "development" ? 'dev' : 'combined'));
app.use(express.static(path.join(__dirname, 'static')));
app.use('/ejsasset' ,express.static(path.join(__dirname, 'public')));

const corsOptions = {
	origin: ['http://192.168.16.36:5173'],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: 'Content-Type,Authorization',
	credentials: true, // Enable credentials (cookies, HTTP authentication)
};

app.use(cors())

app.use(session({
	secret:process.env.SESSION_SECRET,
	resave:true,
	saveUninitialized:true,
	cookie:{
		maxAge:60*60000, // 1 hour
		// sameSite:'none',
		// secure: true,
		// httpOnly: true
	},
	store:MongoStore.create({
		mongoUrl:process.env.MONGODB_URL
	})
}))

// app.use(function(req, res, next) {
// 	const requestOrigin = req.get('Origin'); // Get the value of the Origin header
// 	const isSecure = req.secure;
// 	console.log("Request Origin:", requestOrigin,'\n Request is secure:', isSecure);
// 	// console.log("Incoming Headers:", req.headers);
// 	next();
// });

app.use(flash());

// routes
app.get("/api-admin", (req, res)=>{
	log("rendering all pages...");
	res.redirect("/api/v1/manage/all-pages");
})

app.use('/api/v1/manage', manageRouter);

app.get('/newpage', (req, res) => {
	log("rendering new page...");
	res.render('newpage');
});

app.post('/create-page', async (req, res) => {
	log("creating a new page...");
	const { pageHeading, author } = req.body;
	const sanitizedPageName = pageHeading.replace(/\s/g, '-');
	const existingPage = await pageModel.findOne({ name: sanitizedPageName });
	if (existingPage) {
		req.flash("message", {success:false, message:"Page with the same name already exists"})
		res.redirect("/api/v1/manage/all-pages");
	} else {
		log("creating a new page modeling it ...");
		const newPage = new pageModel({
			name: sanitizedPageName,
			author: author,
			sections: [{
				sectionName: "SEO",
				sectionSlug: "seo-section-slug",
				sectionContent: [
					{
						elementName: "input",
						elementClass: "form-control",
						elementLabelName: "Meta Title",
						elementAttrName: "elementMetaTitle",
						elementAttrId: "",
						elementAttrType: "text",
						elementAttrFor: "",
						elementValue: "",
					},
					{
						elementName: "input",
						elementClass: "form-control",
						elementLabelName: "Meta Description",
						elementAttrName: "elementMetaDescription",
						elementAttrId: "",
						elementAttrType: "text",
						elementAttrFor: "",
						elementValue: "",
					},
					{
						elementName: "input",
						elementClass: "form-control",
						elementLabelName: "Meta Keywords",
						elementAttrName: "elementMetaKeywords",
						elementAttrId: "",
						elementAttrType: "text",
						elementAttrFor: "",
						elementValue: "",
					}
				]
			}]
		});
		await newPage.save();

		// Generate a new EJS file for the page with the right sidebar code
		const directory = 'views/pages';
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory);
		}

		const ejsContent = defaultPage(sanitizedPageName);


		const filePath = `${directory}/${sanitizedPageName}.ejs`;
		fs.writeFileSync(filePath, ejsContent);

		// Redirect to the newly created page
		res.redirect(`/page/${sanitizedPageName}`);
	}
});

app.get('/page/:pageName', async (req, res) => {
	log("rendering a page...");
	const { pageName } = req.params;
	try {
		const pageData = await pageModel.findOne({ name: pageName }).exec();

		if (!pageData) {
			res.send('Page not found!');
		} else {
			// Render the corresponding EJS file
			res.render(`pages/${pageName}`, { pageData, message:req.flash("message") });
		}
	} catch (err) {
		// Handle errors, log, or send an appropriate response
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
});

app.delete('/delete-page/:pageName', async (req, res) => {
	log("deleting a page...");
	const { pageName } = req.params;
	try {
		// Delete the page from the MongoDB collection
		await pageModel.deleteOne({ name: pageName });

		// Delete the corresponding EJS file from the 'views/pages' folder
		const filePath = `views/pages/${pageName}.ejs`;
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		res.sendStatus(200);
	} catch (error) {
		console.error('Error deleting page:', error);
		res.sendStatus(500);
	}
});

// Serve index.html for any subpath under /app
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "static/index.html"));
});
app.get("/provider-login", (req, res) => {
	res.sendFile(path.join(__dirname, "static/index.html"));
});

app.get("/provider-portal", (req, res) => {
	res.sendFile(path.join(__dirname, "static/index.html"));
});


app.get("/thank-you", (req, res) => {
	res.sendFile(path.join(__dirname, "static/index.html"));
});


app.get("/not-eligible", (req, res) => {
	res.sendFile(path.join(__dirname, "static/index.html"));
});

app.get("/app", (req, res) => {
	res.sendFile(path.join(__dirname, "static/index.html"));
});

// Serve index.html for any subpath under /app
app.get("/app/*", (req, res) => {
	res.sendFile(path.join(__dirname, "static/index.html"));
});



// Error Handler 
// app.use(apiErrorHandler);
 
// process.env.MODE === "development" && mongoose.set('debug', true);
mongoose.connection.once("open", () => {
	
	log("[Database]----------[ ✔ ]")
	setTimeout(()=>{
		app.listen(PORT, () => {
			log("[Server]------------[ ✔ ]", PORT)
		})
	}, 1000)
})
