const Blog = require("../models/blogModel");

exports.getAllBlogs = async (req, res) => {
	const blogs = await Blog.findAll();

	res.status(200).json({
		status: "successs",
		results: blogs.length,
		data: blogs,
	});
};
