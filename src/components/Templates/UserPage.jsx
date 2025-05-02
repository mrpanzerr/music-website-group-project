import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function UserPage() {
    const [data,setData] = useState([])
    const { username } = useParams()
    const [taglst,setTaglst] = useState([])
    const [commentlst, setCommentlst] = useState([])
    const tags = []
    const comments = []

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000/usertagactivity`);
                const responseData = await res.json();
                console.log(responseData);  // Log to inspect data
                setData(responseData);
    
                const tags = [];
                const comments = [];
                
                // responseData.forEach(item => {
                //     if (item.type === 'tag') {
                //         tags.push(item);
                //     } else {
                //         comments.push(item);
                //     }
                // });
    
                setTaglst(tags);
                setCommentlst(comments);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [username]);


    return (
        <div>
            <ul>
                {commentlst.map((item,index) => (<ul key = {index}>
                    <li>{item.body}</li>
                    <li>{item.date}</li>
                    <li>{item.song_data.name}</li>
                    <li>{item.song_data.image}</li>
                </ul>))}
            </ul>
        </div>
        )
}