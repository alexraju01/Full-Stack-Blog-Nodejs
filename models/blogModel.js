const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const Blog = sequelize.define(
	"Blog",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},

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

		// The Foreign Key
		userId: {
			type: DataTypes.UUID,
			allowNull: false, // Ensures every blog post has an author
		},

		category: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		},

		isPublished: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},

		publishedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		timestamps: true, // adds createdAt and updatedAt
	}
);

// Establishing Relationships
User.hasMany(Blog, { foreignKey: "userId", as: "posts" });
Blog.belongsTo(User, { foreignKey: "userId", as: "author" });

module.exports = Blog;
