console.log("hello");
import { fetchData } from "./api/baseApi.js";

export const getAllBlog = async () => {
	try {
		const blogs = await fetchData("GET", null);
		console.log(blogs);
		return blogs;
	} catch (error) {
		console.error("Failed to retrieve blogs list.", error);
		return [];
	}
};

getAllBlog();
