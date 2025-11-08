require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const blogRouter = require("./routes/blogRoutes");
const AppError = require("./utility/AppError");
const globalErrorHandler = require("./controllers/errorController");

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Development Logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use("/api/v1/blogs", blogRouter);

// Catches all undefined routes
app.get("/*splat", async (req, res, next) => {
	next(new AppError(`can't find the ${req.originalUrl} on the this server`));
});

app.use(globalErrorHandler);

module.exports = app;
