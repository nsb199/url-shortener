import React, { useState } from 'react';

function App() {
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ longUrl })
            });

            const data = await response.json();
            setShortUrl(data.shortUrl);
        } catch (err) {
            console.error(err);
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
