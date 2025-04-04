//start point of site, gonna let yall figure this out
import GetData from "./components/search_bar.tsx";
import SignUp from "./components/CreateAccount/create_acct.tsx";
import CreateAccountPage from "../FrontEnd/create_acct_page.tsx";

//Currently all it does is displays the ul from updated_search component
// This should be contain the landing page. the landing page will contain links to the rest of the site.
function App() {

  return (
	<div>
		{/* Landing Page Content */}
		<header>
			<h1>Welcome to PlayBack!</h1>
			<p>Your uninfluenced music journey.</p>
			<nav>
			  {/* Navigation links */}
			  <ul>
				<li>
				  <p>soon</p>
				</li>
				<li>
				  <p>soon</p>
				</li>
				<li>
				  <p>soon</p>
				</li>
			  </ul>
			</nav>
		  </header>

		  {/* Components for account creation and search bar */}
		  <section>
			<GetData />
			<CreateAccountPage />
		  </section>
	</div>
  )
}

export default App;