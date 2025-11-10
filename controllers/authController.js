const User = require("../models/userModel");

exports.signUp = async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;

	const newUser = await User.create({
		name,
		email,
		password,
		confirmPassword,
	});

	res.status(201).json({
		status: "success",
		data: {
			user: newUser,
		},
	});
};
