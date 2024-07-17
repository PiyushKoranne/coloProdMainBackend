const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
	destination:(req, file, cb) => {
		if(file.mimetype === 'application/pdf'){
			cb(null, path.join(__dirname, "..", "recforms"));
		} else {
			cb(null, path.join(__dirname, "..", "public", "images"))
		}
	},
	filename:(req, file, cb) => {
		const dt = new Date();

		if(file.mimetype === 'application/pdf'){
			cb(null, `${dt.getFullYear()}_${dt.getMonth()}_${uuidv4()}_${file.originalname}`);
		} else {
			cb(null, `${dt.getFullYear()}_${dt.getMonth()}_${file.originalname}`)
		}
	}
});

const upload = multer({storage:storage});

module.exports = upload;