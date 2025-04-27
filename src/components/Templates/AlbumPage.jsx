/**
Author: Ryan Ferrel  
Date: 4.18.25  
Filename: AlbumPage.jsx  

Purpose:  
This file defines the AlbumPage component, which is responsible for fetching and displaying data for a specific album using the album's ID from the URL parameters.  

System Context:  
This component is part of the FrontEnd system. It retrieves album data from the backend API and renders the information using a shared PageTemplate component.  

Development History:  
- Written on: 4.18.25  
- Last revised on: N/A  

Existence Rationale:  
This component exists to encapsulate logic for displaying album-specific content, separating data fetching and routing logic from page layout and styling.  

Data Structures and Algorithms:  
Uses React's useState and useEffect hooks to manage API data retrieval.  
Performs a fetch request using the album ID parameter and passes the resulting data to the page template.  

Expected Input:  
An album ID obtained from the URL via React Router's useParams hook.  

Possible Output:  
- A fully rendered album page populated with data.  
- A loading message while data is being fetched.  
- Console output of fetched data for development debugging.  
- Error messages in the console if the fetch request fails.  

Future Extensions or Revisions:  
- Add detailed error UI if album data fails to load.  
- Implement loading skeletons or spinners.  
- Handle edge cases like invalid IDs or empty responses.  
**/

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