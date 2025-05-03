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