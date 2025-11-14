export const displayMessage = (targetContainer, message, type) => {
	if (!targetContainer) {
		console.error("Target container for message not found.");
		return;
	}

	// 1. Try to find an existing message element
	let messageElement = targetContainer.querySelector(".app-message");

	// 2. If it doesn't exist, create it and add it to the container
	if (!messageElement) {
		messageElement = document.createElement("div");
		messageElement.classList.add("app-message"); // Add a base class for styling

		// Insert the new element at the beginning of the container
		targetContainer.prepend(messageElement);
	}

	// 3. Update the message content and classes
	messageElement.textContent = message;

	// Clear existing type classes and add the new one
	messageElement.classList.remove("success-message", "error-message");
	if (type === "success") {
		messageElement.classList.add("success-message");
	} else if (type === "error") {
		messageElement.classList.add("error-message");
	}
};
