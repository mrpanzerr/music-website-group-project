/**
Author: Gaetano Panzer  
Date: 4.4.25  
Filename: login_page.tsx  

Purpose:  
This file renders the Login component, allowing users to enter their credentials and access their accounts.  

System Context:  
This file is part of the FrontEnd system. It contributes by serving as the route-level login page, displaying the login form and initiating the login process.  

Development History:  
- Written on: 4.4.25  
- Last revised on: N/A  

Existence Rationale:  
This file exists to present the login form to users within the proper layout and routing context.  

Data Structures and Algorithms:  
No data structures or algorithms are directly used. The component imports and displays the Login component.  

Expected Input:  
N/A — this page itself takes no input. All input handling is managed within the Login component.  

Possible Output:  
A login form allowing the user to input credentials.  

Future Extensions or Revisions:  
- N/A  
**/
import Login from '../src/components/LoginLogout/login.tsx';

const LoginPage = () => {
	return (
		<div>
			<Login />
		</div>
	);
};

export default LoginPage;