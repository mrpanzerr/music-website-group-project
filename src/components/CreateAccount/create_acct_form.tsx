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

function SignUpForm({
  email, username, password1, password2,
  error, setEmail, setUsername, setPassword1, setPassword2,
  handleSubmit
}: SignUpFormProps) {
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