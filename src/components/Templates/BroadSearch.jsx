import { useParams } from 'react-router-dom';
import { useState,useEffect} from 'react';

const BroadSearch = () => {
    const [data,setData] = useState({"artists" : [], "albums" : [], "tracks" : []});
    const { search } = useParams();
    
    useEffect(() => {
		fetch(`http://127.0.0.1:5000/broadsearch/${search}`)
        .then(res => res.json())
        .then(responseData => {
            console.log(responseData);  // Log to inspect data
            setData(responseData);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, [search]);

    if (!data || !data.artists.length) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <ul>ARTISTS
                {data.artists.map((item,index) => (
                    <li key={index}>
                        <a href={`/artist/${item.id}`}>
                            <p>{item.name}</p>
                            <img src={item.image}></img>
                        </a>
                    </li>
                ))}
            </ul>
            <ul>ALBUMS
                {data.albums.map((item,index) => (
                    <li key={index}>
                        <a href={`/album/${item.id}`}>
                            <p>{item.name}</p>
                            <img src={item.image}></img>
                        </a>
                    </li>
                ))}
            </ul>
            <ul>TRACKS
                {data.tracks.map((item,index) => (
                    <li key={index}>
                        <a href={`/track/${item.id}`}>
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