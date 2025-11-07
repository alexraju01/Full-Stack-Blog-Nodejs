const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const Blog = sequelize.define("Blog", {
	slug: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
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
