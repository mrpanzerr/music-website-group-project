import React, { useState, useEffect } from 'react'

export default function CreatePost() {

    const [data, setData] = useState([])
    const [status, setStatus] = useState('unclicked')
    const [content, setContent] = useState('')
    
    const openCommentForm = () => {
        console.log(status)
        setStatus('clicked');
    }
    
    const handleChange = (e) => {
        setContent(e.target.value)
    }
    const full_url = window.location.href;
    const url_segments = full_url.split('/');
    const last_segment = url_segments.pop();
    const submitCommentForm = () => {
        fetch("http://127.0.01:5000/createpost", {
            method: "POST",
            credentials: "include",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({content : content, last_segment: last_segment}),
        });
        console.log(`Attempting to submit ${content,last_segment}`);
        setStatus('unclicked');
        setContent('')
        window.location.reload()
    }
    useEffect(() => {
        fetch("http://127.0.01:5000/getposts", {
        method: "POST",
        credentials: "include",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({last_segment}),
    }).then(res => res.json()).then(
        responseData => {
            setData(responseData)
            console.log(`Got comment data${responseData}`)
        }
    );
    }, [])


    // if (status === 'unclicked') {
    //     return (<div><button onClick={openCommentForm}>Create Comment</button></div>)
    // }
    // if (status === 'clicked') {
    //     return (<div>
    //                 <input type="text" id="content" placeholder="Enter Comment" value={content} onChange={handleChange}></input>
    //                 <button id="submit" onClick={submitCommentForm}>Submit</button>
    //             </div>)
    // }
    return (
        <div>
            {status === "unclicked" &&(
                <div>
                    <button onClick={openCommentForm}>Create Comment</button>
                </div>
            )}
            {status === "clicked" && (
                <div>
                    <input type="text" id="content" placeholder="Enter Comment" value={content} onChange={handleChange}></input>
                    <button id="submit" onClick={submitCommentForm}>Submit</button>
                </div>
            )}
            <div>
                {data.map(entry => {
                    console.log(entry);
                    return (
                        <div key={entry.id}>
                            <p>{entry.username}</p>
                            <p>{entry.username}</p>
                            <p>{entry.date}</p>
                            <p>{entry.parent_comment}</p>
                        </div>
                    );
                })}
            </div>
        </div>)
}
