import axios from "axios";
import type { AnimeSearchResponse } from "../types/anime";

const API_BASE = "https://api.jikan.moe/v4";

export const searchAnime = async (
  query: string,
  page: number,
  signal?: AbortSignal
): Promise<AnimeSearchResponse> => {
  const response = await axios.get(`${API_BASE}/anime`, {
    params: { q: query, page, limit: 10 },
    signal,
  });
  return response.data;
};

export const fetchAnimeById = async (id: string, signal?: AbortSignal) => {
  const response = await axios.get(`${API_BASE}/anime/${id}/full`, { signal });
  console.log(response.data.data);
  return response.data.data;
};

export const fetchTopAnime = async (
  signal?: AbortSignal
): Promise<AnimeSearchResponse> => {
  const response = await axios.get(`${API_BASE}/top/anime`, {
    params: { limit: 10 },
    signal,
  });
  return response.data;
};
