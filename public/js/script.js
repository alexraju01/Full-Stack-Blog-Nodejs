import { getAllBlog } from "./api/blogServices.js";
import { signupUser } from "./api/userSevices.js";
import { displayMessage } from "./displayMessage.js";
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

const SignupUser = () => {
	const form = document.getElementById("signup-form");
	if (!form) return;
	form.addEventListener("submit", handleSignUp);
};

const handleSignUp = async (event) => {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const userData = Object.fromEntries(formData);
	displayMessage(form, "", "");

	console.log("Form Data Object (Values):", userData);
	const { name, email, password, confirmPassword } = userData;

	try {
		const newUserPayload = { name, email, password, confirmPassword };
		await signupUser(newUserPayload);
		displayMessage(form, "Registration successful! You can now log in.", "success");
		window.location.href = "/";
	} catch (error) {
		console.error("Error during sign up:", error);
		const feedback = error.message || "An unexpected error occurred. Please try again.";
		displayMessage(form, feedback, "error");
	}
};

const initializeApp = () => {
	console.log("App initialized");
	renderBlogs();
	SignupUser();
};

document.addEventListener("DOMContentLoaded", initializeApp);
