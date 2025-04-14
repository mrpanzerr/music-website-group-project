import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import GetData from "./components/search_bar.tsx";
import CreateAcctPage from "../FrontEnd/create_acct_page.tsx";
import AcctCreatedPage from "../FrontEnd/acct_created_page.tsx";
import LoginPage from "../FrontEnd/login_page.tsx";
import LoggedInPage from "./components/LoginLogout/logged_in";
import LoggedOutPage from "./components/LoginLogout/logged_out";
import ArtistPage from './components/Templates/ArtistPage';
import TrackPage from './components/Templates/TrackPage';
import AlbumPage from './components/Templates/AlbumPage';


// Landing Page
function Layout() {
	const location = useLocation();
	const isHome = location.pathname === "/";
	
	return(
		<div>		
			{/* Only show welcome + GetData on home */}
			{isHome && (
				<header>
					<h1>Welcome to PlayBack!</h1>
					<p>Your uninhibited music journey</p>
					<GetData />
				</header>
				)
			}
			{/* Always show nav */}
			<nav>
				<ul>
					<li><Link to="/">Home</Link></li>
					{/* if user is logged in display logout */}
					{/* if user is not logged in display create account and login */}
					<li><Link to="/create_acct">Create Account</Link></li>
					<li><Link to="/login_page">Login</Link></li>
				</ul>
			</nav>
	
	<section>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/create_acct" element={<CreateAcctPage />} />
          <Route path="/acct_created_page" element={<AcctCreatedPage />} />
          <Route path="/login_page" element={<LoginPage />} />
          <Route path="/logged_in" element={<LoggedInPage />} />
		  <Route path="/logged_out" element={<LoggedOutPage />} />
		  <Route path="/artist/:id" element={<ArtistPage />} />
		  <Route path="/track/:id" element={<TrackPage />} />
		  <Route path="/album/:id" element={<AlbumPage />} />
		  {/* <Route path="/album/:id" element={<AlbumPage />} /> */}
        </Routes>
      </section>
    </div>
  );
}

function App() {
	return (
		<Router>
			<Layout />
		</Router>
	);
}

export default App;