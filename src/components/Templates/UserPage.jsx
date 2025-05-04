import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './UserPage.css';

export default function UserPage() {
    const [data,setData] = useState();
    const { username } = useParams();

    useEffect(() => {
		fetch(`http://127.0.0.1:5000/useractivity/${username}`)
        .then(res => res.json())
        .then(responseData => {
            console.log(responseData);
            setData(responseData);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, [username]);
    if (!data) {
        return (<div>Loading...</div>)
    }
    return (
        <>
            <div>
                <div className="page-header">
					<h1 className="sideB">-User-</h1>
					<img src="../public/images/playbackarrow.png"></img>
				</div>
                <div className="UserPage">
                    <h1>-Vibes-</h1>
                    <ul className="TagsList">
                        {data.tags.map((item,index) => (
                            <li className="TagItem" key={index}>
                                <a href={`/${item.type}/${item.songid}`}>
                                    <p>{item.vibe}</p>
                                    <p>{item.song_name}</p>
                                    <img src={item.song_url}></img>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <h1>-Comments-</h1>
                    <ul className="CommentsList">
                        {data.comments.map((item,index) => (
                            <li className="CommentItem" key={index}>
                                <a href={`/${item.type}/${item.track_id}`}>
                                    <p>{item.content}</p>
                                    <p>{item.date}</p>
                                    <p>{item.song_name}</p>
                                    <img src={item.song_url}></img>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}  