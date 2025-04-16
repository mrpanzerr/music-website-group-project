/**
Component: PageTemplate  
Author: Ryan Ferrel
Date Created: 04.10.2025  
Last Revised: 04.14.2025  

Purpose:  
This React component dynamically renders a detailed view for either an artist, track, or album based on the data passed via props. It formats and displays various metadata such as images, names, genres, release dates, and associated items (e.g., top tracks for an artist or tracks in an album).

Where It's Used:  
Called from a parent route page (e.g., `/artist/:id`, `/track/:id`, or `/album/:id`) after Spotify API data is fetched and passed to this component as the `data` prop.

System Role:  
Serves as a reusable display template for different Spotify item types (artist, album, track), allowing PlayBack users to view detailed information in a consistent UI layout.

Data Structures and Algorithms:  
- Deconstructs the `data` object into specific structures (`artistData`, `trackData`, `albumData`) based on `data.type`.
- Uses JavaScript array methods (`map`) to iterate and render genres, artists, and tracks.
- Performs basic conditional rendering logic based on item type.
- Uses optional chaining and default fallbacks to prevent runtime errors due to missing or malformed data.

Expected Input:  
- `data`: A prop object that contains a `type` field ("artist", "track", or "album") and related metadata fields depending on the type.

Expected Output:  
- Returns a JSX layout representing the item, with conditional sections and nested mapping for dynamic content such as genres or track listings.

Future Revisions or Extensions:  
- Add loading and error handling UI for better UX.
- Modularize individual sections (e.g., ArtistDetails, TrackDetails) into subcomponents.
- Add support for playback controls or Spotify embeds.
- Improve mobile responsiveness and accessibility (e.g., alt text, ARIA labels).

**/
import React from 'react';
import { useParams } from 'react-router-dom';

// This component will receive the data as props and display it
const PageTemplate = ({ data }) => {
    let artistData, trackData, albumData, type;

    if (data.type === "artist") {
        artistData = data || {};
        type = "artist";
    } else if (data.type === "track") {
        trackData = data || {};
        type = "track";
    } else {
        albumData = data || {};
        type = "album";
    }

    const { artistname, followers, artistimage, genres = [], toptracks = []} = artistData || {};
    const { trackname, trackalbumname, trackalbumid, trackalbumtype, trackimage, trackreleasedate, trackartists = []} = trackData || {};
    const { albumname, albumtype, tracknumber, albumimage,  albumreleasedate, albumartists = [], albumtracks = []} = albumData || {};
    console.log(artistimage)
    // Default to empty array if artist is missing
    // Fallback for missing or malformed image

    // Ensure 'artist' is always an array, and provide default values if it's missing

    return (
        <div className="page-template">
            {type === "artist" && (
                <ul>
                    <li>Artist Name: {artistname}</li>
                    <li>Artist's Spotify Followers: {followers}</li>
                    <li><img src={artistimage}></img></li>
                    <li>Artist's Genres<ul className="artistGenres">
                        {genres.map((genre,index) => (
                            <li key={index}>{genre}</li>
                        ))}
                    </ul></li>
                    <li>Artist's Top Tracks: <ul> {toptracks.map((track) => (
                        <ul>
                        <a href = {`/track/${track[1]}`}><li><u>{track[0]}</u></li></a>
                        <a href = {`/album/${track[3]}`}><li><img src={track[2]}></img></li></a>
                        </ul>))}
                    </ul></li>
                </ul>
            )}


            {type === "track" && (
                <ul>
                    <li>Track Name: {trackname}</li>
                    <a href={`/album/${trackalbumid}`}><li>Track Album Type: {trackalbumtype}</li>
                    <li>Track Album Name: {trackalbumname}</li>
                    <li><img src={trackimage}></img></li></a>
                    <li>Track Artists<ul className="trackGenres">
                        {trackartists.map((artist,index) => (
                            <a href={`/artist/${artist[1]}`}><li key={index}>{artist[0]}</li></a>
                        ))}
                    </ul></li>
                    <li>Track Release Date: {trackreleasedate}</li>
                </ul>
            )}


            {type === "album" && (
                <ul>
                    <li>Name: {albumname}</li>
                    <li>Album Type: {albumtype}</li>
                    <li>Number of Tracks: {tracknumber}</li>
                    <li><img src={albumimage}></img></li>
                    <li>Album Release Date: {albumreleasedate}</li>
                    <li>Artists: <ul className="albumArtists">
                        {albumartists.map((artist,index) => (
                            <li key={index}>{artist[0]}</li>
                        ))}
                    </ul></li>
                    <li>Tracks: <ul className="albumTracks">
                        {albumtracks.map((track,index) => (
                            <a href={`/track/${track[1]}`}><li key={index}>{track[0]}</li></a>
                        ))}
                    </ul></li>
                </ul>
            )}
        </div>
    );
};

export default PageTemplate;
