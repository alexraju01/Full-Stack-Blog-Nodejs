export const storeUserSession = (userName, isLogin = false) => {
	localStorage.setItem("userName", userName);
	// Adjust message based on whether it's a new sign-up or a log-in
	const message = isLogin
		? `Welcome back, ${userName}!`
		: `Registration successful! Welcome, ${userName}.`;

	localStorage.setItem("loginMessage", message);
};

export const clearUserSession = () => {
	localStorage.removeItem("userName");
	localStorage.removeItem("userId");
};
