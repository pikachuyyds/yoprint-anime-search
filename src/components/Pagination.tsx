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
  const half = Math.floor(maxButtons / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, page + half);

  if (end - start < maxButtons - 1) {
    if (page <= half) {
      end = Math.min(totalPages, start + maxButtons - 1);
    } else {
      start = Math.max(1, end - maxButtons + 1);
    }
  }

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const baseButton =
    "px-3 py-1 rounded-lg border font-medium transition-colors duration-200 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50";

  return (
    <div className="flex justify-center mt-10 px-2">
      <ul className="flex flex-wrap items-center gap-2 justify-center">
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
                : "bg-slate-100 text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            Prev
          </button>
        </li>

        {/* Left Ellipsis */}
        {start > 1 && <span className="px-2 text-gray-500">…</span>}

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
                        ? "bg-gray-200 text-gray-900"
                        : "bg-slate-100 text-gray-900"
                    } hover:bg-gray-100`
              }`}
            >
              {p}
            </button>
          </li>
        ))}

        {/* Right Ellipsis */}
        {end < totalPages && <span className="px-2 text-gray-500">…</span>}

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
                : "bg-slate-100 text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
}
