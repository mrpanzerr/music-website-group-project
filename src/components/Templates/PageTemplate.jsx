/**
Component: PageTemplate  
Author: Ryan Ferrel
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
			  <section className="artistDetails flex flex-col gap-6">
				{/* Artist Header */}
				<div className="flex gap-4">
				  <h1>{artistname}</h1>
				  <div className="artistImage w-1/3 max-w-xs">
					<img
					  src={artistimage}
					  alt={`${artistname}`}
					  className="w-full h-auto rounded-xl shadow-md object-cover"
					/>
				  </div>
				  <ul className="artistInfo flex-1 space-y-2">
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

				{/* Top Tracks Section */}
				<div className="artistTopTracks mt-6">
				  <h2 className="text-lg font-semibold mb-2">Top Tracks</h2>
				  <ul className="topTracks flex flex-col gap-3">
					{toptracks.slice(0, 10).map(([trackName, trackId, albumImage, albumId], index) => (
					  <li key={index} className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-100 transition">
						<a href={`/album/${albumId}`} className="w-12 h-12 flex-shrink-0">
						  <img
							src={albumImage}
							alt={`${trackName} album cover`}
							className="w-full h-full object-cover rounded"
						  />
						</a>
						<a href={`/track/${trackId}`} className="text-blue-600 hover:underline">
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
			  <section className="trackDetails flex flex-col gap-4">
				<div className="flex gap-4">
				  <div className="trackImage w-1/3 max-w-xs">
					<img
					  src={trackimage}
					  alt={`${trackname} cover`}
					  className="w-full h-auto rounded-xl shadow-md"
					/>
				  </div>
				  <ul className="trackInfo flex-1 space-y-2">
					<li><strong>Track Name:</strong> {trackname}</li>
					<li>
					  <strong>Album:</strong>{' '}
					  <a href={`/album/${trackalbumid}`} className="text-blue-600 hover:underline">
						{trackalbumname}
					  </a>
					</li>
					<li>
					  <strong>Artists:</strong>
					  <ul className="trackArtists list-disc list-inside">
						{trackartists.map(([name, id], index) => (
						  <li key={index}>
							<a href={`/artist/${id}`} className="text-blue-600 hover:underline">
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
				<section className="albumDetails flex flex-col gap-4">
					<div className="flex gap-4">
						<div className="albumImage w-1/3 max-w-xs">
							<h1>{albumname}</h1>
							<img src={albumimage} alt={`${albumname} cover`} className="w-full h-auto rounded-xl shadow-md" />
						</div>
						<ul className="albumInfo flex-1 space-y-2">
							<li>
								<strong>Artists:</strong>
								<ul className="albumArtists list-disc list-inside">{albumartists.map(([name], index) => (
									<li key={index}>{name}</li>
								))}
								</ul>
							</li>
							<li><strong>Number of Tracks:</strong> {tracknumber}</li>
							<li><strong>Release Date:</strong> {albumreleasedate}</li>
						</ul>
					</div>

					<div className="albumTracksSection mt-6">
						<h2 className="text-lg font-semibold mb-2">Tracks</h2>
						<ul className="albumTracks list-decimal list-inside space-y-1">
							{albumtracks.map(([trackName, trackId], index) => (
							<li key={index}>
								<a href={`/track/${trackId}`} className="text-blue-600 hover:underline">
								{trackName}
								</a>
							</li>
							))}
						</ul>
					</div>

					{/* <Thoughts /> -- This will be the posting/comment component */}
				</section>
			)};
        </div>
    );
};

export default PageTemplate;
