import { useState, useEffect} from 'react'
import checkSession from "./session.jsx"

export default function TagSection() {
    const [data,setData] = useState({})
    const [current,setCurrent] = useState('')
    const [usertag,setUserTag] = useState('')

    const full_url = window.location.href;
    const url_segments = full_url.split('/');
    const last_segment = url_segments.pop();

    const handleClick = (e) => {
        checkSession().then(session => {
            if (session != '') {
                setCurrent(e.target.id)
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
        })
        .catch(error => {
            console.error("Error fetching initial tags:", error);
        });
    }, []);

    useEffect(() => {
        if (current) {
            updateTagData();
        }
    }, [current]);


    return (
        <div>
            <p>{data.exists}</p>
            <ul>Click to add a vibe
                    <li id="hate" onClick={handleClick}>Hate : {data.hate || 0}</li>
                    <li id="angry" onClick={handleClick}>Angry : {data.angry || 0}</li>
                    <li id="love" onClick={handleClick}>Love : {data.love || 0}</li>
                    <li id="okay" onClick={handleClick}>Okay : {data.okay || 0}</li>
                    <li id="amazing" onClick={handleClick}>Amazing : {data.amazing || 0}</li>
            </ul>
        </div>
    )
}