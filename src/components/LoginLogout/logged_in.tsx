// When a user logs in, they're redirected to this page simply tells them that their logged in.
const LoggedInPage = () => {
	let n = 0;
	if (n == 1) {
		return (
			<div>
				<h2>You have logged in</h2>
			</div>
		);
	}
	// if reached by means other than logging in, display error message and prompt to login
	else {
		return (
			<div>
				<h2>You have reached this page in error. Try logging in</h2>
			</div>
		);
	}
};

export default LoggedInPage