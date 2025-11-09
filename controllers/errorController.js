// controllers/errorController.js
const AppError = require("../utility/AppError");

// Sequelize-specific error formatters
const handleSequelizeValidationErrorDB = (err) => {
	const errors = err.errors.map((el) => el.message);
	const message = `Invalid input data: ${errors.join(". ")}`;
	return new AppError(message, 400);
};

const handleSequelizeUniqueConstraintErrorDB = (err) => {
	const fields = Object.keys(err.fields || {});
	const message = `Duplicate field value: ${fields.join(", ")} Please use another value.`;
	return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode || 500).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error("ERROR:", err);
		res.status(500).json({
			status: "Error",
			message: "Something went very wrong!",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		error.message = err.message;

		if (error.name === "SequelizeUniqueConstraintError")
			error = handleSequelizeUniqueConstraintErrorDB(error);

		if (error.name === "SequelizeValidationError") error = handleSequelizeValidationErrorDB(error);

		sendErrorProd(error, res);
	}
};
