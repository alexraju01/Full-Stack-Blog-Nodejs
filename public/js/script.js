import { getAllBlog } from "./api/blogServices.js";
import { signupUser, loginUser } from "./api/userSevices.js"; // <-- ASSUME loginUser is added here
import { displayMessage } from "./displayMessage.js";
import { formatDate } from "./utility/formatDate.js";

const postsContainer = document.getElementById("postsContainer");

const getEl = (selector) => document.querySelector(selector);
const getElById = (id) => document.getElementById(id);
// --- BLOG RENDERING FUNCTIONS ---

const renderBlogs = async () => {
	const { data: blogs } = await getAllBlog();
	renderBlogsToHTML(blogs);
};

// ... (createPostHTML and renderBlogsToHTML remain the same) ...

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
	const cards = postsContainer.querySelectorAll(".card");

	cards.forEach((card, index) => {
		const blog = blogs[index];

		card.addEventListener("click", () => {
			// Only pass ID
			window.location.href = `./html/blog-details.html?id=${blog.id}`;
		});
	});
};

// --- USER AUTH UTILITIES ---

const extractUserData = (formData) => Object.fromEntries(formData.entries());

const storeUserSession = (userName, isLogin = false) => {
	localStorage.setItem("userName", userName);
	// Adjust message based on whether it's a new sign-up or a log-in
	const message = isLogin
		? `Welcome back, ${userName}!`
		: `Registration successful! Welcome, ${userName}.`;

	localStorage.setItem("loginMessage", message);
};

const clearUserSession = () => {
	localStorage.removeItem("userName");
	localStorage.removeItem("userId");
};

// --- SIGNUP LOGIC ---

const handleSignUpSubmit = async (event) => {
	event.preventDefault();

	const form = event.target;
	const data = extractUserData(new FormData(form));
	const { name, email, password, confirmPassword } = data;

	displayMessage(form, "", "");

	try {
		const response = await signupUser({
			name,
			email,
			password,
			confirmPassword,
		});

		const userName = response?.data?.user?.name || name;

		storeUserSession(userName, false); // Sign-up (isLogin=false)
		window.location.href = "/"; // redirect
	} catch (error) {
		const feedback = error.message || "An unexpected error occurred. Please try again.";
		displayMessage(form, feedback, "error");
	}
};

const initSignupForm = () => {
	const form = getElById("signup-form");
	if (!form) return;
	form.addEventListener("submit", handleSignUpSubmit);
};

// --- NEW LOGIN LOGIC ---

const handleLoginSubmit = async (event) => {
	event.preventDefault();

	const form = event.target;
	const data = extractUserData(new FormData(form));
	const { email, password } = data;

	displayMessage(form, "", "");

	try {
		const response = await loginUser({ email, password });
		const userName = response?.name || "User";

		storeUserSession(userName, true);
		window.location.href = "/";
	} catch (error) {
		console.error("Login Error:", error);
		const feedback = error.message || "Invalid email or password. Please try again.";
		displayMessage(form, feedback, "error");
	}
};

const initLoginForm = () => {
	const form = getEl(".login-form");
	if (!form) return;
	form.addEventListener("submit", handleLoginSubmit);
};

// ----------- NAVIGATION UI, LOGOUT, AND MESSAGE DISPLAY (remain the same) -----------
const createLoggedInNav = (userName) => `
    <span class="nav-username">Hello, ${userName}</span>
    <a href="#" id="nav-logout">Logout</a>
`;

const createLoggedOutNav = () => `
    <a href="./html/login.html" id="nav-login">Login</a>
    <a href="./html/register.html" id="nav-register">Register</a>
`;

const updateNavForUser = (userName) => {
	const nav = getElById("nav-user-status");
	if (!nav) return;

	nav.innerHTML = userName ? createLoggedInNav(userName) : createLoggedOutNav();

	if (userName) {
		getElById("nav-logout")?.addEventListener("click", handleLogout);
	}
};

const handleLogout = (event) => {
	event.preventDefault();
	clearUserSession();
	updateNavForUser(null);
	window.location.href = "/";
};

const displayStoredMessage = () => {
	const msg = localStorage.getItem("loginMessage");
	if (!msg) return;

	const container = getEl(".hero-content") || document.body;

	const tempDiv = document.createElement("div");
	container.prepend(tempDiv);

	displayMessage(tempDiv, msg, "success");
	setTimeout(() => tempDiv.remove(), 8000);

	localStorage.removeItem("loginMessage");
};

// ----------- APP INITIALIZATION -----------

const initializeApp = () => {
	console.log("App initialized");

	const user = localStorage.getItem("userName");

	// Initialize all features regardless of which page the script runs on
	renderBlogs();
	updateNavForUser(user);
	displayStoredMessage();

	// Check for forms and initialize listeners
	initSignupForm();
	initLoginForm(); // <-- NEW: Initialize the login form listener
};

document.addEventListener("DOMContentLoaded", initializeApp);
