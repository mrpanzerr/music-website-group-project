import { useEffect, useState } from 'react';

export default function GetData() {
    const [data, setData] = useState<{ name: string, image: string, type: string, artist: string[], id: string, album: string }[]>([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("artist");

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
                    item.type === "track" ? (
                        <li className="list-group-item" key={index}>
                            {item.name} by {item.artist.join(', ')} 
                            <img src={item.album} alt={`${item.name} album cover`} />
                        </li>
                    ) : item.type === "artist" ? (
                        <li className="list-group-item" key={index}>
                            {item.name} 
                            <img src={item.image} alt={`${item.name} profile`} />
                        </li>
                    ) : (
                        <li className="list-group-item" key={index}>
                            {item.name} by {item.artist.join(', ')} 
                            <img src={item.image} alt={`${item.name} album cover`} />
                        </li>
                    )
                ))}
            </ul>
        </>
    );
}
