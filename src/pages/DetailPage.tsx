import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";
import {
  fetchAnimeDetails,
  setErrorDetail,
  clearSelectedAnime,
} from "../store/searchSlice";
import { FaStar } from "react-icons/fa";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAnime, errorDetail, loadingDetail } = useSelector(
    (state: RootState) => state.search
  );
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const abortControllerRef = useRef<AbortController | null>(null);
  const [showError, setShowError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let errorTimer: ReturnType<typeof setTimeout> | undefined;
    let skeletonTimer: ReturnType<typeof setTimeout> | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    if (loadingDetail) {
      setShowSkeleton(true);
      setShowError(false);
    } else if (errorDetail?.includes("429") && id) {
      // rate limit error
      setShowSkeleton(false);
      setShowError(true);
      //auto-retry after 1s
      retryTimer = setTimeout(() => {
        if (id) {
          const controller = new AbortController();
          abortControllerRef.current = controller;
          dispatch(fetchAnimeDetails({ id, controller }));
        }
      }, 1000);
    } else if (!selectedAnime && errorDetail) {
      // delay error only if fetch finished and there is no data
      errorTimer = setTimeout(() => setShowError(true), 1000);
      // ensure skeleton shows at least briefly
      skeletonTimer = setTimeout(() => setShowSkeleton(false), 800);
    } else {
      // data exists, no error
      setShowSkeleton(false);
      setShowError(false);
    }

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(skeletonTimer);
      clearTimeout(retryTimer);
    };
  }, [loadingDetail, selectedAnime, errorDetail, id, dispatch]);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!navigator.onLine) {
      clearSelectedAnime();
      dispatch(setErrorDetail("Network is offline."));
    } else {
      dispatch(fetchAnimeDetails({ id, controller }));
    }
    const handleReconnect = () => {
      dispatch(fetchAnimeDetails({ id, controller: new AbortController() }));
    };

    window.addEventListener("online", handleReconnect);

    return () => {
      window.removeEventListener("online", handleReconnect);
      abortControllerRef.current?.abort();
    };
  }, [id, dispatch]);

  if (showSkeleton) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div
            className={`w-full md:w-72 h-96 rounded-lg animate-pulse ${
              isDark ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
          <div className="flex-1 space-y-4">
            <div
              className={`h-8 w-2/3 rounded animate-pulse ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-4 w-1/2 rounded animate-pulse ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-4 w-1/3 rounded animate-pulse ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-4 w-1/4 rounded animate-pulse ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              }`}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center space-y-4">
        <h2
          className={`${
            isDark ? "text-gray-200" : "text-gray-700"
          } text-xl font-semibold`}
        >
          {errorDetail ?? "Anime not found."}
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Please try again or return to search.
        </p>
        <Link to="/">
          <button
            className={`mb-3 px-3 py-1 rounded-lg border font-medium transition-colors duration-200 shadow-sm cursor-pointer focus:ring-2 focus:ring-blue-500/50
            ${
              isDark
                ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                : "bg-slate-100 text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            Back
          </button>
        </Link>
      </div>
    );
  }

  const anime = selectedAnime;
  if (!anime) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Back */}
      <Link to="/">
        <button
          className={`mb-3 px-3 py-1 rounded-lg border font-medium transition-colors duration-200 shadow-sm cursor-pointer
            ${
              isDark
                ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                : "bg-slate-100 text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
            }`}
        >
          Back
        </button>
      </Link>

      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <img
          src={
            anime.images?.jpg?.large_image_url ?? anime.images?.jpg?.image_url
          }
          alt={anime.title}
          className="w-full md:w-72 rounded-lg shadow-lg"
        />

        {/* Details */}
        <div className="flex-1 space-y-3">
          <h1 className="text-4xl font-bold">{anime.title}</h1>

          <div
            className={`${
              isDark ? "text-gray-300" : "text-gray-700"
            } text-sm space-y-1`}
          >
            <p>
              <span className="font-semibold">Type:</span> {anime.type}
            </p>
            <p>
              <span className="font-semibold">Episodes:</span> {anime.episodes}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {anime.status}
            </p>
            <p>
              <span className="font-semibold">Duration:</span> {anime.duration}
            </p>
            <p>
              <span className="font-semibold">Studio:</span>{" "}
              {anime.studios?.[0]?.name || "-"}
            </p>
            <p className="flex items-center gap-1">
              <span className="font-semibold">Score:</span>
              <FaStar className="text-yellow-400" size={14} />
              <span>{anime.score}</span>
            </p>
          </div>

          {/* Genres */}
          {anime.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {anime.genres.map((g) => (
                <span
                  key={g.mal_id}
                  className="px-3 py-1 text-xs rounded-full border border-blue-400/40 bg-blue-400/10"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trailer */}
      {anime.trailer?.embed_url && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Trailer</h2>
          <div className="aspect-video w-full max-w-3xl">
            <iframe
              src={anime.trailer.embed_url}
              className="w-full h-full rounded-lg shadow-lg"
              allowFullScreen
              loading="lazy"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      )}

      {/* Synopsis */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">Synopsis</h2>
        <p className="text-gray-300 leading-relaxed">
          {anime.synopsis || "No synopsis available."}
        </p>
      </div>

      {/* Relations (Prequel / Adaptation) */}
      {anime.relations && anime.relations?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Related</h2>
          <div className="space-y-2 text-sm text-gray-300">
            {anime.relations.map((rel, idx) => (
              <div key={idx}>
                <span className="font-semibold">{rel.relation}:</span>{" "}
                {rel.entry.map((r) => (
                  <Link
                    key={r.mal_id}
                    to={`/anime/${r.mal_id}`}
                    className="text-blue-400 hover:underline mr-2"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
