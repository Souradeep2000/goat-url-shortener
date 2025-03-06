import { useState } from "react";
import "./UrlShortener.css"; // Import CSS file

export default function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch(
        "https://gus-8uyl.onrender.com/api/shorturl",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customAlias,
            longUrl: originalUrl,
            region: "asia",
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-shortener-container">
      <div className="url-shortener-box">
        <h2 className="url-shortener-title">URL Shortener</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Original URL:</label>
            <input
              type="text"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Enter long URL"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Custom Alias (optional):</label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="Enter alias"
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {shortUrl && (
          <div className="short-url-container">
            <p>Shortened URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="short-url"
            >
              {shortUrl}
            </a>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
