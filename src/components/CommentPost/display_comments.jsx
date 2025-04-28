import { useState } from 'react';

const CommentDispay = () => {
    full_url = window.location.href;
    url_segments = full_url.split('/');
    last_segment = url_segments.pop()
    console.log(`Searching for comments under ${last_segment}`)
    try {
        fetch()
    }
    catch {

    }
}