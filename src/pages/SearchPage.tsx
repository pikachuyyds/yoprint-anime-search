import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  setQuery,
  setPage,
  fetchAnimeResults,
  fetchTopAnimeList,
  setStatusFilter,
  setRatingFilter,
  setTypeFilter,
} from "../store/searchSlice";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import { CiCircleQuestion } from "react-icons/ci";

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    query,
    page,
    results,
    topResults,
    totalPages,
    errorTop,
    errorSearch,
    loadingTop,
    loadingSearch,
  } = useSelector((state: RootState) => state.search);

  const debouncedQuery = useDebounce(query, 250);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const { filters } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    dispatch(setPage(1));
    dispatch(setQuery(""));
  }, [dispatch]);

  useEffect(() => {
    if (!debouncedQuery) return;

    // Cancel previous request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    dispatch(
      fetchAnimeResults({ query: debouncedQuery, page, controller, filters })
    );
  }, [debouncedQuery, page, filters, dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    if (query.trim() === "") {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      dispatch(fetchTopAnimeList(controller));
    }
  }, [query, dispatch]);

  useEffect(() => {
    const handleReconnect = () => {
      if (query.trim() !== "") {
        // Trigger fetch for the current query and page
        const controller = new AbortController();
        abortControllerRef.current = controller;
        dispatch(fetchAnimeResults({ query, page, controller, filters }));
      } else {
        dispatch(fetchTopAnimeList());
      }
    };

    window.addEventListener("online", handleReconnect);
    return () => window.removeEventListener("online", handleReconnect);
  }, [query, page, filters, dispatch]);

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 tracking-wide">Anime Search</h1>

        {/* Horizontal filter bar */}
        <div className="max-w-3xl mx-auto flex flex-wrap gap-6 my-4 items-center justify-left">
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Type:
            </span>
            <select
              value={filters.type ?? ""}
              onChange={(e) => dispatch(setTypeFilter(e.target.value || null))}
              className={`px-2 py-1 rounded border ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            >
              <option value="">All Types</option>
              <option value="tv">TV</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
              <option value="special">Special</option>
              <option value="ona">ONA</option>
              <option value="music">Music</option>
              <option value="cm">CM</option>
              <option value="tv_special">TV Special</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Status:
            </span>
            <select
              value={filters.status ?? ""}
              onChange={(e) =>
                dispatch(setStatusFilter(e.target.value || null))
              }
              className={`px-2 py-1 rounded border ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            >
              <option value="">All Status</option>
              <option value="airing">Airing</option>
              <option value="complete">Complete</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-1 relative">
            <span
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-900"
              } flex items-center`}
            >
              Rating
              <span className="ml-1 relative group">
                <CiCircleQuestion
                  size={16}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                />
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-md p-2 text-xs text-white bg-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50`}
                >
                  G: All Ages | PG: Children | PG-13: Teens 13+ | R: 17+ | R+:
                  Mild Nudity | Rx: Hentai
                </div>
              </span>
              <span className="ml-1">:</span>
            </span>
            <select
              value={filters.rating ?? ""}
              onChange={(e) =>
                dispatch(setRatingFilter(e.target.value || null))
              }
              className={`px-2 py-1 rounded border ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            >
              <option value="">All Ratings</option>
              <option value="g">G</option>
              <option value="pg">PG</option>
              <option value="pg13">PG-13</option>
              <option value="r17">R-17</option>
              <option value="r">R+</option>
              <option value="rx">Rx</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for anime..."
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            className={`w-full px-4 py-3 rounded-lg border font-medium pr-12 transition-colors duration-200 shadow-sm focus:outline-none ${
              isDark
                ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                : "bg-slate-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            }`}
          />
        </div>
      </div>

      {(loadingTop || loadingSearch) && (
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

      {!loadingTop && query.trim() === "" && topResults.length > 0 && (
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

      {(!loadingTop && !loadingSearch && errorTop) ||
        (errorSearch && (
          <div className="text-center mt-10 opacity-80">
            <p
              className={`text-lg font-medium ${
                isDark ? "text-red-400" : "text-red-600"
              }`}
            >
              {errorTop || errorSearch}
            </p>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Please try again or wait a moment.
            </p>
          </div>
        ))}

      {!loadingSearch &&
        !errorSearch &&
        query.trim() !== "" &&
        results.length === 0 && (
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

      {!loadingSearch && results.length > 0 && (
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
      {!loadingTop &&
        !loadingSearch &&
        results.length > 0 &&
        totalPages > 1 && (
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
