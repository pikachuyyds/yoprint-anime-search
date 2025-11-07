import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
