const express = require("express");
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

const router = express.Router();

router
	.route("/")
	.get(blogController.getAllBlogs)
	.post(authController.protect, blogController.createBlog);

router
	.route("/:id")
	.get(blogController.GetOneBlog)
	.delete(authController.protect, blogController.deleteBlog)
	.patch(authController.protect, blogController.updateBlog);

module.exports = router;
