/**
  Author: Gaetano Panzer
  Date: 4.4.25
  Filename: acct_created_page.tsx
  
  Purpose:
  This program is designed to display a message that a user has successfully signed up
  
  System Context:
  This file is part of the FrontEnd system. It contributes to the overall functionality by confirming successful account creation through a standalone confirmation page.  
  
  Development History:
  - Written on: 4.4.25
  - Last revised on: N/A
  
  Existence Rationale:
  This file exists to let user's know their account has been created
  
  Data Structures and Algorithms:
  This component does not use any complex data structures or algorithms. It is a simple presentational component rendered with React.  
  
  Expected Input:
  N/A — the page is purely presentational and expects no props or state.
  
  Possible Output:
  A page that displays successful account creating message
  
  Future Extensions or Revisions:
  - an error message that displays if a user accesses the page by means other than creating an account
  - Include a link or button to redirect users directly to the login page
 **/


import React from 'react';

const AcctCreatedPage = () => {
	return (
		<div>
			<h2>Account Created Successfully!</h2>
			<p>Your account has been created. You can now log in.</p>
		</div>
	);
};

export default AcctCreatedPage;