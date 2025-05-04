/**
Component: PageTemplate  
Author: Ryan Ferrel
Styling: Max Collins
Date Created: 04.10.2025  
Last Revised: 04.18.2025  

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
import './PageTemplate.css';
import { useParams } from 'react-router-dom';
import CreatePost from '../CommentPost/comment_form.jsx'
import TagSection from '../CommentPost/tags'

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

			{/* Header Section */}
			<div className="page-header">
				<h1 className="sideB">Side B</h1>
				<img src="../../../public/images/playbackarrow.png"></img>
			</div>
			<TagSection />
            {type === "artist" && (
			  <section className="artistDetails">
				{/* Artist Header */}
				<h1 className="titleHeader">-{artistname}-</h1>
				<div className="flex-artist">
				  <div className="artistImage">
					<img
					  src={artistimage}
					  alt={`${artistname}`}
					/>
				  </div>
				  <ul className="artistInfo">
					<li><strong>Spotify Followers:</strong> {followers.toLocaleString()}</li>
					{genres > 0 ? (
						<li>
							<ul className="artistGenres list-disc list-inside">
							{genres.map((genre, index) => (
							  <li key={index}>{genre}</li>
							))}
							</ul>
						</li>
					) : (
						<h1></h1>
					)}
				  </ul>
				</div>
				<div className="divider"></div>
				{/* Top Tracks Section */}
				<div className="artistTopTracks">
				  <h2 className="tracksHeader">-Top Tracks-</h2>
				  <ul className="topTracks">
					{toptracks.slice(0, 10).map(([trackName, trackId, albumImage, albumId], index) => (
					  <li key={index} className="flex">
						<a href={`/album/${albumId}`}>
						  <img
							src={albumImage}
							alt={`${trackName} album cover`}
						  />
						</a>
						<a href={`/track/${trackId}`}>
						  {trackName}
						</a>
					  </li>
					))}
				  </ul>
				</div>

				{/* <Thoughts /> -- This will be the posting/comment component */}
			  </section>
			)}

            {type === "track" && (
			  <section className="trackDetails">
				<h1 className="titleHeader">-{trackname}-</h1>
				<div className="flex">
				  <div className="trackImage">
					<img
					  src={trackimage}
					  alt={`${trackname} cover`}
					/>
				  </div>
				  <ul className="trackInfo">
					<li><strong>Track Name:</strong> {trackname}</li>
					<li>
					  <strong>Album:</strong>{' '}
					  <a href={`/album/${trackalbumid}`}>
						{trackalbumname}
					  </a>
					</li>
					<li>
					  <strong>Artists:</strong>
					  <ul className="trackArtists">
						{trackartists.map(([name, id], index) => (
						  <li key={index}>
							<a href={`/artist/${id}`}>
							  {name}
							</a>
						  </li>
						))}
					  </ul>
					</li>
					<li><strong>Release Date:</strong> {trackreleasedate}</li>
				  </ul>
				</div>

				{/* <Thoughts /> -- This will be the posting/comment component */}
			  </section>
			)}

            {type === "album" && (
				<section className="albumDetails">
					<h1 className="titleHeader">-{albumname}-</h1>
					<div className="flex">
						<div className="albumImage">
							<img src={albumimage} alt={`${albumname} cover`}/>
						</div>
						<ul className="albumInfo">
							<li><strong>Album Name:</strong> {albumname}</li>
							<li>
								<strong>Artists:</strong>
								<ul className="albumArtists">
									{albumartists.map(([name, id], index) => (
						  			<li key={index}>
										<a href={`/artist/${id}`}>
							  				{name}
										</a>
						  	</li>
						))}
								</ul>
							</li>
							<li><strong>Number of Tracks:</strong> {tracknumber}</li>
							<li><strong>Release Date:</strong> {albumreleasedate}</li>
						</ul>
					</div>
					<div className="divider"></div>
					<div className="tracksSection">
						<h2 className="tracksHeader">-Tracks-</h2>
						<ul className="albumTracks">
							{albumtracks.map(([trackName, trackId, albumImage], index) => (
							<li key={index}>
								<a href={`/track/${trackId}`}>
								{trackName}
								</a>
							</li>
							))}
						</ul>
					</div>

					{/* <Thoughts /> -- This will be the posting/comment component */}
				</section>
			)};
			<div className="tempalte-footer">
				<CreatePost/>
			</div>
        </div>
    );
};

export default PageTemplate;
