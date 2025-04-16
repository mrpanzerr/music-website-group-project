/**
Author: Gaetano Panzer  
Date: 4.4.25 
Filename: create_acct_form.tsx  

Purpose:  
This module defines the `SignUpForm` presentational component, which renders the UI for the user sign-up form. It accepts props to manage user input state, display validation errors, and handle form submission.

System Context:  
Used within the account creation page as a reusable form component. It is designed to be stateless and rely entirely on props for behavior and interactivity.

Developement History:
- Written on: 4.4.25
- Last revised on: N/A

Future Extensions or Revisions:  
- Add accessibility features (ARIA tags, focus handling)  
- Include loading spinner during submission  
- Convert to a form library (like Formik or React Hook Form) if form grows
**/
import styles from './create_acct_form_styles.ts';

type SignUpFormProps = {
  email: string;
  username: string;
  password1: string;
  password2: string;
  error: { [key: string]: string };
  setEmail: (val: string) => void;
  setUsername: (val: string) => void;
  setPassword1: (val: string) => void;
  setPassword2: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

/**
Purpose:  
Renders the HTML form for account creation. Displays fields for email, username, and passwords. It also shows any error messages passed via props and triggers a submit handler.

Author: Gaetano Panzer  
Written on: 4.4.25  
Last Revised: N/A  

Call Context:  
Called as a child of `SignUp` to render the actual form interface. All data and logic is passed in as props.

System Context:  
Stateless component used purely for UI display and interaction. It relies on its parent (`SignUp`) for state and logic.

Data Structures and Algorithms:  
Destructures props to access input values, error messages, and change/submit handlers. Uses JSX to build and style the form with inline styles from `create_acct_form_styles.ts`.

Expected Input:  
All form values and handlers passed in via `SignUpFormProps`.

Possible Output:  
Renders the full sign-up form. On submission, invokes `handleSubmit`. Shows inline error messages.

Future Extensions or Revisions:  
- Modularize form fields into separate components  
- Improve responsive styling  
- Add client-side password strength meter
**/
function SignUpForm({
  email, username, password1, password2,
  error, setEmail, setUsername, setPassword1, setPassword2,
  handleSubmit
}: SignUpFormProps) {
  /**
	Purpose:  
	Helper function to render error messages conditionally below form fields.

	Author: Gaetano Panzer  
	Written on: 4.4.25  
	Last Revised: N/A  

	Call Context:  
	Used inline in JSX for each input field in `SignUpForm`.

	System Context:  
	Enables cleaner, reusable error rendering logic. Prevents repeated logic in JSX.

	Data Structures and Algorithms:  
	Accesses the `error` object using a dynamic key and returns a styled `<p>` tag if an error exists.

	Expected Input:  
	`field` - the name of the form field to check for an error string.

	Possible Output:  
	Returns a JSX `<p>` element with the error text, or `undefined` if no error exists.

	Future Extensions or Revisions:  
	- Support for multiple error types (e.g., warning, info)  
	- Animate or highlight error messages
  **/
  const renderError = (field: string) => error[field] && <p style={styles.error}>{error[field]}</p>;

  return (
    <div style={styles.signupContainer}>
      <form onSubmit={handleSubmit} style={styles.signupForm}>
        <h2 style={styles.formTitle}>Sign Up</h2>

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          {renderError('email')}
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          {renderError('username')}
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password1" style={styles.label}>Password</label>
          <input
            id="password1"
            type="password"
            placeholder="Enter your password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            style={styles.input}
          />
          {renderError('password')}
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password2" style={styles.label}>Confirm Password</label>
          <input
            id="password2"
            type="password"
            placeholder="Confirm your password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            style={styles.input}
          />
        </div>

        {renderError('api')}

        <button type="submit" style={styles.submitBtn}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;