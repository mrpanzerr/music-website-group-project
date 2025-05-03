/*
 * Author: Gaetano Panzer, Ryan Ferrel, Max Collins
 * Date: 4.19.25
 * Filename: App.tsx
 * Purpose: Defines the routing and layout for the frontend React application
 * System Context: Main entry point for routing in the client-side React app
 * Written: 4.1.25
 * Revised: 4.19.25
 * Why It Exists: Sets up the routing infrastructure and renders layout and pages based on URL paths
 * Data Structures & Algorithms: Uses React Router for client-side routing, conditional rendering for home view
 * Expected Input: URL path from browser
 * Possible Output: Renders specific components tied to routes and handles dynamic routes for artists, tracks, albums
 * Extensions/Revisions: Could include error handling for unmatched routes, use layout wrappers for nested routing, or add route protection for authenticated users
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import GetData from "./components/search_bar.tsx";
import BroadSearch from "./components/Templates/BroadSearch";
import CreateAcctPage from "../FrontEnd/create_acct_page.tsx";
import AcctCreatedPage from "../FrontEnd/acct_created_page.tsx";
import LoginPage from "../FrontEnd/login_page.tsx";
import LoggedInPage from "./components/LoginLogout/logged_in";
import LoggedOutPage from "./components/LoginLogout/logged_out";
import ArtistPage from './components/Templates/ArtistPage';
import TrackPage from './components/Templates/TrackPage';
import AlbumPage from './components/Templates/AlbumPage';
import Navbar from './components/navbar';
import UserPage from './components/Templates/UserPage';
import './App.css';


/*
 * Purpose: Layout component controls overall structure and home page behavior
 * Author: Gaetano Panzer, Ryan Ferrel, Max Collins
 * Written: 4.4.25
 * Revised: 4.19.25
 * Called From: App component, rendered inside <Router>
 * System Context: Contains header and routing logic for various paths
 * Data Use: Reads current URL path with useLocation to conditionally render home page content
 * Input: React Router path
 * Output: Layout and component views for each defined route
 * Extensions: Could separate layout into multiple nested layouts for different parts of app
 */
function Layout() {
	const location = useLocation();
	const isHome = location.pathname === "/";
	
	return(
		<div className="page-background">
			<div className="orange-border">	
				{/* Only show welcome + GetData on home */}
				<div className="navbar">
					<Navbar />
				</div>
				{isHome && (
					<header>
						<div className="page-header">
							<h1 className="sideB">Side A</h1>
							<img src="../public/images/playbackarrow.png"></img>
						</div>
						<div className="center">
							<div className="casette-base">
								<div className="casette-screw top-left"></div>
								<div className="casette-screw top-right"></div>
								<div className="casette-screw bottom-left"></div>
								<div className="casette-screw bottom-right"></div>
								<div className="casette-bottom"></div>
								<div className="casette-content">
									<h1 className="logo-text">PlayBack</h1>
									<div className="casette-underline"></div>
									<div className="casette-gap">
										<GetData />
									</div>
									<div className="casette-colorline top"></div>
									<div className="casette-colorline middle"></div>
									<div className="casette-colorline bottom"></div>
								</div>
							</div>
						</div>
						<div className="page-footer"></div>
					</header>
					)
				}
		<section>
			<Routes>
			<Route path="/" element={<div></div>} />
			<Route path="/create_acct" element={<CreateAcctPage />} />
			<Route path="/acct_created_page" element={<AcctCreatedPage />} />
			<Route path="/login_page" element={<LoginPage />} />
			<Route path="/logged_in" element={<LoggedInPage />} />
			<Route path="/logged_out" element={<LoggedOutPage />} />
			<Route path="/artist/:id" element={<ArtistPage />} />
			<Route path="/track/:id" element={<TrackPage />} />
			<Route path="/album/:id" element={<AlbumPage />} />
			<Route path="/user/:username" element={<UserPage />}/>
			<Route path="/broadsearch/:search" element={<BroadSearch />}/>
			</Routes>
		</section>
	  </div>
    </div>
  );
}

/*
 * Purpose: Main App component that initializes React Router
 * Author: Gaetano Panzer, Ryan Ferrel, Max Collins
 * Written: 4.1.25
 * Revised: 4.19.25
 * Called From: Entry point (main.tsx or index.tsx)
 * System Context: Top-level component housing the full client-side router
 * Data Use: None
 * Input: None
 * Output: Mounts the Layout component inside a Router provider
 * Extensions: Could wrap with providers (auth, theme, etc.) or error boundaries
 */
function App() {
	return (
		<Router>
			<Layout />
		</Router>
	);
}

export default App;