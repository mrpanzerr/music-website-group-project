import { useState } from 'react';

function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({}); // Reset any previous errors

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(errors);
	  setPassword1('');
	  setPassword2('');
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password: password1 }),
      });

      const data = await response.json();
      if (response.ok) {
        // this will be changed to redirect to the signed in page
		
		// Successfully signed up
        console.log('User signed up:', data);
        // Clear the password fields after successful signup
        setPassword1('');
        setPassword2('');
		console.log("Success");
      } else {
        setError({ api: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      setError({ api: 'Network error, please try again later.' });
    }
  };

  const validateForm = (): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    if (!email) errors.email = 'Please enter an email address';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      errors.email = 'Please enter a valid email address';
    if (!username) errors.username = 'Username is required';
    if (!password1 || !password2) errors.password = 'Please enter the password twice';
    else if (password1 !== password2) errors.password = "Passwords don't match";
    return errors;
  };

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
          {renderError('password') && password1 !== password2 && (
            <p style={styles.error}>Passwords don't match</p>
          )}
        </div>

        {renderError('api')}

        <button type="submit" style={styles.submitBtn}>Sign Up</button>
      </form>
    </div>
  );
}

const styles = {
  signupContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
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

export default SignUp;
