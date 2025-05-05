/*******************************************************************************************
 * Author: Ryan
 * Date: 4.30.25
 * Filename: display_comments.jsx
 * 
 * Purpose:
 * This component is responsible for retrieving comments related to a specific page or item 
 * by parsing the URL and sending the final segment (typically a unique identifier) to the 
 * backend server via a POST request. It serves as a bridge between the frontend interface 
 * and the backend comment retrieval system.
 *
 * 
 * Initial Version: 4.30.25
 * Last Revised: 4.30.25
 * 
 * Rationale:
 * This file exists to allow users to view relevant comments tied to the current page’s context 
 * without needing to manually enter or search for them.
 * 
 * Data Structures & Algorithms:
 * - Utilizes basic JavaScript string manipulation to extract the final URL segment.
 * - Uses the Fetch API to communicate with a local Flask backend endpoint.
 * - Handles asynchronous behavior using the Fetch promise, though error handling is currently minimal.
 * 
 * Expected Input:
 * - The current page URL from `window.location.href`.
 * - A valid endpoint `/getposts` running on a local server (e.g., Flask).
 * 
 * Expected Output:
 * - Backend logs or processes the identifier received via POST.
 * - (Not currently implemented) Frontend might expect a JSON response with comment data.
 *******************************************************************************************/

const CommentDispay = () => {
    full_url = window.location.href;
    url_segments = full_url.split('/');
    last_segment = url_segments.pop()
    console.log(`Searching for comments under ${last_segment}`)
    try {
        fetch("http://127.0.01:5000/getposts", {
            method : "POST",
            credentials : "include",
            headers : {"Content-Type" : "application/json"},
            body : last_segment
        })
    }
    catch {

    }
}
