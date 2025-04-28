/**
Author: Gaetano Panzer
Styling: Max Collins
Date: 4.6.25  
Filename: logged_out.tsx  

Purpose:  
This file defines the `LoggedOutPage` component, which serves as a confirmation page for when a user logs out, displaying an appropriate message based on whether the user properly logged out or not.  

System Context:  
This component is part of the FrontEnd system. It handles the user's redirection after logging out, confirming the logout status and providing feedback.  

Development History:  
- Written on: 4.6.25  
- Last revised on: 4.19.25  

Existence Rationale:  
This component exists to inform the user whether they have successfully logged out or if they reached the page in error, prompting them to log in again.  

Data Structures and Algorithms:  
Uses a simple boolean flag (`n`) to simulate the logout status. In a real implementation, this would be replaced with actual session or authentication state management (e.g., context, local storage, or session cookies).  

Expected Input:  
- None (No props or state are passed to the component).  

Possible Output:  
- A message confirming that the user has logged out if `n == 1`.  
- An error message prompting the user to log in if `n != 1`.  

Future Extensions or Revisions:  
- Replace the `n` flag with actual user logout status management (e.g., context, session cookies, or global state).  
- Implement a redirection to the login page or homepage after logout.  
- Enhance error handling and provide a more informative message for failed logout attempts.  
**/

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './login_logout.css';

const LoggedOutPage = () => {
	const location = useLocation();
	const fromLogout = location.state?.fromLogout;

	if (!fromLogout) {
		// They didn’t come here via the intended path
		return (
			<div className="result-page">
				<h2>Oops!</h2>
				<p>You’ve reached this page in error. Try signing up or logging in.</p>
			</div>
		);
	}

	return (
		<div className="result-page">
			<h2>Logged out successfully!</h2>
			<p>Come back soon</p>
			{/* Optional: Add a link to the login page or explore content */}
		</div>
	);
};

export default LoggedOutPage