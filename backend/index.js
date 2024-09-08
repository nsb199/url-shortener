const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const shortid = require('shortid');

// Create express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://singhneeraj199199:op4LRVuxMNOZyCuu@cluster0.kxdff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Create URL Schema
const UrlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    urlCode: String,
    date: { type: String, default: Date.now }
});

const Url = mongoose.model('Url', UrlSchema);

// POST request to shorten a URL
app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const urlCode = shortid.generate();
    
    try {
        let url = await Url.findOne({ longUrl });

        if (url) {
            res.json(url);
        } else {
            const shortUrl = `http://localhost:5000/${urlCode}`;
            url = new Url({
                longUrl,
                shortUrl,
                urlCode
            });
            await url.save();
            res.json(url);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// GET request to redirect using the short URL
app.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });

        if (url) {
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
