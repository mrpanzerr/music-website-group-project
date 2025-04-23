import React, { useRef, useState } from 'react'

export default function postForm() {
    const header = useRef(null);
    const body = useRef(null);
    
    const handleSubmit = event => {
        event.preventDefault();

        const formData = {
            header : headerValue.current.value,
            body : bodyValue.current.value
        };

        try {
            const response = await
        }
    }
}