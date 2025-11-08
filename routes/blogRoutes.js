const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.route("/").get(blogController.getAllBlogs).post(blogController.createBlog);

router
	.route("/:id")
	.get(blogController.GetOneBlog)
	.delete(blogController.deleteBlog)
	.patch(blogController.updateBlog);

module.exports = router;
