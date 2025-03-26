function Message() {
    const name = "Ryan";
    if (name) return <h1>Whattupp {name}</h1>;
    else return <h1>No name</h1>
}

export default Message;