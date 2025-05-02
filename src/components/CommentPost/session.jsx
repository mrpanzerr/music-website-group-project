export default async function checkSession() {
    const query = await fetch("http://127.0.01:5000/check-session", {
            method: "GET",
            credentials: "include",
        });
        const data = await query.json();
        console.log(data.sessionSet)
        return data.sessionSet
        
}