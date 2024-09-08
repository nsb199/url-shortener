const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const shortid = require('shortid');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const UrlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    urlCode: String,
    date: { type: String, default: Date.now }
});

const Url = mongoose.model('Url', UrlSchema);

app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const urlCode = shortid.generate();
    
    try {
        let url = await Url.findOne({ longUrl });

        if (url) {
            console.log('URL already exists:', url);
            res.json(url);
        } else {
            const shortUrl = `${req.protocol}://${req.get('host')}/${urlCode}`;
            url = new Url({
                longUrl,
                shortUrl,
                urlCode
            });
            await url.save();
            console.log('URL shortened and saved:', url);
            res.json(url);
        }
    } catch (err) {
        console.error('Error in /shorten:', err);
        res.status(500).json('Server error');
    }
});

app.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });

        if (url) {
            console.log('Redirecting to long URL:', url.longUrl);
            return res.redirect(url.longUrl);
        } else {
            console.log('No URL found for code:', req.params.code);
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error('Error in /:code:', err);
        res.status(500).json('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
