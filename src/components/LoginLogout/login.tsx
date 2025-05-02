/**
Author: Gaetano Panzer  
Date: 4.6.25  
Filename: login.tsx  

Purpose:  
This file defines the `Login` component, which manages the login process for the user, including form validation, handling errors, and submitting login credentials to the backend API.

System Context:  
This component is part of the FrontEnd system. It interacts with the backend login API, handles form state (email, password), and performs basic validation before submission. Upon successful login, the user is redirected to the logged-in page.

Development History:  
- Written on: 4.6.25  
- Last revised on: N/A  

Existence Rationale:  
This component encapsulates the logic and UI for user login, separating the form and validation logic from the main application, and ensuring the correct handling of login credentials and errors.

Data Structures and Algorithms:  
Uses React state hooks to manage form input (email, password) and error messages.  
Implements a basic validation function to check the completeness of user input before sending it to the backend.  
Handles the asynchronous login API request with error handling for network issues and API responses.

Expected Input:  
- User-provided email and password via a form.

Possible Output:  
- Successful login leads to redirection to the logged-in page (`/logged_in`).
- Error messages are displayed for validation failures or API errors (e.g., incorrect credentials or network issues).

Future Extensions or Revisions:  
- Enhance validation with more robust checks (e.g., email format validation, password strength requirements).  
- Integrate session management or token-based authentication.  
- Improve error handling with more detailed messages for different error scenarios (e.g., incorrect credentials, account locked).  
**/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './login_form';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  /**
	Method: handleSubmit

	Purpose:  
	This method handles the form submission process when the user attempts to log in. It performs basic validation checks on the user inputs (email and password), and if the inputs are valid, it submits the login request to the backend API. Upon successful login, the user is redirected to the `/logged_in` page. If any errors occur, such as invalid inputs or a failed API request, the method updates the error state to provide feedback to the user.

	Who wrote it:  
	Gaetano Panzer

	Date:  
	Written on: 4.6.25  
	Last revised on: N/A

	When/Where called:  
	This method is called when the user submits the login form. The `onSubmit` event handler for the login form triggers this method.

	System Context:  
	This method is part of the Login component and is a crucial part of the authentication process. It is responsible for interacting with the backend API to authenticate the user and provide feedback based on the response.

	How it uses its data structures and algorithms:  
	- Uses the `email` and `password` state variables to retrieve user inputs.
	- Uses the `setError` state updater to display validation or API error messages.
	- Submits a POST request with the login credentials to the backend and processes the response.

	Expected Input:  
	- `e` (React.FormEvent): The form submission event triggered by the user.
	- `email` and `password` values from the component’s state.

	Expected Output:  
	- If validation passes and login is successful, redirects to the `/logged_in` page.
	- If login fails (wrong credentials or server error), displays an appropriate error message.
	- If there is a network issue, displays a network error message.

	Future Extensions or Revisions:  
	- Implement multi-factor authentication (MFA).
	- Add loading spinner or loading state during the API request.
	- Improve error handling to provide more specific feedback from the backend.

  **/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({}); // Clear previous errors

    // Simple validation check
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
		credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        setEmail('');
        setPassword('');
        navigate('/logged_in', { state: { fromLogin: true }}); // Navigate to logged_in page after successful login
      } else {
        setError({ api: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      setError({ api: 'Network error, please try again later.' });
    }
  };

  /**
	Method: validateForm

	Purpose:  
	This method validates the form inputs before submission by checking if the email and password fields are filled. If any field is empty, it returns an error object with appropriate error messages for each field. The method ensures that the user provides the required information before proceeding with the login attempt.

	Who wrote it:  
	Gaetano Panzer

	Date:  
	Written on: 4.6.25  
	Last revised on: N/A

	When/Where called:  
	This method is called by the `handleSubmit` method to validate the email and password before submitting the login request.

	System Context:  
	This method is part of the Login component. It plays a key role in ensuring that the form submission is only processed if the user has provided the necessary input.

	How it uses its data structures and algorithms:  
	- Uses `email` and `password` state variables to access the user inputs.
	- Constructs an `errors` object to store validation messages.
	- Returns the `errors` object to the `handleSubmit` method for further handling.

	Expected Input:  
	- The `email` and `password` values from the component’s state.

	Expected Output:  
	- An object containing validation error messages (e.g., `email`, `password`), if any. If both fields are filled, the object will be empty.

	Future Extensions or Revisions:  
	- Enhance validation with regex checks for email format and password strength.
	- Extend validation logic to include password confirmation for additional security.
  **/
  const validateForm = (): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    if (!email) errors.email = 'Please enter an email address';
    if (!password) errors.password = 'Please enter a password';
    return errors;
  };

  return (
    <LoginForm
      email={email}
      password={password}
      error={error}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
}

export default Login;
