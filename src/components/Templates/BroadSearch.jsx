import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const BroadSearch = () => {
    const [data,setData] = useState({"artists" : [], "albums" : [], "tracks" : []});
    const { search } = useParams();
    
    useEffect(() => {
		fetch(`http://127.0.0.1:5000/broadsearch/${search}`)
        .then(res => res.json())
        .then(responseData => {
            console.log(responseData);
            setData(responseData);
        })
        .catch(error => console.error('Error fetching data:', error));
}, [search]);


if (
    data.artists.length === 0 && data.albums.length === 0 && data.tracks.length === 0) {
    return(<div>Loading...</div>)
  }
return (
        <div>
            <ul className="ArtistList">Artists
                {(data.artists).map((item,index) => (
                    <li className="ArtistItem">
                        <a key={index} href={`/artist/${item.id}`}>
                            <p>{item.name}</p>
                            <img src={item.image}></img>
                        </a>
                    </li>
                ))}
            </ul>
            <ul className="AlbumList">Albums
                {(data.albums).map((item,index) => (
                    <li className="AlbumItem">
                        <a key={index} href={`/album/${item.id}`}>
                            <p>{item.name}</p>
                            <img src={item.image}></img>
                        </a>
                    </li>
                ))}
            </ul>
            <ul className="TrackList">Tracks
                {(data.tracks).map((item,index) => (
                    <li className="TrackItem">
                        <a key={index} href={`/track/${item.id}`}>
                            <p>{item.name}</p>
                            <img src={item.album}></img>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default BroadSearch;