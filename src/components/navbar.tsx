import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
	const [sessionSet, setSessionSet] = useState<boolean | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Check session from Flask backend
		fetch('http://127.0.0.1:5000/check-session', {
			method: 'GET',
			credentials: 'include',
		})
			.then(res => res.json())
			.then(data => setSessionSet(data.sessionSet))
			.catch(() => setSessionSet(false));
	}, []);

	const handleLogout = () => {
		fetch('http://127.0.0.1:5000/logout', {
			method: 'POST',
			credentials: 'include',
		})
			.then(res => {
				if (res.ok) {
					setSessionSet(false); // Reflect logout in UI
					navigate('/logged_out', { state: {fromLoggedOut: true }});
				} else {
					console.log('Logout failed');
				}
			})
			.catch(() => {
				console.log('Error logging out');
			});
	};

	return (
		<nav>
			<ul>
				<li><Link to="/">Home</Link></li>

				{sessionSet === null && <li></li>}

				{sessionSet === true && (
					<li>
						<Link onClick={handleLogout}>Logout</Link>
					</li>
				)}

				{sessionSet === false && (
					<>
						<li><Link to="/create_acct">Create Account</Link></li>
						<li><Link to="/login_page">Login</Link></li>
					</>
				)}
			</ul>
		</nav>
	);
};

export default Navbar;
