//start point of site, gonna let yall figure this out
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GetData from "./components/search_bar.tsx";
import SignUp from "./components/CreateAccount/create_acct.tsx";
import CreateAcctPage from "./FrontEnd/create_acct_page.tsx";
import AcctCreated from "./components/CreateAccount/acct_created.tsx";

//Currently all it does is displays the ul from updated_search component
// This should be contain the landing page. the landing page will contain links to the rest of the site.
function App() {

  return (
	<Router>
		<div>
			{/* Landing Page Content */}
			<header>
				<h1>Welcome to PlayBack!</h1>
				<p>Your uninfluenced music journey.</p>
				<nav>
				  {/* Navigation links */}
				  <ul>
					<li>
					  <Link to="/">Home</Link>
					</li>
					<li>
					  <Link to="/create_acct">Create Account</Link>
					</li>
				  </ul>
				</nav>
			  </header>

			  {/* Components for account creation and search bar */}
			  <section>
				<Routes>
					<Route path="/" element={null} /> // path='/' is needed to establish the root 
					<Route path="/acct_created" element={<AcctCreated />} /> // can successfully route to other pages. 
					<Route path="create_acct" element={<CreateAcctPage />} />
				</Routes>
			  </section>
		</div>
	</Router>
  )
}

export default App;