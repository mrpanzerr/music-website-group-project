/**
Author: Ryan Ferrel  
Date: 4.18.25  
Filename: TrackPage.jsx  

Purpose:  
This file defines the TrackPage component, which is responsible for fetching and displaying data for a specific track using the track's ID from the URL parameters.  

System Context:  
This component is part of the FrontEnd system. It retrieves track data from the backend API and renders the information using a shared PageTemplate component.  

Development History:  
- Written on: 4.18.25  
- Last revised on: N/A  

Existence Rationale:  
This component exists to manage the logic for rendering individual track details, separating concerns between routing, data fetching, and UI rendering.  

Data Structures and Algorithms:  
Uses React's useState and useEffect hooks to handle API requests.  
Fetches track data based on the ID from useParams and stores it in component state for use in the PageTemplate.  

Expected Input:  
A track ID obtained from the URL via React Router's useParams hook.  

Possible Output:  
- A fully rendered track page showing the track's metadata.  
- A loading message during data fetch.  
- Console output of the retrieved track data for debugging.  
- Console error messages in case of failed fetch requests.  

Future Extensions or Revisions:  
- Improve error feedback with dedicated UI messaging.  
- Add loading skeletons or progress indicators.  
- Expand display to include related data (album, artist, recommendations, etc).  
**/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageTemplate from './PageTemplate'; // Import the template

const TrackPage = () => {
    const { id } = useParams();  // Get the Track ID from the URL
    const [data, setData] = useState(null);

    useEffect(() => {
		fetch(`http://127.0.0.1:5000/track/${id}`)
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
                <PageTemplate data={{ ...data, type: "track" }} /> // Pass the data and type
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default TrackPage;