export const fetchData = async (method = "GET", data = null, endpoint = "blogs") => {
	const url = `/api/v1/${endpoint}`;

	const config = {
		method,
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (data && ["POST", "PUT", "PATCH"].includes(config.method)) {
		config.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(url, config);

		if (!response.ok) {
			const errorBody = await response.json().catch(() => ({}));

			let errorMessage = `HTTP error! Status: ${response.status} (${
				response.statusText || "Unknown"
			})`;

			if (errorBody.message) {
				errorMessage = errorBody.message;
			}

			// Throw a new Error with the custom message
			throw new Error(errorMessage);
		}

		if (response.status === 204) {
			console.log(`Successfully completed ${method} request to ${url} with 204 No Content.`);
			return {}; // Return an empty object or true to signal success
		}

		const data = await response.json();
		return data;
		// Use result.data if available, otherwise return the whole result
	} catch (error) {
		console.error(`API execution failed for ${config.method} ${url}:`, error);
		throw error;
	}
};
