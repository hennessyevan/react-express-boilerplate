export const setToken = token => {
	// set an item in local storage called "token" and set it equal to any value we pass to it
	localStorage.setItem("token", token);
};

// retrieve our token from local storage
export const getToken = () => localStorage.getItem("token");

export const removeToken = () => {
	// remove our token from local storage
	localStorage.removeItem("token");
};
