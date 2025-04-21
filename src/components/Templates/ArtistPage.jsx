/**
Author: Ryan Ferrel  
Date: 4.18.25  
Filename: ArtistPage.jsx  

Purpose:  
This file defines the ArtistPage component, which is responsible for fetching and displaying data for a specific artist using the artist's ID from the URL parameters.  

System Context:  
This component is part of the FrontEnd system. It retrieves artist data from the backend API and renders the information using a shared PageTemplate component.  

Development History:  
- Written on: 4.18.25  
- Last revised on: N/A  

Existence Rationale:  
This component exists to encapsulate logic for displaying artist-specific content, separating API interaction and routing concerns from layout and styling handled by the PageTemplate.  

Data Structures and Algorithms:  
Uses React's useState and useEffect hooks to manage asynchronous data fetching.  
Fetches artist data based on the ID from useParams and stores it in local component state for rendering.  

Expected Input:  
An artist ID obtained from the URL via React Router's useParams hook.  

Possible Output:  
- A fully rendered artist page populated with relevant data.  
- A loading message displayed while the data is being fetched.  
- Console logs for debugging the fetched artist data.  
- Console error messages if the API call fails.  

Future Extensions or Revisions:  
- Implement UI error handling when data fails to load.  
- Add loading skeletons or spinners for improved UX.  
- Display more granular artist details or related content (albums, tracks, etc).  
**/


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageTemplate from './PageTemplate'; // Import the template

const ArtistPage = () => {
    const { id } = useParams();  // Get the artist ID from the URL
    const [data, setData] = useState(null);
    

    useEffect(() => {
		fetch(`http://127.0.0.1:5000/artist/${id}`)
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
                <PageTemplate data={{ ...data, type: "artist" }} /> // Pass the data and type
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ArtistPage;
