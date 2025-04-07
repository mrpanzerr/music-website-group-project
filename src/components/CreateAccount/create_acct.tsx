// Import necessary hooks and components from React and React Router
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from './create_acct_form.tsx';

// SignUp functional component to handle user signup process
function SignUp() {
  // State hooks for form inputs and error handling
  const [email, setEmail] = useState(''); // Stores the email input value
  const [username, setUsername] = useState(''); // Stores the username input value
  const [password1, setPassword1] = useState(''); // Stores the first password input value
  const [password2, setPassword2] = useState(''); // Stores the second password input value (for confirmation)
  const [error, setError] = useState<{ [key: string]: string }>({}); // Stores any form validation errors
  
  // useNavigate hook for navigation after successful signup
  const navigate = useNavigate();

  // handleSubmit function to process the form submission
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
        headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
        body: JSON.stringify({ email, username, password: password1 }), // Send the form data as JSON
      });

      // Parse the response data
      const data = await response.json();
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

  // validateForm function to check for validation issues with the form data
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
