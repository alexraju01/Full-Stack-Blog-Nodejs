const sequelize = require("../config/db");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const blogData = require("./blogs.json");
const userData = require("./users.json");

// node ./seeds/seed.js
const seedDatabase = async () => {
	await sequelize.sync({ force: true });
	await User.bulkCreate(userData);
	console.log("Seeded users successfully!");
	await Blog.bulkCreate(blogData);
	console.log("Seeded blogs successfully!");
};

seedDatabase();
