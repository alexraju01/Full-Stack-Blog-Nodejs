const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Blog = sequelize.define(
	"Blog",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
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

		userName: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		userId: {
			type: DataTypes.UUID,
			allowNull: false,
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

module.exports = Blog;
