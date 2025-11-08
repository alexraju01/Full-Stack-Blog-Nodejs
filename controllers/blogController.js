const Blog = require("../models/blogModel");
const AppError = require("../utility/AppError");

exports.getAllBlogs = async (req, res) => {
	const blogs = await Blog.findAll();
	res.status(200).json({
		status: "successs",
		results: blogs.length,
		data: blogs,
	});
};

exports.createBlog = async (req, res) => {
	const blog = await Blog.create(req.body);

	res.status(201).json({
		status: "success",
		data: blog,
	});
};

exports.GetOneBlog = async (req, res, next) => {
	const { id } = req.params;
	const blog = await Blog.findByPk(id);

	if (!blog) return next(new AppError("No blog found with that id", 404));

	res.status(200).json({ status: "success", data: blog });
};

exports.deleteBlog = async (req, res, next) => {
	const { id } = req.params;
	const blog = await Blog.destroy(id);

	if (!blog) return next(new AppError("No blog found with that id", 404));

	res.status(204).json({
		status: "success",
		data: null,
	});
};

exports.updateBlog = async (req, res) => {
	const { id } = req.params;
	const blog = await Blog.findByPk(id);

	if (!blog) return next(new AppError("No blog found with that id", 404));
	const updatedBlog = await blog.update(req.body);

	res.status(200).json({
		message: "Note updated successfully",
		blog: updatedBlog,
	});
};
