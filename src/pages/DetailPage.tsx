import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAnimeById } from "../services/jikan";
import type { Anime } from "../types/anime";

export default function AnimeDetailPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchAnimeById(id)
      .then((data) => {
        setAnime(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (!anime) return <p style={{ padding: "20px" }}>Anime not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/" style={{ display: "inline-block", marginBottom: "20px" }}>
        ← Back to Search
      </Link>

      <h1>{anime.title}</h1>

      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        style={{ width: "200px", borderRadius: "8px", marginBottom: "20px" }}
      />

      <p style={{ maxWidth: "600px", lineHeight: "1.6" }}>
        {anime.synopsis || "No description available."}
      </p>
    </div>
  );
}
