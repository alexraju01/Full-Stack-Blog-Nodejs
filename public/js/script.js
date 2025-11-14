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
	console.log("SignUpUser initialized");
	const form = document.getElementById("signup-form");
	if (!form) return;
	console.log("sdfgsdfg");
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

	if (password !== confirmPassword) {
		const message = "Passwords do not match.";
		console.error("Validation Failed:", message);
		displayMessage(form, message, "error"); // Use 'form' and 'error' type
		return;
	}
	try {
		const newUserPayload = { name, email, password, confirmPassword };
		const result = await signupUser(newUserPayload);
		console.log("Sign up successful! Response:", result);
	} catch (error) {
		console.error("Error during sign up:", error);
		// Use the error message from the thrown Error object
		const feedback = error.message || "An unexpected error occurred. Please try again.";

		// Use the 'form' element and 'error' type
		displayMessage(form, feedback, "error");
	}
};

const initializeApp = () => {
	console.log("App initialized");
	renderBlogs();
	SignupUser();
};

document.addEventListener("DOMContentLoaded", initializeApp);
