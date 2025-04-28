
const CommentDispay = () => {
    full_url = window.location.href;
    url_segments = full_url.split('/');
    last_segment = url_segments.pop()
    console.log(`Searching for comments under ${last_segment}`)
    try {
        fetch("http://127.0.01:5000/getposts", {
            method : "POST",
            credentials : "include",
            headers : {"Content-Type" : "application/json"},
            body : last_segment
        })
    }
    catch {

    }
}