import React, { useState, useEffect, useRef} from 'react'

export default function CreatePost() {

    const [data, setData] = useState([])
    const [status, setStatus] = useState('unclicked')
    const [content, setContent] = useState('')
    const [comment_target,setComment_Target] = useState(null)
    const inputRef = useRef(null)

    

    const openCommentForm = () => {
        console.log(status)
        setStatus('clicked')
        setComment_Target(null);
    }
    
    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const scrollToTarget = () => {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };

    const changeTarget = (e) => {
        setComment_Target(e.currentTarget.id)
        setStatus('clicked')
        scrollToTarget()
    }
    const full_url = window.location.href;
    const url_segments = full_url.split('/');
    const last_segment = url_segments.pop();
    const submitCommentForm = () => {
        fetch("http://127.0.01:5000/createpost", {
            method: "POST",
            credentials: "include",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({content : content, parent_comment : comment_target,  last_segment: last_segment}),
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
            console.log(`Got comment data ${responseData}`)
        }
        );
    }, [])

    const commentStructure = (comments, parentComment = null, level = 0) => {
        const spacing = 40
        return comments.filter(comment => comment.parent_comment === parentComment).map(comment => (
            <div key={comment.id} style = {{marginLeft: `${spacing * level}px`}}>
                <span>{comment.username}  {comment.date}</span><br></br>
                <span>{comment.content}</span><br></br>
                <button id = {comment.id} onClick={changeTarget}><u>Reply</u></button>
                {commentStructure(comments, comment.id, level + 1)}
            </div>

        ));
    };

    return (
        <div>
            {status === "unclicked" &&(
                <div id = "inputArea">
                    <button onClick={openCommentForm}>Create Comment</button>
                </div>
            )}
            {status === "clicked" && (
                <div>
                    <input ref = {inputRef} type="text" id="content" placeholder="Enter Comment" value={content} onChange={handleChange}></input>
                    <button id="submit" onClick={submitCommentForm}>Submit</button>
                </div>
            )}
            <div>
                {commentStructure(data)}
            </div>
        </div>);
}
