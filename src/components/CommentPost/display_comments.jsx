import { useState, useEffect} from 'react';

const CommentDisplay = () => {
    const [data, setData] = useState([])
    const full_url = window.location.href;
    const url_segments = full_url.split('/');
    const last_segment = url_segments.pop()
    console.log(`Searching for comments under ${last_segment}`)
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
    return (
        <div>
            {data.map(item => (
                <div key={item.id}>
                    <p>{item.content}</p>
                </div>
        ))}
        </div>
    )
}

export default CommentDisplay;