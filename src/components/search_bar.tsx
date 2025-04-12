import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GetData() {
    const [data, setData] = useState<{ name: string, image: string, type: string, artist: string[], id: string, album: string }[]>([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("artist");
	const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(`Setting type to: ${e.currentTarget.id}`);
        setType(e.currentTarget.id);
    };

    const handleSearch = () => {
        console.log(`Searching for: ${search} of type: ${type}`);
        // Perform the fetch request when the search button is clicked
        fetch("http://127.0.0.1:5000/search", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search: search, type: type })
        }).then(res => res.json()).then(
            responseData => {
                console.log('Fetched data:', responseData); // Log the fetched data
                setData(responseData);
            }
        ).catch(error => {
            console.error('Error fetching data:', error); // Catch and log errors
        });
    };

    useEffect(() => {
        // This is optional, but we can ensure the search automatically happens on `search` or `type` change
        if (search.trim() !== "") {
            console.log(`Automatically searching due to change in search or type.`);
            handleSearch();
        }
    }, [search, type]);
	
	const handleResultClick = (id: string, type: string) => {
		// Redirect to the respective page based on the type and id
		if (type === "artist") {
            navigate(`/artist/${id}`);
        } else if (type === "track") {
            navigate(`/track/${id}`);
        } else if (type === "album") {
            navigate(`/album/${id}`);
        }
	};

    return (
        <>
            <button id="artist" onClick={handleClick}>Artist</button>
            <button id="track" onClick={handleClick}>Track</button>
            <button id="album" onClick={handleClick}>Album</button>
            <button id="submit" onClick={handleSearch}>Search</button>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <input 
                    type="text" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search for music..." 
                />
            </form>
            <ul className="list-group">
                {data && data.map((item, index) => (
					<li
						key={index}
						className="list-group-item"
						onClick={() => handleResultClick(item.id, item.type)}
						style={{
							cursor: 'pointer',  // Pointer cursor on hover to indicate clickability
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '8px'
						}}
					>
						<div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <img
                                src={item.type === "track" ? item.album : item.image}
                                alt={`${item.name} image`}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover', // Ensures images are cropped correctly
                                    borderRadius: '5px',
                                    marginRight: '10px'
                                }}
                            />
                            <div>
                                <strong>{item.name}</strong>
                                {item.type === 'track' && <p>by {item.artist.join(', ')}</p>}
                            </div>
						</div>
					</li>
                ))}
            </ul>
        </>
    );
}
