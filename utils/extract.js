/**
 * extractImageUrls(html, limit)
 * Very small helper that extracts image urls commonly used by Pinterest (i.pinimg.com).
 * Returns up to `limit` unique URLs.
 */
function extractImageUrls(html, limit = 12) {
  // Pinterest images often use i.pinimg.com domain. This regex captures common image urls.
  const regex = /https?:\/\/i\.pinimg\.com\/[^"'<> \n\r]+?\.(?:png|jpe?g|gif|webp)/gi;
  const matches = html.match(regex) || [];
  const unique = [...new Set(matches)];
  return unique.slice(0, limit);
}

module.exports = { extractImageUrls };
