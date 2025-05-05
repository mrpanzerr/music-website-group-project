/*
 * Author: Gaetano, Ryan, Max
 * Date: 5.1.2025
 * Filename: comment_form.jsx
 * Purpose: This component handles the creation, display, and management of user posts in the application.
 *          It allows users to submit, reply to, and cancel comments, as well as fetch and display existing posts.
 *          The component interacts with a backend API for creating and retrieving posts.
 * Where it fits in the system: The component is part of the front-end interface for interacting with posts and comments in the system.
 * When the class was written and revised: Written on 2025-05-03; no revisions as of now.
 * Why the file exists: This file is responsible for rendering the post creation interface, managing user inputs for comments, and displaying comment threads.
 * How it uses its data structures and algorithms: It uses React's state management to track user inputs, replies, and fetched data. It also leverages the use of async fetch API calls to retrieve posts and submit new comments to the backend.
 * Expected input: The input includes the text for a comment or reply, the ID of the comment being replied to (if applicable), and user authentication information for creating posts.
 * Expected output: The expected output is the display of posts and comments on the screen, along with the functionality to submit and reply to comments.
 * Expected extensions or revisions: Future revisions may include adding a like/dislike system, editing functionality, and enhanced error handling.
 */

import React, { useState, useEffect, useRef } from 'react';
import checkSession from './session.jsx';

export default function CreatePost() {
    const [data, setData] = useState([]);
    const [replyingTo, setReplyingTo] = useState('');
    const [content, setContent] = useState('');
    const [sessionUser, setSessionUser] = useState('');
    const inputRef = useRef(null);

    const full_url = window.location.href;
    const last_segment = full_url.split('/').pop();

	/*
	 * Purpose: Fetches the posts from the backend when the component is mounted or when `last_segment` changes.
	 *          It also checks if the user is logged in to set the session data.
	 * Author: Ryan
	 * Date: 2025-05-03
	 * Revised: 2025-05-03
	 * Called by: The React component lifecycle (useEffect is triggered when the component mounts)
	 * Where it fits in the system: Part of the component's initialization logic to fetch the posts.
	 * How it uses data structures and algorithms: Utilizes React's `useEffect` hook to trigger side effects (API calls) when the component is mounted or dependencies change.
	 * Expected input: None (Triggers on component mount).
	 * Expected output: Sets the `sessionUser` state and fetches the post data to update the UI.
	 * Expected extensions or revisions: Possible addition of error handling or loading states.
	 */
    useEffect(() => {
        checkSession().then(setSessionUser);
        fetchComments();
    }, []);

	/*
	 * Purpose: Fetches the comments associated with the current post from the backend using the `last_segment` value.
	 *          Updates the component's state with the fetched data.
	 * Author: Ryan
	 * Date: 2025-05-03
	 * Revised: 2025-05-03
	 * Called by: Called within the `useEffect` hook on component mount to fetch data.
	 * Where it fits in the system: Part of the post fetching logic for the component.
	 * How it uses data structures and algorithms: Makes a POST request to the backend and updates the state with the response.
	 * Expected input: `last_segment` (the last part of the URL that identifies the post).
	 * Expected output: Updates the `data` state with the fetched posts.
	 * Expected extensions or revisions: Error handling improvements and response validation.
	 */
    const fetchComments = () => {
        fetch("http://127.0.0.1:5000/getposts", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ last_segment }),
        })
            .then(res => res.json())
            .then(responseData => {
                if (responseData.posted == true) {
                    setData(responseData.data)
                }else {
                    setData([])
                }
            }).catch(error => {
                console.log(`Error fetching comments: ${error}`);
                setData([])
            })
    };

// Purpose: To handle the deletion of comments by sending a request to the backend API.
// Author: Ryan
// Date Written: 5.4.25
// Last Revised: 5.4.25
// Called By: The delete button in the comment UI.
// System Context: Allows a user to get rid of comments information, but the comment itself will not be deleted to maintain struture
// Data Structures: N/A
// Algorithms Used: N/A
// Inputs: the id of the comment to be deleted.
// Outputs: A response from the backend indicating success or failure of the deletion.
// Future Changes: As of 5.4.25 no changes are needed.
    const deleteComment = (id) => {
        fetch("http://127.0.0.1:5000/deletepost", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        }).then(res => res.json()).then(responseData => {
            console.log(responseData);
            fetchComments();
        }).catch(error => {
            console.log(`Error deleting comment: ${error}`);
        })

    }

	/*
	 * Purpose: Opens the comment form for creating a new top-level comment (not a reply). 
	 *          Resets relevant state fields for a new comment.
	 * Author: Ryan
	 * Date: 2025-05-03
	 * Revised: 2025-05-03
	 * Called by: Triggered by clicking the "Create Comment" button.
	 * Where it fits in the system: Handles the display logic for a new comment form.
	 * How it uses data structures and algorithms: Updates the state of `replyingTo` and `content`, triggering a UI update to show the form.
	 * Expected input: None (triggered by the user).
	 * Expected output: Displays a new comment form for the user to fill out.
	 * Expected extensions or revisions: Could be extended to include validation of user input.
	 */
    const openTopCommentForm = () => {
        checkSession().then(session => {
            if (!session) return alert("You must sign in to comment.");
            setReplyingTo(null);
            setContent('');
        });
    };

	/*
	 * Purpose: Sets the state to allow the user to reply to a specific comment by changing the `replyingTo` state.
	 * Author: Ryan
	 * Date: 2025-05-03
	 * Revised: 2025-05-03
	 * Called by: Triggered when a user clicks the "Reply" button on an existing comment.
	 * Where it fits in the system: Updates the UI to show the input form for replying to a specific comment.
	 * How it uses data structures and algorithms: Updates the `replyingTo` state and clears the content to prepare for a new reply.
	 * Expected input: `id` (ID of the comment being replied to).
	 * Expected output: Updates the UI to show the reply form, with the correct parent comment set.
	 * Expected extensions or revisions: Could be extended with a confirmation dialog for canceling a reply.
	 */
    const changeTarget = (id) => {
		 // Check if the user is logged in
		if (!sessionUser) {  // If no session user exists (meaning not logged in)
			alert("You need to be logged in to reply.");  // Show an alert message
			return;  // Exit the function early if not logged in
		}
        console.log(replyingTo);
        setReplyingTo(id);
        setContent('');
    };

	/*
	 * Purpose: Cancels the current reply process and resets the relevant states.
	 * Author: Gaetano
	 * Date: 2025-05-03
	 * Revised: 2025-05-03
	 * Called by: Triggered when a user clicks the "Cancel" button after starting to reply to a comment.
	 * Where it fits in the system: Resets the reply state to exit the reply mode.
	 * How it uses data structures and algorithms: Updates the `replyingTo` state to null and clears the content input.
	 * Expected input: None.
	 * Expected output: Resets the reply UI state, effectively canceling the reply process.
	 * Expected extensions or revisions: Could be enhanced with a confirmation before canceling.
	 */
    const cancelReply = () => {
        setReplyingTo('');
        setContent('');
    };

	/*
	 * Purpose: Handles changes to the comment input field by updating the `content` state.
	 * Author: Ryan
	 * Date: 2025-05-03
	 * Revised: 2025-05-03
	 * Called by: Triggered when the user types in the comment input field.
	 * Where it fits in the system: Captures the user's input for the comment or reply.
	 * How it uses data structures and algorithms: Updates the `content` state with the value entered by the user.
	 * Expected input: `e.target.value` (the current value of the comment input).
	 * Expected output: Updates the `content` state with the new value.
	 * Expected extensions or revisions: Could include validation or sanitization of input text.
	 */
    const handleChange = (e) => setContent(e.target.value);
	
	/*
	 * Purpose: Submits the comment or reply form to the backend, creating a new post or reply.
	 * Author: Ryan
	 * Date: 2025-05-03
	 * Revised: 2025-05-03
	 * Called by: Triggered when the user clicks the "Submit" button after entering content.
	 * Where it fits in the system: Submits the data to the backend API to create a new post or reply.
	 * How it uses data structures and algorithms: Sends an API request to the backend with the user's comment data and updates the UI on success.
	 * Expected input: The comment content and the ID of the comment being replied to (if any).
	 * Expected output: Creates a new comment or reply and updates the UI with the new comment data.
	 * Expected extensions or revisions: Could be extended to include error handling or form validation.
	 */
    const submitCommentForm = async () => {
        await fetch("http://127.0.0.1:5000/createpost", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content,
                parent_comment: replyingTo,
                last_segment
            }),
        });
        setReplyingTo(null);
        setContent('');
        fetchComments();
    };

	/*
	 * Purpose: Recursively renders comments and replies to display the entire comment thread.
	 * Author: Ryan, Gaetano, Max
	 * Date: 2025-05-03
	 * Revised: 2025-05-03
	 * Called by: Called to render the comment threads for each post.
	 * Where it fits in the system: Part of the UI rendering logic for displaying posts and comments.
	 * How it uses data structures and algorithms: Uses recursion to render comments and replies in a nested structure.
	 * Expected input: `comments` (array of comment objects), `parent` (the ID of the parent comment for nested replies), `level` (the nesting level).
	 * Expected output: Renders each comment and its replies in a nested structure, adjusting the UI layout accordingly.
	 * Expected extensions or revisions: Could be optimized to improve performance with larger comment threads.
	 */
    const renderComments = (comments, parent = null, level = 0) => {
        if (data == []) {
            return (<div>You Must Comment to See Other Comments</div>)
        }
        else {
        let spacing = 40;
        return comments
        //Filter comments to only include those that match the parent comment ID
            .filter(comment => comment.parent_comment === parent)
            //Use map to iterate over the filtered comments and render each one
            .map(comment => (
                <div className="CommentDiv" key={comment.id} style={{paddingLeft: `${spacing * level}px`, display: 'block', width: '100%', marginBottom: '10px' }}>
                    <span className="HeaderField" style={{ fontStyle: 'italic' }}><i>{comment.username}</i> | {comment.date}</span><br />
                    <span className="ContentField">{comment.content}</span><br />
                    {replyingTo === comment.id ? (
                        <>
                            <textarea
                                ref={inputRef}
                                className="CommentTextarea"
                                placeholder="Enter reply"
                                value={content}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    marginTop: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc'
                                }}
                            /><br />
                            <button
                                className="SubmitComment"
                                onClick={submitCommentForm}
                                style={{
                                    padding: '5px 10px 5px 0px',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >Submit</button>{' '}
                            <button
                                className="CancelButton"
                                onClick={cancelReply}
                                style={{
                                    padding: '5px 10px 5px 0px',
                                    backgroundColor: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >Cancel</button>
                        </>
                    ) : (
                        <button className="ReplyButton" onClick={() => changeTarget(comment.id)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Reply</button>
                    )}

            
                    {sessionUser === comment.username && comment.content !== "[DELETED]" &&(
                        <button className="DeleteButton" onClick={() => deleteComment(comment.id)} style={{
                            backgroundColor: 'orange'
                        }}>Delete</button>
                    )}
                   
                    // Render replies recursively
                    {renderComments(comments, comment.id, 1)}
                </div>
            ));
        }
    };

    return (
        <div className="CommentContainer" style={{ display: 'block', width: '100%' }}>
            {replyingTo !== null && (
                <div className="InputArea" style={{ marginBottom: '20px' }}>
                    <button className="CreateComment" onClick={openTopCommentForm} style={{
                        padding: '10px 15px',
                        backgroundColor: 'orange',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>Create Comment</button>
                </div>
            )}
            {replyingTo === null && (
                <div className="InputArea" style={{ marginBottom: '20px' }}>
                    <textarea
                        ref={inputRef}
                        className="CommentTextarea"
                        placeholder="Enter comment"
                        value={content}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '5px',
                            border: '1px solid #ccc'
                        }}
                    /><br />
                    <button
                        className="SubmitComment"
                        onClick={submitCommentForm}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: 'orange',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >Submit</button>{' '}
                    <button
                        className="CancelButton"
                        onClick={cancelReply}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >Cancel</button>
                </div>
            )}
            <div className="ContentArea" style={{ display: 'block' }}>
                {renderComments(data)}
            </div>
        </div>
    );
}
