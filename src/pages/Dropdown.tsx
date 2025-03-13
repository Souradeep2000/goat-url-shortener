import { useEffect, useState, useRef, useCallback } from "react";
import "./PaginatedDropdown.css";

interface UrlItem {
  shortUrl: string;
}

interface PaginatedDropdownProps {
  token: string | null;
}

export default function PaginatedDropdown({ token }: PaginatedDropdownProps) {
  const [items, setItems] = useState<UrlItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchItems = useCallback(
    async (pageNum: number) => {
      try {
        const response = await fetch(
          `https://gus-8uyl.onrender.com/api/user?page=${pageNum}&limit=10`,
          //   `http://localhost:5001/api/user?page=${pageNum}&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "Unbearer",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setItems((prev) =>
            pageNum === 1 ? data.urls : [...prev, ...data.urls]
          );
          setHasMore(pageNum < data.pagination.totalPages);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch items", error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      fetchItems(1);
    }
  }, [isOpen, fetchItems]);

  // ✅ Load more pages when scrolling
  useEffect(() => {
    if (isOpen && page > 1) {
      fetchItems(page);
    }
  }, [page, isOpen, fetchItems]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight;
    if (bottom && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="dropdown-container">
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
        Check Your Creations <span className="chevron">▼</span>
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="dropdown-menu"
          onScroll={handleScroll}
        >
          <div className="dropdown-content">
            {items.length ? (
              items.map((item) => (
                <div key={item.shortUrl} className="dropdown-item">
                  {item.shortUrl}
                </div>
              ))
            ) : (
              <div className="dropdown-empty">No items available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
