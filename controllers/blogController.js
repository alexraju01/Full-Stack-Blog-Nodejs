const Blog = require("../models/blogModel");

exports.getAllBlogs = async (req, res, next) => {
	const blogs = await Blog.findAll();

	res.status(200).json({
		status: "successs",
		results: blogs.length,
		data: blogs,
	});
};

exports.createBlog = async (req, res, next) => {
	const blog = await Blog.create(req.body);

	res.status(201).json({
		status: "success",
		data: {
			data: blog,
		},
	});
};
