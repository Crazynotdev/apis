const fetch = require('node-fetch');
const { extractImageUrls } = require('../utils/extract');

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9'
};

/**
 * Search Pinterest for image pins and return normalized results.
 * Note: This scrapes the public search result page. Use responsibly and respect robots.txt / Terms of Use.
 */
async function searchImages(query, limit = 12) {
  const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

  const response = await fetch(searchUrl, { headers: DEFAULT_HEADERS });
  if (!response.ok) {
    throw new Error(`Failed to fetch Pinterest page: ${response.status}`);
  }
  const html = await response.text();

  const urls = extractImageUrls(html, limit);

  return urls.map((url, i) => ({
    id: i + 1,
    url,
    // attempt a thumbnail variant; if the pattern doesn't match, we fallback to original url
    thumb: url.includes('/originals/') ? url.replace('/originals/', '/236x/') : url,
    source: 'pinterest'
  }));
}

module.exports = { searchImages };
