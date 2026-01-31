const express = require('express');
const fetch = require('node-fetch');
const PORT = 3000;
const app = express();
app.use(express.json());

function imgSearch(html, limit = 12) {
    const regex = /src=["'](https?:\/\/[^"']+\.(?:png|jpg|jpeg|gif|bmp|webp))["']/gi;
    const match = html.match(regex) || [];
    const unique = [...new Set(match)];

    return unique.slice(0, limit).map((url, i) => ({
        id: i + 1,
        url,
        thumb: url.replace(/\/original\//, '/236x/'),
        source: 'pinterest'
    }));

}
app.get('api/images/search', async (req, res) => {
    try {
        const {q, limit = 12} = req.query;
        if (!q) {
            return res.status(400).json({error: 'Query parameter "q" is required.'});
        }
        const searchUrl = await fetch(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`);
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        const html = await response.text();
        const result = extractPinterestImages(html, number(limit));

        res.json({
            query: q,
            count: result.length,
            results
        })
    } catch (error) {
        res.status(500).json({error: 'An error occurred while processing your request.'});
    }
}
);
app.get('/api/health', (_, res) => {
    res.json({
        status: 'ok', 
        provider: 'pinterest'
    });
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
});