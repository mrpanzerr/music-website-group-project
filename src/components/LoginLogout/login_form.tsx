/**
Author: Gaetano Panzer  
Date: 4.6.25  
Filename: login_form.tsx  

Purpose:  
This file defines the `LoginForm` component, which renders a login form for users to input their email and password. It also handles rendering error messages related to input validation or API responses. Upon form submission, the component invokes the `handleSubmit` method passed from its parent component to process the login request.

System Context:  
The `LoginForm` component is part of the FrontEnd system, used in the login page. It is a child of the `Login` container component, where state management and form submission logic are handled. The `LoginForm` is responsible for rendering the UI, accepting user inputs, and displaying error messages.

Development History:  
- Written on: 4.6.25  
- Last revised on: N/A  

Existence Rationale:  
This component encapsulates the logic for rendering the login form, separating the presentation (UI) from the functional logic that handles state management and API interaction. It ensures that the login form is reusable and maintainable while keeping the UI logic simple and focused.

Data Structures and Algorithms:  
- Uses `props` for managing the email, password, error state, and handler functions.
- Implements a helper function `renderError` to dynamically display error messages next to form fields.
- Applies styles defined in `create_acct_form_styles.ts`.

Expected Input:  
- `email`: The user's email address as a string.
- `password`: The user's password as a string.
- `error`: An object containing error messages for form fields or API responses.
- `setEmail`: A function to update the email state.
- `setPassword`: A function to update the password state.
- `handleSubmit`: A function to handle the form submission event.

Possible Output:  
- Renders the login form with inputs for email and password.
- Displays any error messages next to the relevant input fields.
- Calls the `handleSubmit` function passed from the parent component to process the login request.

Future Extensions or Revisions:  
- Add "remember me" functionality to store user credentials locally.
- Improve error handling by providing more specific feedback for API failures.
- Implement additional accessibility features, such as role attributes for error messages.
**/
import React from 'react';
import styles from '../CreateAccount/create_acct_form_styles.ts';

type LoginFormProps = {
  email: string;
  password: string;
  error: { [key: string]: string };
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

function LoginForm({
  email, password, error, setEmail, setPassword, handleSubmit
}: LoginFormProps) {

    /**
	  Method: renderError  
	  Author: Gaetano Panzer  
	  Date: 4.6.25  

	  Purpose:  
	  This helper function checks if an error exists for a given field and, if so, returns a styled paragraph element displaying the corresponding error message.

	  System Context:  
	  Called within the `LoginForm` JSX to conditionally render field-specific error messages directly beneath input fields. It keeps error rendering logic modular and reusable.

	  Development History:  
	  - Written on: 4.6.25  
	  - Last revised on: N/A  

	  Existence Rationale:  
	  Exists to abstract repetitive error message rendering, enhancing code readability and avoiding redundancy within the JSX layout.

	  Data Structures and Algorithms:  
	  Accesses the `error` object passed in via props and uses bracket notation to retrieve messages for specific keys. Uses a simple conditional check.

	  Expected Input:  
	  - `field`: A string representing the field name (e.g., "email" or "password").

	  Possible Output:  
	  - Returns a styled JSX paragraph element if an error exists for the given field.
	  - Returns `undefined` (i.e., renders nothing) if there is no error.

	  Future Extensions or Revisions:  
	  - Add accessibility attributes (e.g., `aria-live`) for screen reader support.
	  - Add support for displaying multiple errors per field, if needed.
  **/
  const renderError = (field: string) => error[field] && <p style={styles.error}>{error[field]}</p>;

  return (
    <div style={styles.signupContainer}>
      <form onSubmit={handleSubmit} style={styles.signupForm}>
        <h2 style={styles.formTitle}>Login</h2>

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
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {renderError('password')}
        </div>

        {renderError('api')}

        <button type="submit" style={styles.submitBtn}>Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
