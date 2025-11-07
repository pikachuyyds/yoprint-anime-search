import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";
import { fetchAnimeDetails } from "../store/searchSlice";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAnime, loading } = useSelector(
    (state: RootState) => state.search
  );

  useEffect(() => {
    if (id) dispatch(fetchAnimeDetails(id));
  }, [id, dispatch]);

  if (loading || !selectedAnime) {
    return (
      <div className="p-6 text-center text-gray-300">
        Loading anime details...
      </div>
    );
  }

  const anime = selectedAnime;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Back Button */}
      <Link
        to="/"
        className="text-purple-400 hover:underline mb-6 inline-block"
      >
        ← Back to Search
      </Link>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="w-full md:w-72 rounded-lg shadow-lg"
        />

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-3">{anime.title}</h1>

          <div className="text-gray-300 space-y-2 text-sm">
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
              <span className="font-semibold">Score:</span> ⭐ {anime.score}
            </p>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Synopsis</h2>
        <p className="text-gray-300 leading-relaxed max-w-3xl">
          {anime.synopsis || "No synopsis available."}
        </p>
      </div>
    </div>
  );
}
