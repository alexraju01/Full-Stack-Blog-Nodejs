import { getAllBlog, getSingleBlog } from "./api/blogServices.js";
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

// Function to generate the 'My Blog' link HTML
const navUserBlogs = () =>
	`<a href='./user-blogs.html' class='nav-main-link' id='nav-myblog'>
        My Blog
    </a>`;

// Function to insert the 'My Blog' link into the middle-nav
const middleNav = (isLoggedIn) => {
	const middleNavContainer = getEl(".middle-nav");
	if (!middleNavContainer) return;

	const myBlogLink = getElById("nav-myblog");

	if (isLoggedIn && !myBlogLink) {
		// If logged in AND the link doesn't exist, append it.
		middleNavContainer.innerHTML += navUserBlogs();
	} else if (!isLoggedIn && myBlogLink) {
		// If logged out AND the link exists, remove it.
		myBlogLink.remove();
	}
};

// ----------- NAVIGATION UI, LOGOUT, AND MESSAGE DISPLAY (MODIFIED) -----------
const createLoggedInNav = (userName) => `
    
    <span class="nav-username">Hello, ${userName}</span>
    <a href="#" id="nav-logout">Logout</a>
`;

const createLoggedOutNav = () => `
    <a href="./login.html" id="nav-login">Login</a>
    <a href="./register.html" id="nav-register">Register</a>
`;

const updateNavForUser = (userName) => {
	const nav = getElById("nav-user-status");
	const isLoggedIn = !!userName; // Convert userName (string or null) to boolean

	if (!nav) return;

	// 1. Update the user status section (Login/Register or User/Logout)
	nav.innerHTML = isLoggedIn ? createLoggedInNav(userName) : createLoggedOutNav();

	// 2. Control the 'My Blog' link visibility based on login status
	middleNav(isLoggedIn);

	// 3. Attach logout listener if logged in
	if (isLoggedIn) {
		getElById("nav-logout")?.addEventListener("click", handleLogout);
	}
};

// ... (Rest of your script.js remains the same)

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

// --- DYNAMIC BLOG RENDERING ---
const renderBlogDetails = async () => {
	const params = new URLSearchParams(window.location.search);
	const blogId = params.get("id");
	if (!blogId) return;

	try {
		const { data: blog } = await getSingleBlog(blogId);
		getElById("postTitle").textContent = blog.title;
		getElById("postCategory").textContent = blog.category;
		getElById("postMeta").textContent = `By ${blog.author.name} • ${formatDate(blog.createdAt)}`;
		getElById("postImage").src = blog.imageUrl || "https://via.placeholder.com/800x400";
		getElById("postContent").innerHTML = blog.content;
	} catch (error) {
		console.error("Error loading blog:", error);
		getElById("postContent").innerHTML = "<p>Sorry, this blog post could not be loaded.</p>";
	}
};

// ----------- APP INITIALIZATION -----------

const initializeApp = () => {
	console.log("App initialized");

	const user = localStorage.getItem("userName");

	renderBlogs();
	updateNavForUser(user);
	displayStoredMessage();

	// Check for forms and initialize listeners
	initSignupForm();
	initLoginForm();
	renderBlogDetails();
};

document.addEventListener("DOMContentLoaded", initializeApp);
