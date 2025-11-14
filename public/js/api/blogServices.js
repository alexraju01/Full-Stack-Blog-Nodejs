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
