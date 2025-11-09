const User = require("../models/userModel");
const AppError = require("../utility/AppError");

exports.getAllUsers = async (req, res) => {
	const users = await User.findAll();

	res.status(200).json({
		status: "success",
		results: users.length,
		data: {
			users,
		},
	});
};

exports.deleteUser = async (req, res, next) => {
	const { id } = req.params;
	const deleteUser = await User.destroy({
		where: {
			id,
		},
	});
	if (deleteUser === 0) return next(new AppError("No user found with that id", 404));

	res.status(204).json({
		status: "success",
		data: null,
	});
};
