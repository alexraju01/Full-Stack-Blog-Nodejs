import { getAllBlog } from "./api/blogServices.js";
import { signupUser } from "./api/userSevices.js";
import { displayMessage } from "./displayMessage.js";
import { formatDate } from "./utility/formatDate.js";

const postsContainer = document.getElementById("postsContainer");

// --- BLOG RENDERING FUNCTIONS ---

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

// --- USER SIGNUP AND AUTH LOGIC ---

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
		const response = await signupUser(newUserPayload); // Execute signup

		// **NEW LOGIC: Store user data on successful signup**
		// Assuming response.data.user contains the user object with 'name'
		const registeredUser = response.data.user || { name: name };

		localStorage.setItem("userName", registeredUser.name);
		localStorage.setItem(
			"loginMessage",
			`Registration successful! Welcome, ${registeredUser.name}.`
		);

		// Redirect to the home page (where the message will be displayed)
		window.location.href = "/";
	} catch (error) {
		console.error("Error during sign up:", error);
		const feedback = error.message || "An unexpected error occurred. Please try again.";
		displayMessage(form, feedback, "error");
	}
};

// --- NAVIGATION AND MESSAGE UTILITIES (NEW CODE) ---

/**
 * Updates the navigation bar based on the logged-in user state.
 * @param {string | null} userName - The name of the logged-in user or null.
 */
const updateNavForUser = (userName) => {
	const navUserStatus = document.getElementById("nav-user-status");
	if (!navUserStatus) return;

	if (userName) {
		// User is logged in: Display name and Logout
		navUserStatus.innerHTML = `
            <span class="nav-username">Hello, ${userName}</span>
            <a href="#" id="nav-logout">Logout</a>
        `;
		document.getElementById("nav-logout").addEventListener("click", handleLogout);
	} else {
		// User is logged out: Display Login and Register
		navUserStatus.innerHTML = `
            <a href="./html/login.html" id="nav-login">Login</a>
            <a href="./html/register.html" id="nav-register">Register</a>
        `;
	}
};

const handleLogout = (event) => {
	event.preventDefault();
	// Clear user data
	localStorage.removeItem("userName");
	localStorage.removeItem("userId"); // Clean up other auth tokens/IDs

	// Update the navigation to show Login/Register links
	updateNavForUser(null);

	// Optional: Show a logout message or redirect
	console.log("User logged out.");
	// window.location.reload();
};

/**
 * Checks for a success message stored in localStorage after a redirect
 * and displays it on the home page.
 */
const displayStoredMessage = () => {
	const message = localStorage.getItem("loginMessage");
	if (message) {
		// Find a suitable container for the message on the home page (e.g., in the header)
		const messageContainer =
			document.querySelector(".header-content") || document.querySelector("body");

		if (messageContainer) {
			// Using a simple div to temporarily house the message for displayMessage
			const tempDiv = document.createElement("div");
			messageContainer.prepend(tempDiv); // Insert at the top

			displayMessage(tempDiv, message, "success");

			// Optionally remove the message after a few seconds
			setTimeout(() => tempDiv.remove(), 5000);
		}

		// Clear the storage immediately after reading
		localStorage.removeItem("loginMessage");
	}
};

// --- INITIALIZATION ---

const initializeApp = () => {
	console.log("App initialized");

	// 1. Check user login status and update the navigation bar
	const loggedInUser = localStorage.getItem("userName");
	updateNavForUser(loggedInUser);

	// 2. Check for and display any redirected messages
	displayStoredMessage();

	// 3. Initialize other features
	renderBlogs();
	SignupUser();
};

document.addEventListener("DOMContentLoaded", initializeApp);
