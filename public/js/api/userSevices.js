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
