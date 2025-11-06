import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchAnime } from "../services/jikan";
import type { Anime } from "../types/anime";

interface SearchState {
  query: string;
  page: number;
  results: Anime[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: "",
  page: 1,
  results: [],
  totalPages: 1,
  loading: false,
  error: null,
};

export const fetchAnimeResults = createAsyncThunk(
  "search/fetchAnimeResults",
  async ({
    query,
    page,
    controller,
  }: {
    query: string;
    page: number;
    controller: AbortController;
  }) => {
    const response = await searchAnime(query, page, controller.signal);
    return response;
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
      state.page = 1; // reset to page 1 when new search term entered
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data;
        state.totalPages = action.payload.pagination.last_visible_page;
      })
      .addCase(fetchAnimeResults.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch anime.";
      });
  },
});

export const { setQuery, setPage } = searchSlice.actions;
export default searchSlice.reducer;
