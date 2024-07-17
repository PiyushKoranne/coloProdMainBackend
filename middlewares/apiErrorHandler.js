
exports.apiErrorHandler = function(error, req, res, next) {
	res.status(error.statusCode).json({status:"Error", statusCode:error.statusCode, message:error.message});
}