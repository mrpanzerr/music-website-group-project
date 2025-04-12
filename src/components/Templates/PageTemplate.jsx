import React from 'react';
import { useParams } from 'react-router-dom';

// This component will receive the data as props and display it
const PageTemplate = ({ data }) => {
    const { name, image, type, artist = [] } = data || {};  // Default to empty array if artist is missing
    
    // Fallback for missing or malformed image
    const imageUrl = image || "../../../images/no_result.png";  // Use a placeholder if the image is missing

    // Ensure 'artist' is always an array, and provide default values if it's missing
    const artistNames = Array.isArray(artist) && artist.length > 0 ? artist : ["Unknown"];

    return (
        <div className="page-template">
            <h1>{name}</h1>
            {type === "artist" && (
                <div>
                    <img src={imageUrl} alt={`${name} profile`} />
                    <p>Artist: {artistNames.join(', ')}</p>
                    {/* Other artist-specific details */}
                </div>
            )}
            {type === "track" && (
                <div>
                    <img src={imageUrl} alt={`${name} album`} />
                    <p>Track by {artistNames.join(', ')}</p>
                    {/* Other track-specific details */}
                </div>
            )}
            {type === "album" && (
                <div>
                    <img src={imageUrl} alt={`${name} album cover`} />
                    <p>Album by {artistNames.join(', ')}</p>
                    {/* Other album-specific details */}
                </div>
            )}
        </div>
    );
};

export default PageTemplate;
