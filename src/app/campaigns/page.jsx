'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import CampaignGrid from '../../components/campaign/CampaignGrid';
import CampaignFilters from '../../components/campaign/CampaignFilters';
import Pagination from '../../components/common/Pagination';
import { useCampaigns } from '../../hooks/useCampaigns';
import { useDebounce } from '../../hooks/useDebounce';
import { X, Sparkles, Filter } from 'lucide-react';

const mapSortToBackend = (sortKey = 'newest') => {
  switch (sortKey) {
    case 'highest-funded':
    case 'raised-desc':
      return '-amountRaised';
    case 'lowest-funded':
    case 'raised-asc':
      return 'amountRaised';
    case 'newest':
      return '-createdAt';
    case 'oldest':
      return 'createdAt';
    case 'ending-soon':
    case 'deadline-asc':
      return 'deadline';
    case 'highest-goal':
    case 'goal-desc':
      return '-fundingGoal';
    case 'lowest-goal':
    case 'goal-asc':
      return 'fundingGoal';
    default:
      return sortKey;
  }
};

function ExploreCampaignsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialMinGoal = searchParams.get('minGoal') || '';
  const initialMaxGoal = searchParams.get('maxGoal') || '';
  const initialDeadlineFilter = searchParams.get('deadline') || 'active';

  const [category, setCategory] = useState(initialCategory);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [minGoal, setMinGoal] = useState(initialMinGoal);
  const [maxGoal, setMaxGoal] = useState(initialMaxGoal);
  const [deadlineFilter, setDeadlineFilter] = useState(initialDeadlineFilter);

  const debouncedSearch = useDebounce(searchInput, 350);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
    if (page > 1) params.set('page', page.toString());
    if (minGoal) params.set('minGoal', minGoal);
    if (maxGoal) params.set('maxGoal', maxGoal);
    if (deadlineFilter && deadlineFilter !== 'active') params.set('deadline', deadlineFilter);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  }, [category, debouncedSearch, sortBy, page, minGoal, maxGoal, deadlineFilter, pathname, router]);

  const backendQueryParams = {
    category: category !== 'All' ? category : undefined,
    search: debouncedSearch || undefined,
    minGoal: minGoal ? Number(minGoal) : undefined,
    maxGoal: maxGoal ? Number(maxGoal) : undefined,
    activeOnly: deadlineFilter === 'active' || deadlineFilter === 'ending-soon' ? true : undefined,
    sort: mapSortToBackend(sortBy),
    page,
    limit: 6,
  };

  const { data: response, isLoading, isError, refetch, isFetching } = useCampaigns(backendQueryParams);

  const rawCampaigns =
    response?.data?.campaigns ||
    response?.campaigns ||
    (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);

  const meta = response?.meta || response?.data?.meta || {};
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.total ?? rawCampaigns.length;

  let activeFilterCount = 0;
  if (category !== 'All') activeFilterCount++;
  if (debouncedSearch) activeFilterCount++;
  if (sortBy !== 'newest') activeFilterCount++;
  if (minGoal) activeFilterCount++;
  if (maxGoal) activeFilterCount++;
  if (deadlineFilter !== 'active') activeFilterCount++;

  const handleResetFilters = () => {
    setCategory('All');
    setSearchInput('');
    setSortBy('newest');
    setPage(1);
    setMinGoal('');
    setMaxGoal('');
    setDeadlineFilter('active');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Server-Side Filtered Explore Feed</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Live Campaigns</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Discover verified causes. Use filters to search by category, goal, or ending deadlines.
            </p>
          </div>

          {totalItems > 0 && (
            <span className="text-xs font-extrabold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs self-start sm:self-auto">
              Showing <span className="text-emerald-600 font-black">{totalItems}</span> campaign{totalItems === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {/* Filters Controls Component */}
        <CampaignFilters
          search={searchInput}
          onSearchChange={(val) => { setSearchInput(val); setPage(1); }}
          category={category}
          onCategoryChange={(val) => { setCategory(val); setPage(1); }}
          sortBy={sortBy}
          onSortChange={(val) => { setSortBy(val); setPage(1); }}
          minGoal={minGoal}
          onMinGoalChange={(val) => { setMinGoal(val); setPage(1); }}
          maxGoal={maxGoal}
          onMaxGoalChange={(val) => { setMaxGoal(val); setPage(1); }}
          deadlineFilter={deadlineFilter}
          onDeadlineFilterChange={(val) => { setDeadlineFilter(val); setPage(1); }}
          onResetFilters={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Active Filter Badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400">Active filters:</span>
            {category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                Category: {category}
                <button onClick={() => setCategory('All')} className="hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                Search: "{debouncedSearch}"
                <button onClick={() => setSearchInput('')} className="hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {minGoal && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                Min Goal: {minGoal} Cr
                <button onClick={() => setMinGoal('')} className="hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {maxGoal && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                Max Goal: {maxGoal} Cr
                <button onClick={() => setMaxGoal('')} className="hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {deadlineFilter !== 'active' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                Deadline: {deadlineFilter}
                <button onClick={() => setDeadlineFilter('active')} className="hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 hover:underline ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Campaign Grid & Loading Overlay */}
        <div className="relative">
          {isFetching && !isLoading && (
            <div className="absolute top-2 right-2 px-3.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-md z-10 animate-pulse">
              Updating Results...
            </div>
          )}

          {rawCampaigns.length === 0 && !isLoading && !isError ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-8">
              <div className="p-4 bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">No campaigns match your filters</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try clearing some filters or searching with different keywords.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <CampaignGrid
              campaigns={rawCampaigns}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
            />
          )}
        </div>

        {/* Reusable Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={6}
          onPageChange={(p) => setPage(p)}
          className="border-t border-slate-200 pt-6"
        />
      </main>

      <Footer />
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">Loading explore feed...</div>}>
      <ExploreCampaignsContent />
    </Suspense>
  );
}
