/**
  Author: Gaetano Panzer
  Date: 4.4.25
  Filename: acct_created_page.tsx
  
  Purpose:
  This component displays a confirmation message to users after they have successfully signed up,
  and ends their session to prompt login going forward.
  
  System Context:
  Part of the FrontEnd system, confirming successful account creation via a standalone page,
  accessed only through the account creation flow.

  Development History:
  - Written on: 4.4.25
  - Last revised on: 4.19.25
  
  Existence Rationale:
  To provide feedback to the user that their account has been created successfully and ensure they are logged out post-signup.

  Expected Input:
  `location.state` must include `{ fromCreateAcct: true }`, set via React Router `navigate`.

  Expected Output:
  - If accessed with the correct state: confirmation message and session is ended.
  - If accessed improperly: error message indicating invalid navigation.

  Future Revisions:
  - Add a redirect link to the login page.
  - Add content suggestions or featured sections to keep users engaged.
**/


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './acct_created_page.css';

const AcctCreatedPage = () => {
	const location = useLocation();
	const fromCreateAcct = location.state?.fromCreateAcct;

	useEffect(() => {
		// Always end the session when this page is loaded
		fetch('http://127.0.0.1:5000/logout', {
			method: 'POST',
			credentials: 'include',
		});
	}, []);

	if (!fromCreateAcct) {
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
			<h2>Account created successfully!</h2>
			<p>You’ve been logged out. You can now log in and start exploring.</p>
			{/* Optional: Add a link to the login page or explore content */}
		</div>
	);
};

export default AcctCreatedPage;
