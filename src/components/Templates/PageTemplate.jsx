import React from 'react';
import { useParams } from 'react-router-dom';



const PageTemplate = ({ data }) => {

    const handleClick = () => {
        console.log("pressed")
    }



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
            <button id="postButton" onClick={handleClick} >CreatePost</button>

        </div>
    );
};

export default PageTemplate;
