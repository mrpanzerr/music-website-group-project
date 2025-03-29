import { useEffect, useState } from 'react';

//Component that takes a search value from an input and returns a list with 5 data objects
export default function GetData() {
    //
    const [data,setData] = useState<{name : string, image: string, type: string }[]>([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("artist");

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setType(e.currentTarget.id)
    }
    useEffect(() => {
        fetch("http://127.0.0.1:5000/search", {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'}, 
            body: JSON.stringify({search: search, type : type})
        }).then(res => res.json()).then(
            responseData => {
                setData(responseData);
                console.log(responseData);
                console.log(type)
            }
        ).catch(error => console.error('Error fetching data:', error));
    }, [search,type]);
    //This is where it converts the data in HTML
    return (
        <>  
            <button id="artist" onClick={handleClick}>Artist</button>
            <button id="track" onClick={handleClick}>Track</button>
            <button id="album" onClick={handleClick}>Album</button>
            <button id="submit">Search</button>
            <form>
                <input type="text" value = {search} onChange={(e) => setSearch(e.target.value)}></input>
            </form>
            <ul className = "list-group">
                {data && data.map((items, index) => (
                    <li key= {index}className = "list-group-item">{items.name} <img src={items.image == "" && items.type != "track" ? "images/no_result.png" : items.type == "track" ? "images/null.png":  items.image}></img> {items.type}</li>
                ))}
            </ul>
        </>
    );
}


