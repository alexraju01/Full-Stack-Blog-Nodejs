export const signUpUser = async () => {
	try {
		const signUp = await fetchData("POST", null, "users/signup");
		return signUp;
	} catch (error) {
		console.error("Failed to signup user.", error);
		return [];
	}
};
