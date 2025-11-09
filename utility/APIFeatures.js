const Blog = require("../models/blogModel");

class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
		this.options = {};
	}

	filter() {
		const queryObject = { ...this.queryString };
		const excludedFields = ["page", "sort", "limit", "fields"];
		excludedFields.forEach((element) => delete queryObject[element]);

		this.options.where = queryObject;
		this.query = Blog.findAndCountAll(this.options);
		return this;
	}

	sort() {
		if (this.queryString.sort) {
			// e.g., sort=createdAt,-title (Sequelize requires [['createdAt', 'ASC'], ['title', 'DESC']])
			const sortBy = this.queryString.sort.split(",").map((field) => {
				if (field.startsWith("-")) {
					return [field.substring(1), "DESC"];
				}
				return [field, "ASC"];
			});
			this.options.order = sortBy;
		}
		this.query = Blog.findAndCountAll(this.options);
		return this;
	}
}

module.exports = APIFeatures;
