'use client';

import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw, Filter } from 'lucide-react';
import Button from '../ui/Button';

export const CampaignFilters = ({
  search = '',
  onSearchChange,
  category = 'All',
  onCategoryChange,
  sortBy = 'newest',
  onSortChange,
  minGoal = '',
  onMinGoalChange,
  maxGoal = '',
  onMaxGoalChange,
  deadlineFilter = 'all',
  onDeadlineFilterChange,
  onResetFilters,
  activeFilterCount = 0,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const categories = [
    'All',
    'Technology',
    'Energy',
    'Community',
    'Education',
    'Creative',
    'Medical',
    'Environment',
  ];

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      {/* Top Search Bar & Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        {/* Search Input with Debounce & Clear Icon */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search campaigns by title or story..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-9 py-2.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-900 placeholder-slate-400"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select & Mobile Drawer Trigger */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="highest-funded">Sort by: Highest Funded</option>
              <option value="lowest-funded">Sort by: Lowest Funded</option>
              <option value="ending-soon">Sort by: Ending Soonest</option>

              <option value="highest-goal">Sort by: Highest Goal</option>
              <option value="lowest-goal">Sort by: Lowest Goal</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center space-x-1.5 text-xs font-bold transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Bar (Desktop & Tablet) */}
      <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                category.toLowerCase() === cat.toLowerCase()
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filter Inputs Bar (Goal Range & Deadline) - Desktop */}
      <div className="hidden md:flex items-center justify-between bg-white px-6 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900">Goal Range (Credits):</span>
            <input
              type="number"
              placeholder="Min"
              value={minGoal}
              onChange={(e) => onMinGoalChange(e.target.value)}
              className="w-20 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 bg-slate-50"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxGoal}
              onChange={(e) => onMaxGoalChange(e.target.value)}
              className="w-20 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>

          <div className="h-4 w-px bg-slate-200 mx-2" />

          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900">Deadline:</span>
            <select
              value={deadlineFilter}
              onChange={(e) => onDeadlineFilterChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:border-emerald-500 text-slate-700"
            >
              <option value="active">Active Deadlines Only</option>
              <option value="ending-soon">Ending in &lt; 7 Days</option>
              <option value="all">All Campaigns (incl. past)</option>
            </select>
          </div>
        </div>

        {activeFilterCount > 0 && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1 text-xs text-rose-600 font-bold hover:text-rose-700 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Mobile Drawer Slide-Over with Backdrop */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
              <div className="space-y-6 overflow-y-auto pr-1">
                {/* Drawer Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-base">Filter Campaigns</h3>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                          category.toLowerCase() === cat.toLowerCase()
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal Range Inputs */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900">Goal Range (Credits)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minGoal}
                      onChange={(e) => onMinGoalChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxGoal}
                      onChange={(e) => onMaxGoalChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Deadline Filter */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900">Deadline Status</label>
                  <select
                    value={deadlineFilter}
                    onChange={(e) => onDeadlineFilterChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  >
                    <option value="active">Active Deadlines Only</option>
                    <option value="ending-soon">Ending in &lt; 7 Days</option>
                    <option value="all">All Campaigns (incl. past)</option>
                  </select>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                {onResetFilters && (
                  <button
                    onClick={() => {
                      onResetFilters();
                      setMobileDrawerOpen(false);
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline px-2"
                  >
                    Reset All
                  </button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignFilters;
