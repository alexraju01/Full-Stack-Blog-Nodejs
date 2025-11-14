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

// Function to render blogs dynamically
export const renderBlogs = async () => {
	const blogList = document.getElementById("blog-list");
	const blogs = await getAllBlog();
	console.log("blogs:", blogs);
	if (!blogs || blogs.length === 0) {
		blogList.innerHTML = `<p class="text-center text-gray-500">No blogs available.</p>`;
		return;
	}

	const blogCards = blogs
		.map(
			(blog) => `
        <div class="card bg-white rounded-lg p-6">
            <span class="text-indigo-600 text-sm font-semibold">${blog.category}</span>
            <h4 class="text-lg font-bold mt-1 mb-2">${blog.title}</h4>
            <p class="text-gray-600 text-sm">${blog.description}</p>
            <span class="text-gray-400 text-xs mt-2 block">By ${blog.author} • ${new Date(
				blog.date
			).toLocaleDateString()}</span>
        </div>
    `
		)
		.join("");

	// Insert dynamically generated blog cards
	// Assuming the first child is the <h3> heading, we insert after it
	blogList.querySelector(".grid").innerHTML = blogCards;
};

// Call renderBlogs to populate the section
renderBlogs();
