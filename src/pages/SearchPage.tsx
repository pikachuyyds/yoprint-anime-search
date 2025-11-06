import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { setQuery, setPage, fetchAnimeResults } from "../store/searchSlice";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { query, page, results, totalPages, loading } = useSelector(
    (state: RootState) => state.search
  );

  const debouncedQuery = useDebounce(query, 250);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!debouncedQuery) return;

    // Cancel previous request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    dispatch(fetchAnimeResults({ query: debouncedQuery, page, controller }));
  }, [debouncedQuery, page, dispatch]);

  return (
    <div style={{ padding: "20px" }}>
      <div className="text-2xl font-bold mb-4">Anime Search</div>
      <input
        value={query}
        onChange={(e) => dispatch(setQuery(e.target.value))}
        placeholder="Search anime..."
        style={{ padding: "8px", width: "100%", marginBottom: "20px" }}
      />

      {loading && <p>Loading...</p>}

      <div style={{ display: "grid", gap: "12px" }}>
        {results.map((anime) => (
          <div
            key={anime.mal_id}
            style={{ border: "1px solid #ddd", padding: "10px" }}
          >
            <Link
              to={`/anime/${anime.mal_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={anime.images.jpg.image_url}
                width="80"
                alt={anime.title}
              />
              <div>{anime.title}</div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
          <button
            disabled={page <= 1}
            onClick={() => dispatch(setPage(page - 1))}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => dispatch(setPage(page + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
