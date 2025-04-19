/**
Author: Gaetano Panzer  
Date: 4.4.25  
Filename: create_acct.tsx  

Purpose:  
This file defines the SignUp component, which handles user input and logic for signing up a new account.  

System Context:  
This component is part of the FrontEnd system. It manages form state and validation, communicates with the backend API to create a new user, and routes the user to the appropriate page after signup.  

Development History:  
- Written on: 4.4.25  
- Last revised on: N/A  

Existence Rationale:  
This component exists to encapsulate the signup functionality and logic, separating form handling and user feedback from presentation logic.  

Data Structures and Algorithms:  
Uses React state hooks to manage form inputs and errors.  
Implements a simple validation function to ensure user input correctness before making API requests.  

Expected Input:  
User-provided email, username, and password entries via a form.  

Possible Output:  
- A successful account creation followed by navigation to a confirmation page.  
- Error messages rendered on invalid or failed submissions.  

Future Extensions or Revisions:  
- Add client-side password strength meter.  
- Enhance API error handling with more detailed feedback.  
- Add loading state during API request.  
**/

// Import necessary hooks and components from React and React Router
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from './create_acct_form.tsx';

/**
Purpose:  
Defines the `SignUp` component, which handles the logic and state for a user creating a new account. It connects form state, validation, and submission with navigation logic upon success.

Author: Gaetano Panzer  
Written on: 4.4.25  
Last Revised: N/A  

Call Context:  
Rendered as a child component in CreateAcctPage. The `SignUp` component wraps and manages the form logic before passing it to `SignUpForm`.

System Context:  
Part of the frontend account creation flow. This component connects form input with backend API and user feedback/navigation.

Data Structures and Algorithms:  
Uses React state hooks to store form values and errors. Implements basic synchronous validation logic before sending a POST request.

Expected Input:  
None (React renders the component). It manages all user input internally through controlled inputs.

Possible Output:  
Renders `SignUpForm` and passes state props. Navigates to the success page upon successful sign-up or shows validation/API errors.

Future Extensions or Revisions:  
- Add loading indicators
- Improve error feedback (e.g., field-specific API errors)
- Integrate with form libraries like React Hook Form for better validation
**/
function SignUp() {
  // State hooks for form inputs and error handling
  const [email, setEmail] = useState(''); // Stores the email input value
  const [username, setUsername] = useState(''); // Stores the username input value
  const [password1, setPassword1] = useState(''); // Stores the first password input value
  const [password2, setPassword2] = useState(''); // Stores the second password input value (for confirmation)
  const [error, setError] = useState<{ [key: string]: string }>({}); // Stores any form validation errors
  
  // useNavigate hook for navigation after successful signup
  const navigate = useNavigate();

  /**
	Purpose:  
	Handles the form submission event. Validates user inputs and sends a POST request to create a new account. Navigates to the success page on success.

	Author: Gaetano Panzer  
	Written on: 4.4.25  
	Last Revised: N/A  

	Call Context:  
	Triggered by the `onSubmit` prop in `SignUpForm`.

	System Context:  
	Supports the account creation flow in the frontend by validating user data and communicating with the backend signup API.

	Data Structures and Algorithms:  
	Uses object-based error mapping for validation. Sends data using the Fetch API and handles JSON responses from the backend.

	Expected Input:  
	A form event (`React.FormEvent`) from the submit action.

	Possible Output:  
	On success: navigates user to account confirmation page.  
	On failure: shows inline validation or server error messages.

	Future Extensions or Revisions:  
	- Display field-specific backend validation errors  
	- Add retry logic or debounce
  **/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError({}); // Reset any previous errors when the form is submitted

    // Validate the form data before making an API request
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(errors); // Set the validation errors if any are found
      setPassword1(''); // Clear both password fields on error to prompt the user to re-enter passwords
      setPassword2('');
      return; // Stop further processing if validation fails
    }

    // If validation passes, try to make the API request to create the account
    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: 'POST', // POST request to signup endpoint
		credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
        body: JSON.stringify({ email, username, password: password1 }), // Send the form data as JSON
      });

      // Parse the response data
      const data = await response.json();
	  
	  const sessionResponse = await fetch("http://127.0.0.1:5000/check-session", {
		  method: "GET",
		  credentials: "include", // Important to include cookies (session)
		});
	  
	  const sessionData = await sessionResponse.json();
	  if (sessionData.logged_in) {
		console.log("User is logged in:", sessionData.username);
	  } else {
		console.log("user is not logged in");
	  }
	  
      if (response.ok) {
        // If the response is OK, clear the password fields and navigate to the account created page
        setPassword1('');
        setPassword2('');
        navigate('/acct_created_page'); 
      } else {
        // If the response is not OK, set the error message from the API response
        setError({ api: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      // Catch any network errors and display an appropriate message
      setError({ api: 'Network error, please try again later.' });
    }
  };

  /**
	Purpose:  
	Performs basic frontend validation on the sign-up form fields, such as checking for required fields and matching passwords.

	Author: Gaetano Panzer  
	Written on: 4.4.25  
	Last Revised: N/A  

	Call Context:  
	Called within `handleSubmit` before attempting to submit form data to the backend.

	System Context:  
	Ensures that only valid data is sent to the backend API. Provides early feedback to the user if form input is incorrect or incomplete.

	Data Structures and Algorithms:  
	Uses a plain JavaScript object (`errors`) to collect and return any validation errors. Includes a regular expression for email format checking.

	Expected Input:  
	None (accesses the state variables `email`, `username`, `password1`, and `password2` directly).

	Possible Output:  
	Returns an object containing key-value pairs for any invalid fields. If the object is empty, the form is considered valid.

	Future Extensions or Revisions:  
	- Add more sophisticated password rules  
	- Support optional fields or multi-step validation
  **/
  const validateForm = (): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    // Basic validation for email (required and valid format)
    if (!email) errors.email = 'Please enter an email address';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      errors.email = 'Please enter a valid email address';
    // Check for a non-empty username
    if (!username) errors.username = 'Username is required';
    // Check for password presence and matching passwords
    if (!password1 || !password2) errors.password = 'Please enter the password twice';
    else if (password1 !== password2) errors.password = "Passwords don't match";
    return errors; // Return the errors object
  };

  // Return the SignUpForm component with the necessary props
  return (
    <SignUpForm
      email={email}
      username={username}
      password1={password1}
      password2={password2}
      error={error}
      setEmail={setEmail}
      setUsername={setUsername}
      setPassword1={setPassword1}
      setPassword2={setPassword2}
      handleSubmit={handleSubmit}
    />
  );
}

// Export the SignUp component for use in other parts of the app
export default SignUp;
