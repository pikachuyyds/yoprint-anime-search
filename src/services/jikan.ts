import axios from "axios";
import type { AnimeSearchResponse } from "../types/anime";

const API_BASE = "https://api.jikan.moe/v4";

export const searchAnime = async (
  query: string,
  page: number,
  signal?: AbortSignal
): Promise<AnimeSearchResponse> => {
  const response = await axios.get(`${API_BASE}/anime`, {
    params: { q: query, page },
    signal,
  });
  return response.data;
};

export const fetchAnimeById = async (id: string) => {
  const response = await axios.get(`${API_BASE}/anime/${id}`);
  return response.data.data;
};
