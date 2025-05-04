import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './BroadSearch.css';


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

    if (!data || !data.artists.length) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <div className="page-header">
				<h1 className="sideB">Side A</h1>
				<img src="../../../public/images/playbackarrow.png"></img>
			</div>
            <div className="BroadSearch">
                <h1>-Artists-</h1>
                <ul className="ArtistList">
                    {(data.artists).map((item,index) => (
                        <li className="ArtistItem">
                            <a key={index} href={`/artist/${item.id}`}>
                                <p>{item.name}</p>
                                <img src={item.image}></img>
                            </a>
                        </li>
                    ))}
                </ul>
                <h1>-Albums-</h1>
                <ul className="AlbumList">
                    {(data.albums).map((item,index) => (
                        <li className="AlbumItem">
                            <a key={index} href={`/album/${item.id}`}>
                                <p>{item.name}</p>
                                <img src={item.image}></img>
                            </a>
                        </li>
                    ))}
                </ul>
                <h1>-Tracks-</h1>
                <ul className="TrackList">
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
            <div className="page-footer"></div>
        </div>
    )
}
export default BroadSearch;