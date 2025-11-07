import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type ThemeState = {
  mode: "light" | "dark";
};

const initialState: ThemeState = {
  mode: "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<"light" | "dark">) {
      state.mode = action.payload;
    },
    toggleMode(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const { setMode, toggleMode } = themeSlice.actions;
export default themeSlice.reducer;
