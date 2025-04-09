import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './login_form';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

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
      });

      const data = await response.json();
      if (response.ok) {
        setEmail('');
        setPassword('');
        navigate('/logged_in'); // Navigate to logged_in page after successful login
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
