const sequelize = require("../config/db");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const blogData = require("./blogs.json");
const userData = require("./user.json");

const seedDatabase = async () => {
	await sequelize.sync({ force: true });
	await User.bulkCreate(userData);
	console.log("Users seed successfully!");
	await Blog.bulkCreate(blogData);
	console.log("Blogs seed successfully!");
};

seedDatabase();

// Command to run this seed file
// node seeds/seed.js
