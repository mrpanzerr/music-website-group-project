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
