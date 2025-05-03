import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
                <ul className="TagsList">VIBES
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
                <ul className="CommentsList">COMMENTS
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
        </>
    )
}  