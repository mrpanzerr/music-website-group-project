/**
 Author: Gaetano Panzer
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
