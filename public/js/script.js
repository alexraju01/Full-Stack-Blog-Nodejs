import { getAllBlog } from "./api/blogServices.js";
import { formatDate } from "./utility/formatDate.js";

const postsContainer = document.getElementById("postsContainer");

const renderBlogs = async () => {
	const { data: blogs } = await getAllBlog();
	renderBlogsToHTML(blogs);
};

const createPostHTML = (blog) => {
	const formattedDate = formatDate(blog.createdAt);
	return `
        <div class="card">
            <span class="card-category ${blog.category}-category">${blog.category}</span>
            <h4 class="card-title">${blog.title}</h4>
            <p class="card-excerpt">${blog.content}</p>
            <span class="card-meta">By ${blog.author.name} • ${formattedDate}</span>
        </div>
    `;
};

const renderBlogsToHTML = (blogs) => {
	if (!postsContainer) return;
	const blogsHTML = blogs.map(createPostHTML).join("");
	postsContainer.innerHTML = blogsHTML;
};
const SignUpUser = () => {
	const signupBtn = document.getElementById("signupBtn");
	if (!signupBtn) return;

	signupBtn.addEventListener("click", handleSignUp);
	const handleSignUp = async (event) => {}
        
    ;
};

const initializeApp = () => {
	console.log("App initialized");
	renderBlogs();
	SignUpUser();
};

document.addEventListener("DOMContentLoaded", initializeApp);
