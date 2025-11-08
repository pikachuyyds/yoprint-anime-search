import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchAnime, fetchAnimeById, fetchTopAnime } from "../services/jikan";
import type { Anime } from "../types/anime";

type SearchState = {
  query: string;
  page: number;
  results: Anime[];
  topResults: Anime[];
  totalPages: number;
  loadingSearch: boolean;
  loadingTop: boolean;
  loadingDetail: boolean;
  errorSearch: string | null;
  errorTop: string | null;
  errorDetail: string | null;
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
  loadingSearch: false,
  loadingTop: false,
  loadingDetail: false,
  errorSearch: null,
  errorTop: null,
  errorDetail: null,
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
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new Error("Fetch aborted");
      }
      // Check for network offline error
      if (err instanceof TypeError && !navigator.onLine) {
        throw new Error("Network is offline. Please check your connection.");
      }
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
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new Error("Fetch aborted");
      }
      // Check for network offline error
      if (err instanceof TypeError && !navigator.onLine) {
        throw new Error("Network is offline. Please check your connection.");
      }
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
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new Error("Fetch aborted");
      }
      // Check for network offline error
      if (err instanceof TypeError && !navigator.onLine) {
        throw new Error("Network is offline. Please check your connection.");
      }
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
        state.errorSearch = null;
        state.loadingSearch = false;
        state.selectedAnime = null;
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
    setErrorDetail(state, action: { payload: string }) {
      state.errorDetail = action.payload;
    },
    clearSelectedAnime(state) {
      state.selectedAnime = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeResults.pending, (state) => {
        state.loadingSearch = true;
        state.errorSearch = null;
        state.errorTop = null;
        state.results = [];
      })
      .addCase(fetchAnimeResults.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.loadingSearch = false;
        state.errorSearch = null;
        state.errorTop = null;
        state.results = action.payload.data ?? [];
        if (
          action.payload.pagination &&
          typeof action.payload.pagination.last_visible_page === "number"
        ) {
          state.totalPages = action.payload.pagination.last_visible_page;
        } else {
          state.totalPages = 1;
        }
      })
      .addCase(fetchAnimeResults.rejected, (state, action) => {
        state.loadingSearch = false;
        state.results = [];
        if ((action.error.message ?? "") !== "Fetch aborted") {
          state.errorSearch =
            action.error.message ?? "Failed to fetch anime. Please try again.";
        }
      });
    builder
      .addCase(fetchAnimeDetails.pending, (state) => {
        state.loadingDetail = true;
        state.errorDetail = null;
        state.selectedAnime = null;
      })
      .addCase(fetchAnimeDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.loadingDetail = false;
        state.errorDetail = null;
        state.selectedAnime = action.payload;
      })
      .addCase(fetchAnimeDetails.rejected, (state, action) => {
        state.loadingDetail = false;
        if ((action.error.message ?? "") !== "Fetch aborted") {
          state.errorDetail =
            action.error.message ?? "Failed to fetch anime details.";
        }
      });
    builder
      .addCase(fetchTopAnimeList.pending, (state) => {
        state.loadingTop = true;
        state.errorTop = null;
        state.errorSearch = null;
      })
      .addCase(fetchTopAnimeList.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.errorSearch = null;
        state.errorTop = null;
        state.loadingTop = false;
        state.topResults = action.payload.data;
      })
      .addCase(fetchTopAnimeList.rejected, (state, action) => {
        state.loadingTop = false;
        if ((action.error.message ?? "") !== "Fetch aborted") {
          state.errorTop = action.error.message ?? "Failed to fetch top anime.";
        }
      });
  },
});

export const {
  setQuery,
  setPage,
  setTypeFilter,
  setStatusFilter,
  setRatingFilter,
  setErrorDetail,
  clearSelectedAnime,
} = searchSlice.actions;
export default searchSlice.reducer;
