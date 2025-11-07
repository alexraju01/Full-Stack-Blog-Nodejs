require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/db");

require("./models/userModel");
require("./models/blogModel");

const seedDatabase = require("./seeds/seed");

const startServer = async () => {
	try {
		console.log("Connecting to the database...");

		await sequelize.authenticate();
		console.log("Database connected successfully!");

		await sequelize.sync({ force: true });
		console.log("Models synchronized.");

		seedDatabase();
		console.log("Models seeded!");

		const { PORT } = process.env;
		app.listen(PORT, () => {
			console.log(` Server is running at http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Database connection failed!");
		console.error("Error details:", error.message);
		process.exit(1); // Stop the app if the DB connection fails
	}
};

startServer();
