const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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

		profileImage: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
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

module.exports = User;
