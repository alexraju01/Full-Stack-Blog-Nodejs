require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/db");

const startServer = async () => {
	try {
		console.log("Connecting to the database...");

		await sequelize.authenticate();
		console.log("Database connected successfully!");

		// Sync models (optional)
		// await sequelize.sync();
		// console.log("Models synchronized.");

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
