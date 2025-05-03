/**
 * checkSession - Checks if a user session is active by making a GET request to the server.
 *
 * Author: Ryan
 * Date: 5.1.2025
 * Filename: session.js
 * Purpose: This function checks whether a user session is active by making an HTTP GET request to the server's session-checking endpoint. 
 *          It returns a boolean indicating whether a session is set or not.
 * Where it fits in the general system: This function is part of the client-side code for managing user authentication. 
 *          It is called when there is a need to verify the user's session status (for example, before allowing actions like posting comments).
 * When the function was written/revised: [Date]
 * Why this function exists: This function exists to provide a simple way to check if a user is currently logged in (i.e., has an active session) 
 *          by querying the server.
 * How it uses data structures and algorithms: The function uses the Fetch API to send a GET request to the server and receives 
 *          a JSON response that indicates the session status. It uses async/await to handle asynchronous operations.
 * Expected input: No input parameters.
 * Expected output: A boolean value (`true` or `false`) indicating whether the session is active (`true` if a session is set, `false` if not).
 * Expected extensions or revisions: This function might be extended to handle additional session-related logic, such as error handling for failed requests.
 */
export default async function checkSession() {
    const query = await fetch("http://127.0.01:5000/check-session", {
            method: "GET",
            credentials: "include",
        });
        const data = await query.json();
        console.log(data.sessionSet)
        return data.sessionSet
        
}