//start point of site, gonna let yall figure this out
import GetData from "./components/search_bar.tsx";
import SignUp from "../FrontEnd/create_acct.tsx";

//Currently all it does is displays the ul from updated_search component
function App() {

  return (
	<div>
		<GetData />
		<SignUp />
	</div>
  )
}

export default App;