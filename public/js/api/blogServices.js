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

export const getUserBlogs = async () => {
	const token = localStorage.getItem("token");

	if (!token) {
		const authError = new Error("User not authenticated. Token is missing.");
		authError.status = 401;
		throw authError;
	}

	try {
		const userBlog = await fetchData("GET", null, `blogs/my-blogs`, token);
		console.log("service layer:", userBlog);
		return userBlog;
	} catch (error) {
		console.error("Failed to retrieve user blog list.", error);
		throw error;
	}
};
