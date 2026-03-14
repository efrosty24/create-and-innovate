"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
};

export default function Pagination({ currentPage, totalPages, onPageChange, label = "Page" }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
      <span className="text-sm text-zinc-500">
        {label} {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
