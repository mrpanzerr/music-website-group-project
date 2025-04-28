/**
Author: Gaetano Panzer  
Date: 4.4.25  
Filename: create_acct_form_styles.ts  

Purpose:  
Defines the inline style objects used in the SignUpForm component. This allows for centralized styling in a modular and reusable format without relying on CSS files.

System Context:  
This module is imported into `create_acct_form.tsx` and applied to form elements using React’s inline style syntax.

Developement History:
- Written on 4.4.25
- Last revised on: N/A

Data Structures and Usage:  
Exports a single object `styles` containing all relevant style definitions as JavaScript objects. These are mapped to JSX elements within the sign-up form UI.

Expected Extensions or Revisions:  
- Add responsive styles for mobile layout  
- Move to CSS modules or a styled-components system if project grows  
- Add hover/focus styles for better accessibility
**/
const styles = {
  signupContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#363333',
  },
  signupForm: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  formTitle: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  error: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default styles;
