const sequelize = require("../config/db");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const blogData = require("./blogs.json");
const userData = require("./users.json");
const bcrypt = require("bcryptjs");

// Define the number of salt rounds for hashing
const saltRounds = 10;

// node ./seeds/seed.js
const seedDatabase = async () => {
	try {
		// 1. Synchronize the database (drops existing tables if force: true)
		await sequelize.sync({ force: true });
		console.log("Database synced and tables reset.");

		// 2. Hash Passwords Before Bulk Creation (for User data)
		console.log("Starting password hashing...");
		const hashedUserData = await Promise.all(
			userData.map(async (user) => {
				// Generate the hash for the user's plaintext password
				const hashedPassword = await bcrypt.hash(user.password, saltRounds);
				// Return the user object with the HASHED password
				return {
					...user,
					password: hashedPassword,
				};
			})
		);
		console.log("Passwords hashed successfully!");

		// 3. Seed Users
		await User.bulkCreate(userData, { individualHooks: true }); // Use the data with HASHED passwords
		console.log("Seeded users successfully! ✅");

		// 4. Seed Blogs
		await Blog.bulkCreate(blogData);
		console.log("Seeded blogs successfully! ✅");

		// 5. Exit the process
		process.exit(0); // Use code 0 for a successful exit
	} catch (error) {
		console.error("Database seeding failed:", error);
		process.exit(1); // Use code 1 for an error exit
	}
};

seedDatabase();
