const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const Blog = sequelize.define("Blog", {
	slug: {
		type: DataTypes.STRING,
		unique: {
			msg: "Slug must be unique. Please choose another one.",
		},
		allowNull: false,
		validate: {
			notNull: {
				msg: "Slug is required.",
			},
			notEmpty: {
				msg: "Slug cannot be empty.",
			},
			len: {
				args: [3, 100],
				msg: "Slug must be between 3 and 100 characters long.",
			},
			is: {
				args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
				msg: "Slug can only contain letters, numbers, and hyphens.",
			},
		},
	},

	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	content: {
		type: DataTypes.TEXT,
		allowNull: false,
	},

	imageUrl: {
		type: DataTypes.STRING,
		allowNull: true, // optional, in case it's a text-only blog
	},

	category: {
		type: DataTypes.STRING,
		allowNull: true,
	},

	tags: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
	},
});

// Establishing Relationships
User.hasMany(Blog, { foreignKey: "userId", as: "posts" });
Blog.belongsTo(User, { foreignKey: "userId", as: "author" });

module.exports = Blog;
