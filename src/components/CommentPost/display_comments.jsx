import { useState } from 'react';

const CommentDispay = () => {
    full_url = window.location.href;
    url_segments = full_url.split('/');
    last_segment = url_segments.pop()
    console.log(`Searching for comments under ${last_segment}`)

        fetch("http://127.0.01:5000/createpost", {
            method: "POST",
            credentials: "include",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({last_segment}),
        }).then(res => res.json()),then(
            responseData => {
                console.log(`Got comment data${responseData}`)
            }
        );
    }

        console.log("error occured when fetching comment data")
    }
}