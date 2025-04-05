import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from './create_acct_form.tsx';

function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<{ [key: string]: string }>({});
  
  const navigate = useNavigate();

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
        setPassword1('');
        setPassword2('');
		navigate('/acct_created');
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

export default SignUp;
