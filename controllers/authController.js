const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utility/AppError");

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signUp = async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;

	const newUser = await User.create({
		name,
		email,
		password,
		confirmPassword,
	});

	const token = signToken(newUser.id);

	res.status(201).json({
		status: "success",
		token,
		data: {
			user: newUser,
		},
	});
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError("Please provide email and password"));
	}

	const user = await User.scope("withPasswords").findOne({
		where: {
			email: email,
		},
	});

	console.log(user);

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect email or password", 401));
	}

	const token = signToken(user.id);

	res.status(200).json({
		status: "success",
		token,
	});
};
