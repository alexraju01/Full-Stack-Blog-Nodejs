const express = require("express");
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

const router = express.Router();

router
	.route("/")
	.get(authController.protect, blogController.getAllBlogs)
	.post(blogController.createBlog);

router
	.route("/:id")
	.get(blogController.GetOneBlog)
	.delete(authController.protect, blogController.deleteBlog)
	.patch(blogController.updateBlog);

module.exports = router;
