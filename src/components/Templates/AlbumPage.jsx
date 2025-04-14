import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageTemplate from './PageTemplate'; // Import the template

const AlbumPage = () => {
    const { id } = useParams();  // Get the artist ID from the URL
    const [data, setData] = useState(null);
    

    useEffect(() => {
		fetch(`http://127.0.0.1:5000/album/${id}`)
        .then(res => res.json())
        .then(responseData => {
            console.log(responseData);  // Log to inspect data
            setData(responseData);
        })
        .catch(error => console.error('Error fetching data:', error));
}, [id]);


    return (
        <div>
            {data ? (
                <PageTemplate data={{ ...data, type: "album" }} /> // Pass the data and type
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default AlbumPage;