import { useEffect, useState } from "react";
import "./UrlShortener.css";
import Login from "./login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PaginatedDropdown from "./Dropdown";

export default function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Fetch token globally when user logs in
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fetchedToken = await user.getIdToken();
        setToken(fetchedToken);
      } else {
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      // const auth = getAuth();
      // const user = auth.currentUser;

      // if (!user) {
      //   console.log("User is not authenticated. Going with ip.");
      // }

      // const token = !user ? null : await user.getIdToken();

      const response = await fetch(
        "https://gus-8uyl.onrender.com/api/shorturl",
        // "http://localhost:5001/api/shorturl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: !token ? `Unbearer` : `Bearer ${token}`,
          },
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
      <Login />

      <div className="url-shortener-box">
        <h2 className="url-shortener-title">URL Shortener</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Original URL:</label>
            <textarea
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Enter long URL"
              className="form-input"
              required
              rows={1}
              style={{ overflow: "hidden", resize: "none" }}
              onInput={(e) => {
                e.currentTarget.style.height = "auto"; // Reset height
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
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

      <PaginatedDropdown token={token} />
    </div>
  );
}
