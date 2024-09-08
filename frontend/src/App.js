import React, { useState } from 'react';

function App() {
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://url-shortener-backend-4nko.onrender.com/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ longUrl })
            });

            if (response.ok) {
                const data = await response.json();
                setShortUrl(data.shortUrl);
            } else {
                console.error('Failed to shorten URL:', response.statusText);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    return (
        <div className="App">
            <h1>URL Shortener</h1>
            <form onSubmit={handleSubmit}>
                <label>Enter a long URL:</label>
                <input
                    type="text"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    required
                />
                <button type="submit">Shorten URL</button>
            </form>
            {shortUrl && (
                <div>
                    <p>Shortened URL: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a></p>
                </div>
            )}
        </div>
    );
}

export default App;
