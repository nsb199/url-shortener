const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const shortid = require('shortid');
require('dotenv').config(); 
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); 


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
});

const UrlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    urlCode: { type: String, required: true },
    date: { type: Date, default: Date.now } 
});

const Url = mongoose.model('Url', UrlSchema);


app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const urlCode = shortid.generate();
    
    try {
        let url = await Url.findOne({ longUrl });

        if (url) {
            return res.json(url);
        } else {
            const shortUrl = `${req.protocol}://${req.get('host')}/${urlCode}`;
            url = new Url({
                longUrl,
                shortUrl,
                urlCode
            });
            await url.save();
            return res.json(url);
        }
    } catch (err) {
        console.error("Error during URL shortening:", err);
        return res.status(500).json('Server error');
    }
});

app.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });

        if (url) {
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error("Error during URL redirection:", err);
        return res.status(500).json('Server error');
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
