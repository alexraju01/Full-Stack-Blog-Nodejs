const { promisify } = require("node:util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utility/AppError");
const { token } = require("morgan");
const { use } = require("react");

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signUp = async (req, res) => {
	const { name, email, role, password, confirmPassword, passwordChangedAt } = req.body;

	const newUser = await User.create({
		name,
		email,
		password,
		confirmPassword,
		passwordChangedAt,
		role,
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
		userId: user.id,
		name: user.name,
	});
};

exports.protect = async (req, res, next) => {
	const { authorization } = req.headers;
	let token;
	// 1) Getting the token and check if it exist
	if (authorization && authorization.startsWith("Bearer")) {
		token = authorization.split(" ")[1];
	}

	if (!token) {
		return next(new AppError("Your are not logged in! Please login to get access.", 401));
	}
	// 2) Verifying the token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exist
	const currentUser = await User.findByPk(decoded.id);
	console.log(currentUser);
	if (!currentUser) {
		return next(new AppError("The user belonging to this token does not exist!", 401));
	}

	// 4) Check if user changed password after JWT token is created
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError("User recently chnaged the password! Please login again.", 401));
	}

	// Grants access to the protected routes
	req.user = currentUser;

	next();
};

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError("You do not have permission to perform this action!", 403));
		}
		next();
	};
};
