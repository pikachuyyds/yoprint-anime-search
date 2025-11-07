import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  setQuery,
  setPage,
  fetchAnimeResults,
  fetchTopAnimeList,
} from "../store/searchSlice";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { query, page, results, topResults, totalPages, error, loading } =
    useSelector((state: RootState) => state.search);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    if (query.trim() === "") {
      dispatch(fetchTopAnimeList());
    }
  }, [query, dispatch]);

  useEffect(() => {
    const handleReconnect = () => {
      if (query.trim() !== "") {
        // Trigger fetch for the current query and page
        const controller = new AbortController();
        abortControllerRef.current = controller;
        dispatch(fetchAnimeResults({ query, page, controller }));
      } else {
        dispatch(fetchTopAnimeList());
      }
    };

    window.addEventListener("online", handleReconnect);
    return () => window.removeEventListener("online", handleReconnect);
  }, [query, page, dispatch]);

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

      {loading && (
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-lg overflow-hidden border shadow-sm ${
                isDark
                  ? "bg-gray-800 border-gray-600"
                  : "bg-slate-100 border-gray-300"
              }`}
            >
              <div className="w-full h-56 animate-pulse bg-gray-400/30"></div>
              <div className="p-3">
                <div className="h-4 w-3/4 bg-gray-400/30 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query.trim() === "" && topResults.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <h2
            className={`text-xl font-semibold mt-10 mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Trending Anime 🔥
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {topResults.map((anime) => (
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
        </div>
      )}

      {!loading && error && (
        <div className="text-center mt-10 opacity-80">
          <p
            className={`text-lg font-medium ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            {error}
          </p>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Please try again or wait a moment.
          </p>
        </div>
      )}

      {!loading && !error && query.trim() !== "" && results.length === 0 && (
        <div className="text-center mt-10 opacity-80">
          <p
            className={`text-lg font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No anime found. Try another search.
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-10">
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
      {!loading && results.length > 0 && totalPages > 1 && (
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
