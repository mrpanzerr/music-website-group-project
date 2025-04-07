//start point of site, gonna let yall figure this out
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GetData from "./components/search_bar.tsx";
import CreateAcctPage from "./FrontEnd/create_acct_page.tsx";
import AcctCreatedPage from "./FrontEnd/acct_created_page.tsx";

// Currently all it does is displays the ul from updated_search component
// function App() {
function App() {
  return (
    <Router>
      <div>
        {/* Landing Page Content */} 
		<header>
			<h1>Welcome to PlayBack!</h1>
			<p>Your uninfluenced music journey.</p>
			<GetData />
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

        <section>
          <Routes>
            <Route path="/" element={null} />
            <Route path="/create_acct" element={<CreateAcctPage />} />
            <Route path="/acct_created_page" element={<AcctCreatedPage />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;