/**
 Author: Gaetano Panzer
 Styling: Max Collins
 Date: 4.19.25
 Filename: Navbar.tsx
 
 Purpose: Renders the navigation bar component for the frontend UI
 
 System Context: Part of the React frontend of the web application, manages session-based navigation
 
 Written: 4.19.25
 Revised: 4.19.25
 
 Why It Exists: Provides navigation links that change dynamically based on user login session status
 
 Data Structures & Algorithms: Uses useState for session state and useEffect for side effect to check session
 Expected Input: None directly; responds to backend session state
 
 Possible Output: Displays links for navigation based on session (Home, Login, Logout, Create Account)
 
 Extensions/Revisions: Could include profile link, admin logic, or use context API for broader session state
 **/

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
	const [sessionSet, setSessionSet] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Check session from Flask backend
		fetch('http://127.0.0.1:5000/check-session', {
			method: 'GET',
			credentials: 'include',
		})
			.then(res => res.json())
			.then(data => setSessionSet(data.sessionSet))
			.catch(() => setSessionSet(''));
	}, []);

	/*
	 * Purpose: Handles logging the user out by calling the backend and updating session state
	 * Author: Gaetano Panzer
	 * Written: 4.19.25
	 * Revised: 4.19.25
	 * Called From: onClick event on Logout link
	 * System Context: Tied to user session state and navigation
	 * Data Use: Updates sessionSet and uses useNavigate to redirect
	 * Input: None (except from event trigger)
	 * Output: UI changes state and navigates to logged_out route
	 * Extensions: Could be moved to a shared auth context or service module
	 */
	const handleLogout = () => {
		fetch('http://127.0.0.1:5000/logout', {
			method: 'POST',
			credentials: 'include',
		})
			.then(res => {
				if (res.ok) {
					setSessionSet(''); // Reflect logout in UI
					navigate('/logged_out', { state: {fromLogout: true }});
				} else {
					console.log('Logout failed');
				}
			})
			.catch(() => {
				console.log('Error logging out');
			});
	};

	return (
		<nav className="navbar">
			<ul className="buttons">
				<li className="home"><Link to="/">PlayBack</Link></li>

				{sessionSet === null && <li></li>}

				{sessionSet != '' && (
					<div className="loggedin-buttons">
						<li className="signup">
							<Link to={`/user/${sessionSet}`}>{sessionSet}</Link>
						</li>
						<li className="log">
							<Link onClick={handleLogout}>Logout</Link>
						</li>
					</div>
				)}

				{sessionSet === '' && (
					<div className="loggedout-buttons">
						<li className="signup"><Link to="/create_acct">Sign Up</Link></li>
						<li className="log"><Link to="/login_page">Login</Link></li>
					</div>
				)}
			</ul>
			<div className="line"></div>
		</nav>
	);
};

export default Navbar;
