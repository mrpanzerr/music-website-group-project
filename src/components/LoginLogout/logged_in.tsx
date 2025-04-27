/**
Author: Gaetano Panzer  
Date: 4.6.25  
Filename: logged_in.tsx  

Purpose:  
This file defines the `LoggedInPage` component, which serves as a simple page to confirm whether a user is logged in and display an appropriate message based on login status.  

System Context:  
This component is part of the FrontEnd system. It is designed to be displayed after a successful login attempt, verifying the login status and displaying a confirmation message or error message accordingly.  

Development History:  
- Written on: 4.6.25  
- Last revised on: 4.19.25  

Existence Rationale:  
This component exists to provide user feedback after a login attempt, informing the user whether they are logged in or need to try logging in again.  

Data Structures and Algorithms:  
Uses a simple boolean flag (`n`) to simulate the login status. In a real implementation, this would be replaced with actual authentication state management (e.g., using context or a user authentication API).  

Expected Input:  
- None (No props or state are passed to the component).  

Possible Output:  
- A message confirming that the user is logged in if `n == 1`.  
- An error message prompting the user to log in if `n != 1`.  

Future Extensions or Revisions:  
- Replace the `n` flag with actual user login status management (e.g., context or global state).  
- Implement redirection to a user dashboard or relevant page upon successful login.  
- Improve error handling with more detailed feedback for the user.  
**/

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LoggedInPage = () => {
	const location = useLocation();
	const fromLogin = location.state?.fromLogin;

	if (!fromLogin) {
		// They didn’t come here via the intended path
		return (
			<div>
				<h2>Oops!</h2>
				<p>You’ve reached this page in error. Try signing up or logging in.</p>
			</div>
		);
	}

	return (
		<div>
			<h2>Logged in successfully!</h2>
			<p>Welcome back to <strong>PlayBack</strong></p>
			{/* Optional: Add a link to the login page or explore content */}
		</div>
	);
};

export default LoggedInPage