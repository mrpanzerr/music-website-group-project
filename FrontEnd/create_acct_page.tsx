/**
Author: Gaetano Panzer  
Date: 4.4.25  
Filename: create_acct_page.tsx  

Purpose:  
This program renders the SignUp component, which allows a user to create a new account.  

System Context:  
This file is part of the FrontEnd system. It contributes to the overall functionality by serving as the route-level page that displays the account creation form to the user.  

Development History:  
- Written on: 4.4.25  
- Last revised on: N/A  

Existence Rationale:  
This file exists as a wrapper to render the account creation form component (create_acct.tsx) in the correct location of the application.  

Data Structures and Algorithms:  
No complex data structures or algorithms are used. This file simply imports and renders a React component.  

Expected Input:  
N/A — this page does not take any input directly.  

Possible Output:  
A rendered SignUp form that allows the user to enter their account details.  

Future Extensions or Revisions:  
- Add authentication state checks to redirect already-logged-in users.  
- Include additional messaging or onboarding flow before or after account creation.  
**/

import SignUp from '../src/components/CreateAccount/create_acct.tsx';

const CreateAcctPage = () => {
	return (
		<div>
			<SignUp /> {/* renders the signup form. file is called create_acct.tsx */}
		</div>
	);
};

export default CreateAcctPage;