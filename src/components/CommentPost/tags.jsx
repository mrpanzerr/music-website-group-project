/**
 * Filename: TagSection.jsx
 * Author: Ryan
 * Date: 5.1.25
 * Purpose: This React component allows authenticated users to select and assign a "vibe" (tag) to a song.
 * It fetches tag data for a given song and lets users update it through interactive emoji selections.
 * Location in System: This component is part of the music reflection and interaction interface
 * within the PlayBack web application. It appears on the music details view page.
 * Creation/Revisions: Created on 5.1.25. Subject to revision for performance, styling, or API adjustments.
 * Reason for Existence: Enables user engagement with music using non-textual sentiment tags, enhancing
 * personal reflection and community understanding.
 * Data Structures/Algorithms: Utilizes React state hooks to store and update tag states, and fetch API
 * for communication with the backend Flask server.
 * Input: The URL segment representing the song ID, user interaction with tag icons.
 * Output: Updated tag counts and the user's current selected tag visually marked.
 * Extensions: Could be extended to include animations, additional tags, or user-generated tags.
 */
import { useState, useEffect} from 'react'
import checkSession from "./session.jsx"

/**
 * TagSection()
 * Author: Ryan
 * Date: 5.1.25
 * Purpose: Renders a list of "vibe" tags users can apply to a song. Controls UI updates
 * and API communication for getting and setting tag data.
 * Called: Automatically rendered within the song detail page of PlayBack.
 * Usage: Manages state for selected tag, retrieves existing tag data, allows user updates.
 * Input: DOM click events, URL for song ID.
 * Output: UI updates with tag counts and visual state, sends/receives JSON from backend.
 * Extensions: Add animation, more advanced tag management (e.g., removing/changing tags).
 */
export default function TagSection() {
    const [data,setData] = useState({})
    const [current,setCurrent] = useState('')
    const [usertag,setUserTag] = useState('')

    const full_url = window.location.href;
    const url_segments = full_url.split('/');
    const last_segment = url_segments.pop();

    /**
     * handleClick(e)
     * Author: Ryan
     * Date: 5.1.25
     * Purpose: Handles user click on a tag icon. Verifies user session and updates selected tag.
     * Called: When a user clicks on any <li> tag icon.
     * Data Use: Uses DOM classNames and session status, updates `current` state.
     * Input: Event object `e` from click listener.
     * Output: Visually marks selected tag and prepares for state update.
     * Extensions: Add hover previews, animation, or tooltip display.
     */
    const handleClick = (e) => {
        checkSession().then(session => {
            if (session != '') {
                const className = e.target.parentElement.className;
                setCurrent(className)
                console.log(e.target.className)
                document.querySelectorAll('#current').forEach(element => element.removeAttribute('id'));
            document.querySelector(`.${className}`).id = 'current';
            }else {
                alert("You must be signed in to add a vibe")
            }
        })
    }
    // useEffect(() => {
    //     fetch("http://127.0.01:5000/createtag", {
    //         method: "POST",
    //         credentials: "include",
    //         headers : {"Content-Type" : "application/json"},
    //         body : JSON.stringify({tag: current, song : last_segment, user : 50}),
    //     });
    //     console.log(current)
    // },[current])
     /**
     * updateTagData()
     * Author: Ryan
     * Date: 5.1.25
     * Purpose: Sends selected tag to server and retrieves updated tag counts.
     * Called: Whenever `current` tag state changes.
     * Data Use: Uses `current` and `last_segment` as song/tag IDs. Updates `data` state.
     * Input: Uses internal component state.
     * Output: Updates visual count of tags on the UI.
     * Extensions: Could support tag removal or tag history.
     */
    const updateTagData = async () => {
        try {
            await fetch("http://127.0.0.1:5000/createtag", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tag: current, songID: last_segment,}),
            });
            
            const response = await fetch("http://127.0.0.1:5000/gettags", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ songID: last_segment, userID: 50 }),
            });

            const responseData = await response.json();
            setData(responseData);
        } catch (error) {
            console.error("Error updating tags:", error);
        }
    };

    /**
     * useEffect() - Initial Data Fetch
     * Author: Ryan
     * Date: 5.1.25
     * Purpose: Fetches current tag data from backend when component mounts.
     * Called: Automatically by React on first render.
     * Data Use: Updates `data` and highlights user’s current tag visually.
     * Input: Song ID from URL.
     * Output: DOM update of tag counts and highlighted current tag.
     * Extensions: Retry on failure, loading states, skeletons.
     */
    useEffect(() => {
        fetch("http://127.0.0.1:5000/gettags", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({songID: last_segment}),
        })
        .then(response => response.json())
        .then(responseData => {
            setData(responseData);
            setUserTag(responseData.exists);
            console.log(usertag)
            const element = document.querySelector(`.${responseData.exists}`).id = 'current';
            if (element) {
                element.id="current"
            }
        })
        .catch(error => {
            console.error("Error fetching initial tags:", error);
        });
    }, []);

     /**
     * useEffect() - Tag Change Side Effect
     * Author: Ryan
     * Date: 5.1.25
     * Purpose: Triggers update when `current` tag is changed.
     * Called: Automatically when `current` state changes.
     * Data Use: Sends new tag to server and gets new tag counts.
     * Input: `current` state.
     * Output: Updated tag counts shown on screen.
     */
    useEffect(() => {
        if (current) {
            updateTagData();
        }
    }, [current]);


    return (
        <div className="TagSection">
            <p>Select a Vibe</p>
            <ul className="TagList">
                    <li className="hate" onClick={handleClick}><img className="hatepic" src="https://openmoji.org/data/color/svg/1F922.svg"></img>{data.hate || 0}</li>
                    <li className="angry" onClick={handleClick}><img className="angrypic" src="https://openmoji.org/data/color/svg/1F928.svg"></img>{data.angry || 0}</li>
                    <li className="okay" onClick={handleClick}><img className="okaypic" src="https://openmoji.org/data/color/svg/1F642.svg"></img>{data.okay || 0}</li>
                    <li className="amazing" onClick={handleClick}><img className="amazingpic" src="https://openmoji.org/data/color/svg/1F600.svg"></img>{data.amazing || 0}</li>
                    <li className="love" onClick={handleClick}><img className="lovepic" src="https://openmoji.org/data/color/svg/1F60D.svg"></img>{data.love || 0}</li>

            </ul>
        </div>
    )
}
