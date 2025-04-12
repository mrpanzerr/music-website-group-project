// When a user logs out, redirect here and end their session
const LoggedOutPage = () => {
	let n = 0;
	if (n == 1) {
		return (
			<div>
				<h2>You have logged out</h2>
			</div>
		);
	}
	// if reached by means other than clicking the logout button, display error message and prompt to login 
	else {
		return (
			<div>
				<h2>You have reached this page in error. Try logging in</h2>
			</div>
		);
	}
}

export default LoggedOutPage