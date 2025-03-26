import { useEffect, useState } from 'react';
//Sample componenet im using to test how to get data from server API and format it
function GetData() {
    const [data,setData] = useState<{name : string, image: string, type: string }[]>([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/search").then(res => res.json()).then(
            responseData => {
                setData(responseData);
                console.log(responseData);
            }
        ).catch(error => console.error('Error fetching data:', error));
    }, []);
    //This is where it converts the data in HTML
    return (
        <ul className = "list-group">
            {data.map((items, index) => (
                <li key= {index}className = "list-group-item">{items.name} <img src={items.image}></img> {items.type}</li>
            ))}
        </ul>
    );
}

export default GetData;