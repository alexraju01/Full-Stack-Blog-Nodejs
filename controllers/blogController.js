const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const APIFeatures = require("../utility/APIFeatures");
const AppError = require("../utility/AppError");

exports.getAllBlogs = async (req, res) => {
	const features = new APIFeatures(Blog.findAndCountAll(), req.query).filter().sort();

	const { count, rows: blogs } = await Blog.findAndCountAll({
		...features.options,
		attributes: { exclude: ["userId"] }, // remove userId
		include: [
			{
				model: User,
				as: "author",
				attributes: ["id", "name"],
			},
		],
	});

	res.status(200).json({
		status: "successs",
		results: count,
		data: blogs,
	});
};
exports.createBlog = async (req, res) => {
	const blogData = req.body;
	blogData.userId = req.user.id;

	const newBlog = await Blog.create(blogData);

	res.status(201).json({
		status: "success",
		data: newBlog,
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
	const { id: userId } = req.user;

	const deleteBlog = await Blog.destroy({
		where: {
			id,
			userId,
		},
	});

	if (deleteBlog === 0)
		return next(
			new AppError("You do not have permission to delete this blog, or it does not exist.", 403)
		);

	res.status(204).json({
		status: "success",
		data: null,
	});
};

exports.updateBlog = async (req, res, next) => {
	const { id } = req.params;
	const updateData = req.body;
	const userId = req.user.id;

	const [affectedRows] = await Blog.update(updateData, {
		where: {
			id: id,
			userId,
		},
	});

	if (affectedRows === 0) {
		return next(
			new AppError("You do not have permission to update this blog, or it does not exist.", 403)
		);
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
