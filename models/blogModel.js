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
		validate: {
			notNull: {
				msg: "Title is required",
			},
			notEmpty: {
				msg: "Title cannot be empty.",
			},
			len: {
				args: [5, 150],
				msg: "Title must be between 5 and 150 characters long.",
			},
		},
	},

	content: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			notNull: {
				msg: "Content is required.",
			},
			notEmpty: {
				msg: "Content cannot be empty.",
			},
			len: {
				args: [20],
				msg: "Content must be at least 20 characters long.",
			},
		},
	},

	imageUrl: {
		type: DataTypes.STRING,
		allowNull: true, // optional, in case it's a text-only blog
		validate: {
			isUrl: {
				msg: "Image URL must be a valid URL.",
			},
		},
	},

	category: {
		type: DataTypes.STRING,
		allowNull: true,
		validate: {
			len: {
				args: [0, 50],
				msg: "Category must be less than 50 characters long.",
			},
		},
	},

	tags: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		validate: {
			isArray(value) {
				if (!Array.isArray(value)) {
					throw new Error("Tags must be a list.");
				}
			},
		},
	},
});

// Establishing Relationships
User.hasMany(Blog, { foreignKey: "userId", as: "posts" });
Blog.belongsTo(User, { foreignKey: "userId", as: "author" });

module.exports = Blog;
