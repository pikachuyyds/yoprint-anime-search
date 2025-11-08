import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "./store/themeSlice";
import type { RootState } from "./store";

function App() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  const isDark = mode === "dark";

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-white" : "bg-slate-200 text-gray-900"
      } min-h-screen p-4`}
    >
      <div className="flex gap-3 mb-6 pl-6 items-center">
        <label className="text-md">Theme:</label>
        <button
          onClick={() => dispatch(toggleMode())}
          className={`px-4 py-2 rounded-lg font-medium border transition-colors duration-200 shadow-sm cursor-pointer
            ${
              isDark
                ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
            }`}
        >
          {isDark ? "Light" : "Dark"}
        </button>
      </div>

      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/anime/:id" element={<DetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
