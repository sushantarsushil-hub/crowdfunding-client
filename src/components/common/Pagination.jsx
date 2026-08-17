'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

/**
 * Reusable, Responsive Pagination Component with WCAG 2.1 AA Accessibility
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  showFirstLast = true,
  showItemRange = true,
  className = '',
}) => {
  if (totalPages <= 1 && totalItems <= limit) {
    return null;
  }

  const page = Math.max(1, Math.min(currentPage, totalPages));

  // Calculate item range text e.g. "Showing 1 to 10 of 45 entries"
  const startItem = totalItems > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(page * limit, totalItems) : 0;

  // Generate smart page window range with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const handlePageClick = (p) => {
    if (typeof p === 'number' && p >= 1 && p <= totalPages && p !== page) {
      onPageChange(p);
    }
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}
    >
      {/* Item summary range */}
      {showItemRange && (
        <div className="text-xs font-semibold text-slate-500">
          {totalItems > 0 ? (
            <span>
              Showing <strong className="text-slate-900 font-bold">{startItem}</strong> to{' '}
              <strong className="text-slate-900 font-bold">{endItem}</strong> of{' '}
              <strong className="text-emerald-700 font-extrabold">{totalItems}</strong> entries
            </span>
          ) : (
            <span>
              Page <strong className="text-slate-900 font-bold">{page}</strong> of{' '}
              <strong className="text-slate-900 font-bold">{totalPages}</strong>
            </span>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* First Page Button (<<) */}
        {showFirstLast && (
          <button
            onClick={() => handlePageClick(1)}
            disabled={page <= 1}
            aria-label="Go to first page"
            title="First Page"
            className="p-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <ChevronsLeft className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {/* Previous Page Button (<) */}
        <button
          onClick={() => handlePageClick(page - 1)}
          disabled={page <= 1}
          aria-label="Go to previous page"
          title="Previous Page"
          className="p-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center space-x-1 min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numbered Page Buttons (Desktop / Tablet) */}
        <div className="hidden sm:flex items-center space-x-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-slate-400 font-bold select-none"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const isCurrent = p === page;
            return (
              <button
                key={`page-${p}`}
                onClick={() => handlePageClick(p)}
                aria-label={`Page ${p}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Mobile current indicator */}
        <span className="sm:hidden text-xs font-bold text-slate-700 px-2" aria-live="polite">
          {page} / {totalPages}
        </span>

        {/* Next Page Button (>) */}
        <button
          onClick={() => handlePageClick(page + 1)}
          disabled={page >= totalPages}
          aria-label="Go to next page"
          title="Next Page"
          className="p-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center space-x-1 min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Last Page Button (>>) */}
        {showFirstLast && (
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={page >= totalPages}
            aria-label="Go to last page"
            title="Last Page"
            className="p-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <ChevronsRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
