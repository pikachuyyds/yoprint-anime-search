import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchAnime, fetchAnimeById, fetchTopAnime } from "../services/jikan";
import type { Anime } from "../types/anime";

type SearchState = {
  query: string;
  page: number;
  results: Anime[];
  topResults: Anime[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  selectedAnime?: Anime | null;
  filters: {
    type: string | null;
    status: string | null;
    rating: string | null;
  };
};

const initialState: SearchState = {
  query: "",
  page: 1,
  results: [],
  topResults: [],
  totalPages: 1,
  loading: false,
  error: null,
  selectedAnime: null,
  filters: { type: null, status: null, rating: null },
};

export const fetchAnimeResults = createAsyncThunk(
  "search/fetchAnimeResults",
  async ({
    query,
    page,
    controller,
    filters,
  }: {
    query: string;
    page: number;
    controller: AbortController;
    filters: {
      type: string | null;
      status: string | null;
      rating: string | null;
    };
  }) => {
    try {
      const params = {
        type: filters.type ?? undefined,
        status: filters.status ?? undefined,
        rating: filters.rating ?? undefined,
      };

      const response = await searchAnime(
        query,
        page,
        controller.signal,
        params
      );
      return response;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      throw err;
    }
  }
);

export const fetchAnimeDetails = createAsyncThunk(
  "search/fetchAnimeDetails",
  async ({ id, controller }: { id: string; controller?: AbortController }) => {
    try {
      const response = await fetchAnimeById(id, controller?.signal);
      return response;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      throw err;
    }
  }
);

export const fetchTopAnimeList = createAsyncThunk(
  "search/fetchTopAnimeList",
  async (controller?: AbortController) => {
    try {
      const response = await fetchTopAnime(controller?.signal);
      return response;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      throw err;
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
      state.page = 1;

      if (action.payload.trim() === "") {
        state.results = [];
        state.totalPages = 1;
      }
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setTypeFilter(state, action) {
      state.filters.type = action.payload;
    },
    setStatusFilter(state, action) {
      state.filters.status = action.payload;
    },
    setRatingFilter(state, action) {
      state.filters.rating = action.payload;
    },
    clearSelectedAnime(state) {
      state.selectedAnime = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeResults.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.loading = false;
        state.results = action.payload.data;
        state.totalPages = action.payload.pagination.last_visible_page;
      })
      .addCase(fetchAnimeResults.rejected, (state) => {
        state.loading = false;
        if (state.query.trim() !== "") {
          state.error = "Failed to fetch anime.";
        } else {
          state.error = null; // don't show error for empty query
        }
      });
    builder
      .addCase(fetchAnimeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.loading = false;
        state.selectedAnime = action.payload;
        state.error = null;
      })
      .addCase(fetchAnimeDetails.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch anime details.";
        state.selectedAnime = null;
      });
    builder
      .addCase(fetchTopAnimeList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopAnimeList.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.loading = false;
        state.topResults = action.payload.data;
      })
      .addCase(fetchTopAnimeList.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch top anime.";
      });
  },
});

export const {
  setQuery,
  setPage,
  setTypeFilter,
  setStatusFilter,
  setRatingFilter,
  clearSelectedAnime,
  clearError,
} = searchSlice.actions;
export default searchSlice.reducer;
