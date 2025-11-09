const Blog = require("../models/blogModel");
const APIFeatures = require("../utility/APIFeatures");
const AppError = require("../utility/AppError");

exports.getAllBlogs = async (req, res) => {
	const features = new APIFeatures(Blog.findAndCountAll(), req.query).filter();
	const { count, rows: blogs } = await features.query;

	res.status(200).json({
		status: "successs",
		results: count,
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
	const deleteBlog = await Blog.destroy({
		where: {
			id,
		},
	});
	console.log("deleted:", deleteBlog);
	if (deleteBlog === 0) return next(new AppError("No blog found with that id", 404));

	res.status(204).json({
		status: "success",
		data: null,
	});
};

exports.updateBlog = async (req, res, next) => {
	const { id } = req.params;
	const updateData = req.body;

	const [affectedRows] = await Blog.update(updateData, {
		where: {
			id: id,
		},
	});
	console.log("data:", affectedRows);

	if (affectedRows === 0) {
		return next(new AppError("No blog found with that id", 404));
	}

	const updatedBlog = await Blog.findByPk(id);
	if (!updatedBlog) {
		return next(new AppError("Blog was updated but could not be retrieved", 500));
	}

	res.status(200).json({
		message: "success",
		blog: updatedBlog,
	});
};
