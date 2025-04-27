import React, { useState } from 'react'

export default function CreatePost() {

    
    const [status, setStatus] = useState('unclicked')
    const [content, setContent] = useState('')
    const openCommentForm = () => {
        console.log(status)
        setStatus('clicked');
    }
    
    const submitCommentForm = () => {
        const full_url = window.location.href;
        const url_segments = full_url.split('/');
        const last_segment = url_segments.pop();
        fetch("http://127.0.01:5000/createpost", {
            method: "POST",
            credentials: "include",
            headers : {"Content-Type" : "application.json"},
            body : JSON.stringify({last_segment, content}),
        });
        console.log(`Attempting to submit ${content,last_segment}`);
        setStatus('unclicked');
        setContent('');
    }

    if (status === 'unclicked') {
        return (<div><button onClick={openCommentForm}>Create Comment</button></div>)
    }
    if (status === 'clicked') {
        return (<div><input type="text" id="content" placeholder="Enter Comment" value={content} onChange={(e) => setContent(e.target.value)}></input><button id="submit" onClick={submitCommentForm}>Submit</button></div>)
    }
}
