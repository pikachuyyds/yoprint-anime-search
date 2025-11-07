import React from "react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  isDark?: boolean;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  isDark,
}: Props) {
  const maxButtons = 5;
  const start = Math.max(
    Math.min(page - Math.floor(maxButtons / 2), totalPages - maxButtons),
    1
  );
  const end = Math.min(start + maxButtons - 1, totalPages);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const baseButton =
    "px-3 py-1 rounded-lg border font-medium transition-colors duration-200 shadow-sm";

  return (
    <div className="flex justify-center mt-10">
      <ul className="flex items-center gap-2">
        {/* Prev */}
        <li>
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className={`${baseButton} ${
              page <= 1
                ? "opacity-40 cursor-not-allowed"
                : isDark
                ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            Prev
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((p) => (
          <li key={p}>
            <button
              onClick={() => onPageChange(p)}
              className={`${baseButton} ${
                isDark
                  ? `border-gray-600 ${
                      p === page
                        ? "bg-gray-700 text-white"
                        : "bg-gray-800 text-white"
                    } hover:bg-gray-700`
                  : `border-gray-300 ${
                      p === page
                        ? "bg-gray-300 text-gray-900"
                        : "bg-white text-gray-900"
                    } hover:bg-gray-100`
              }`}
            >
              {p}
            </button>
          </li>
        ))}

        {/* Next */}
        <li>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className={`${baseButton} ${
              page >= totalPages
                ? "opacity-40 cursor-not-allowed"
                : isDark
                ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
}
