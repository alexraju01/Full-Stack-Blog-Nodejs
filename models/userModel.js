const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");
const User = sequelize.define(
	"User",
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: {
					args: [1, 120],
					msg: "Name must be between 1 and 120 characters long.",
				},
			},
		},

		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: {
					msg: "The email field cannot be empty",
				},
				isEmail: {
					msg: "The email format is invalid. Please try again.",
				},
			},
		},

		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "The password field cannot be empty",
				},
				len: {
					args: [8],
					msg: "Password must be at least 8 characters long.",
				},
			},
			// The password stored here will be the HASHED string
		},

		confirmPassword: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				// Check that a value was actually provided
				notEmpty: {
					msg: "Please confirm your password.",
				},
				// This field will be used by the model-level validator below.
			},
		},

		passwordChangedAt: {
			type: DataTypes.DATE,
		},

		profileImage: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		defaultScope: {
			attributes: {
				exclude: ["password", "confirmPassword"],
			},
		},

		scopes: {
			withPasswords: {
				attributes: {
					include: ["password"],
				},
			},
		},

		validate: {
			passwordMatches() {
				if (this.password !== this.confirmPassword) {
					// Sequelize will catch this error and prevent saving/updating
					throw new Error("Password and Confirm Password must match.");
				}
			},
		},
	}
);
// Hook to hash the password before a new user is created.
User.beforeCreate(async (user, options) => {
	user.password = await bcrypt.hash(user.password, 12);
	user.confirmPassword = undefined;
});

// Hook to hash the password only if it has been changed before an existing user is updated.
User.beforeUpdate(async (user, options) => {
	if (!user.changed("password")) return next();
	user.password = await bcrypt.hash(user.password, 12);
	user.confirmPassword = undefined;

	user.passwordChangedAt = Date.now();
});

User.prototype.correctPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		console.log(changedTimestamp, JWTTimestamp);

		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

module.exports = User;
