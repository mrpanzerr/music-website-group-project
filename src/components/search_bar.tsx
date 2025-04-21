/*
  Author: Ryan Ferrel
  Date: 4.3.25
  Filename: search_bar.tsx
  
  Purpose: Search component for querying music data by artist, track, or album.
  
  System Context: React front-end; communicates with Flask back-end on localhost:5000.
  
  Written: 4.3.25
  Revised: 4.7.25
  
  Description: User inputs a search term and selects a type (artist, track, album). 
               Fetches data from the backend and displays results, linking to dynamic pages.
  
  Data Structures & Algorithms: useState to store array of results. useEffect to auto-trigger fetch.
  
  Expected Input: A search string and a selected type via UI.
  
  Output: Fetched data rendered in a styled list with navigation.
  
  Expected Extensions: Add loading state, debounce search, or integrate Spotify API auth.
*/

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GetData() {
    const [data, setData] = useState<{ name: string, image: string, type: string, artist: string[], id: string, album: string }[]>([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("artist");
	const navigate = useNavigate();

	/*
      Method: handleClick  
      Author: Ryan Ferrel  
      Date: 4.3.25  

      Purpose:  
      Updates the current search type (artist, track, album) based on user selection.

      Called By:  
      Triggered by clicking one of the three type buttons in the UI.

      System Context:  
      Part of the React front-end UI interaction logic.

      Data Structures & Algorithms:  
      Simple state update using useState hook.

      Expected Input:  
      Click event from button elements with IDs representing search types.

      Output:  
      Updates the `type` state to reflect the chosen category.

      Expected Extensions:  
      Potential to add active state styling or debounce rapid clicks.
    */
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(`Setting type to: ${e.currentTarget.id}`);
        setType(e.currentTarget.id);
    };

	/*
      Method: handleSearch  
      Author: Ryan Ferrel  
      Date: 4.3.25  

      Purpose:  
      Sends a POST request to the backend to retrieve music data based on
      the current search string and selected type.

      Called By:  
      Triggered by search button click or form submission.

      System Context:  
      React front-end; communicates with Flask API at localhost:5000.

      Data Structures & Algorithms:  
      Fetch API for POST request; useState for storing results.

      Expected Input:  
      JSON object: { search: string, type: string }

      Output:  
      Updates `data` state with response from back-end, which is then rendered.

      Expected Extensions:  
      Add loading indicators, error handling UI, or debounce logic.
    */
    const handleSearch = () => {
        console.log(`Searching for: ${search} of type: ${type}`);
        // Perform the fetch request when the search button is clicked
        fetch("http://127.0.0.1:5000/search", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search: search, type: type })
        }).then(res => res.json()).then(
            responseData => {
                console.log('Fetched data:', responseData); // Log the fetched data
                setData(responseData);
            }
        ).catch(error => {
            console.error('Error fetching data:', error); // Catch and log errors
        });
    };

	/*
      Method: useEffect (Auto-Search Trigger)  
      Author: Ryan Ferrel  
      Date: 4.3.25  

      Purpose:  
      Automatically triggers search when `search` or `type` state changes.

      Called By:  
      React lifecycle — runs after render when dependencies change.

      System Context:  
      Helps ensure data stays synced to user input without needing manual resubmission.

      Data Structures & Algorithms:  
      React hook; dependent on `search` and `type` values.

      Expected Input:  
      Changes to `search` or `type` state values.

      Output:  
      Calls handleSearch if search input is not empty.

      Expected Extensions:  
      Add conditional logic for debounce or validation.
    */
    useEffect(() => {
        // This is optional, but we can ensure the search automatically happens on `search` or `type` change
        if (search.trim() !== "") {
            console.log(`Automatically searching due to change in search or type.`);
            handleSearch();
        }
    }, [search, type]);
	
	/*
      Method: handleResultClick  
      Author: Ryan Ferrel  
      Date: 4.3.25  

      Purpose:  
      Navigates the user to a dynamic page based on result type (artist, track, or album).

      Called By:  
      OnClick event for each search result item in the list.

      System Context:  
      Uses React Router to change page based on selected result.

      Data Structures & Algorithms:  
      Simple conditionals for routing; uses React Router's `navigate` function.

      Expected Input:  
      A result item's `id` and `type`.

      Output:  
      Navigates to the appropriate dynamic route.

      Expected Extensions:  
      Could extend to include genres or playlists in the future.
    */
	const handleResultClick = (id: string, type: string) => {
		// Redirect to the respective page based on the type and id
		if (type === "artist") {
            navigate(`/artist/${id}`);
        } else if (type === "track") {
            navigate(`/track/${id}`);
        } else if (type === "album") {
            navigate(`/album/${id}`);
        }
	};

    return (
        <>
            <button id="artist" onClick={handleClick}>Artist</button>
            <button id="track" onClick={handleClick}>Track</button>
            <button id="album" onClick={handleClick}>Album</button>
            <button id="submit" onClick={handleSearch}>Search</button>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <input 
                    type="text" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search for music..." 
                />
            </form>
            <ul className="list-group">
                {data && data.map((item, index) => (
					<li
						key={index}
						className="list-group-item"
						onClick={() => handleResultClick(item.id, item.type)}
						style={{
							cursor: 'pointer',  // Pointer cursor on hover to indicate clickability
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '8px'
						}}
					>
						<div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <img
                                src={item.type === "track" ? item.album : item.image}
                                alt={`${item.name} image`}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover', // Ensures images are cropped correctly
                                    borderRadius: '5px',
                                    marginRight: '10px'
                                }}
                            />
                            <div>
                                <strong>{item.name}</strong>
                                {item.type === 'track' && <p>by {item.artist.join(', ')}</p>}
                            </div>
						</div>
					</li>
                ))}
            </ul>
        </>
    );
}
