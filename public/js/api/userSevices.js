import { fetchData } from "./baseApi.js";

export const signupUser = async (newUser) => {
	try {
		const signUp = await fetchData("POST", newUser, "users/signup");
		return signUp;
	} catch (error) {
		console.error("Failed to signup user.", error);
		throw error;
	}
};

export const loginUser = async (userCredentials) => {
	try {
		const loginUser = await fetchData("POST", userCredentials, "users/login");
		return loginUser;
	} catch (error) {
		console.error("Failed to login user user.", error);
		throw error;
	}
};
