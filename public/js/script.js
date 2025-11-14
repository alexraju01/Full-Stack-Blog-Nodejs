import { getAllBlog } from "./api/blogServices.js";
import { formatDate } from "./utility/formatDate.js";

const postsContainer = document.getElementById("postsContainer");

const renderBlogs = async () => {
	const { data: blogs } = await getAllBlog();

	if (!blogs || blogs.length === 0) {
		postsContainer.innerHTML = "<p>No blog posts found.</p>";
		return;
	}

	postsContainer.innerHTML = blogs
		.map((blog) => {
			return `
                <div class="card">
                    <span class="card-category ${blog.category}-category">${blog.category}</span>
                    <h4 class="card-title">${blog.title}</h4>
                    <p class="card-excerpt">${blog.content}</p>
                    <span class="card-meta">By ${blog.author.name} • ${formatDate(
				blog.createdAt
			)}</span>
                </div>
            `;
		})
		.join("");
};

document.addEventListener("DOMContentLoaded", renderBlogs);
