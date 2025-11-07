import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { setQuery, setPage, fetchAnimeResults } from "../store/searchSlice";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { query, page, results, totalPages, loading } = useSelector(
    (state: RootState) => state.search
  );

  const debouncedQuery = useDebounce(query, 250);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  useEffect(() => {
    if (!debouncedQuery) return;

    // Cancel previous request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    dispatch(fetchAnimeResults({ query: debouncedQuery, page, controller }));
  }, [debouncedQuery, page, dispatch]);

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 tracking-wide">Anime Search</h1>

        <input
          type="text"
          placeholder="Search for anime..."
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          className={`w-full px-4 py-3 rounded-lg border font-medium transition-colors duration-200 shadow-sm focus:outline-none ${
            isDark
              ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              : "bg-slate-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          }`}
        />
      </div>

      {results.length > 0 && (
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
          {results.map((anime) => (
            <Link
              key={anime.mal_id}
              to={`/anime/${anime.mal_id}`}
              className={`group block rounded-lg overflow-hidden border transition-shadow duration-200 shadow-sm ${
                isDark
                  ? "bg-gray-800 border-gray-600 hover:border-blue-500 hover:shadow-md"
                  : "bg-slate-100 border-gray-300 hover:border-blue-500 hover:shadow-md"
              }`}
            >
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-56 object-cover transition-transform duration-200 group-hover:scale-105"
              />

              <div
                className={`p-3 text-sm font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {anime.title}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => dispatch(setPage(p))}
          isDark={isDark}
        />
      )}
    </div>
  );
}
