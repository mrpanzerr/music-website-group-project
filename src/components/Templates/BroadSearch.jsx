import { useParams, useState } from 'react-router-dom';

const BroadSearch = () => {
    const [data,setData] = useState();
    const { search } = useParams();
    
    useEffect(() => {
		fetch(`http://127.0.0.1:5000/broadsearch`)
        .then(res => res.json())
        .then(responseData => {
            console.log(responseData);  // Log to inspect data
            setData(responseData);
        })
        .catch(error => console.error('Error fetching data:', error));
}, [search]);

    return (
        <div>
            <ul>
                {data.artists.map((item,index) => {
                    <a href={`/artist/${item.id}`}>
                        <li key={index}>
                            <p>{item.name}</p>
                            <img src={item.image}></img>
                        </li>
                    </a>
                })}
            </ul>
            <ul>
                {data.albums.map((item,index) => {
                    <a href={`/artist/${item.id}`}>
                        <li key={index}>
                            <p>{item.name}</p>
                            <img src={item.image}></img>
                        </li>
                    </a>
                })}
            </ul>
            <ul>
                {data.tracks.map((item,index) => {
                    <a href={`/artist/${item.id}`}>
                        <li key={index}>
                            <p>{item.name}</p>
                            <img src={item.image}></img>
                        </li>
                    </a>
                })}
            </ul>
        </div>
    )
}