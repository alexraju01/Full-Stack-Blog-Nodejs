import { fetchData } from "./baseApi.js";

export const getAllBlog = async () => {
	try {
		const blogs = await fetchData("GET", null);
		return blogs;
	} catch (error) {
		console.error("Failed to retrieve blogs list.", error);
		return [];
	}
};

export const getSingleBlog = async (blogId) => {
	try {
		const singleBlog = await fetchData("GET", null, `blogs/${blogId}`);
		console.log(singleBlog);
		return singleBlog;
	} catch (error) {
		console.error("Failed to retrieve single blog list.", error);
		return [];
	}
};
