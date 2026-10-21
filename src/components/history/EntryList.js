import React, { useMemo } from 'react';
import { useJournal } from '../../context/JournalContext';
import EntryCard from './EntryCard';
import { MOODS } from '../../data/mockEntries';
import { Search, BookOpen, Plus, X } from 'lucide-react';

const EntryList = ({ onlyFavorites = false }) => {
  const {
    entries,
    activeJournal,
    searchQuery,
    setSearchQuery,
    selectedMoodFilter,
    setSelectedMoodFilter,
    selectedTagFilter,
    setSelectedTagFilter,
    createNewEntry,
  } = useJournal();

  const allTags = useMemo(() => {
    const tagsSet = new Set();
    entries.forEach((e) => {
      if (Array.isArray(e.tags)) {
        e.tags.forEach((t) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (onlyFavorites && !entry.isFavorite) return false;

      if (selectedMoodFilter !== 'all' && entry.mood !== selectedMoodFilter) {
        return false;
      }

      if (selectedTagFilter !== 'all' && (!entry.tags || !entry.tags.includes(selectedTagFilter))) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = entry.title?.toLowerCase().includes(q);
        const matchesContent = entry.content?.toLowerCase().includes(q);
        const matchesTags = entry.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTags) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, onlyFavorites, selectedMoodFilter, selectedTagFilter, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMoodFilter('all');
    setSelectedTagFilter('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedMoodFilter !== 'all' || selectedTagFilter !== 'all';

  return (
    <div className="w-full max-w-3xl mx-auto py-6 md:py-8 px-4 md:px-6 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-baseline justify-between border-b border-parchment-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-charcoal tracking-tight">
              {onlyFavorites ? 'Starred Reflections' : 'All Reflections'}
            </h2>
            {activeJournal && (
              <span className="text-xs font-sans text-sage-dark bg-sage-light/60 px-2 py-0.5 rounded-md font-medium">
                {activeJournal.title}
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-muted/70 mt-0.5">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>

        <button
          onClick={createNewEntry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal hover:bg-parchment/50 border border-parchment-border transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-sage" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Search Bar & Minimal Filter Strip */}
      <div className="flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reflections..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-transparent border border-parchment-border/60 text-xs text-charcoal placeholder:text-charcoal-muted/40 outline-none focus:border-sage transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-muted/50 hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Minimal Mood Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedMoodFilter('all')}
              className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                selectedMoodFilter === 'all'
                  ? 'bg-sage-light text-sage-dark font-medium'
                  : 'text-charcoal-muted/60 hover:text-charcoal'
              }`}
            >
              All
            </button>
            {MOODS.map((mood) => {
              const isSelected = selectedMoodFilter === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMoodFilter(isSelected ? 'all' : mood.id)}
                  className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                    isSelected
                      ? 'bg-sage-light text-sage-dark font-medium scale-105'
                      : 'text-charcoal-muted/60 hover:text-charcoal'
                  }`}
                  title={mood.label}
                >
                  <span>{mood.icon}</span>
                </button>
              );
            })}
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-charcoal-muted/60">
              {allTags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? 'all' : tag)}
                  className={`hover:underline ${selectedTagFilter === tag ? 'text-sage-dark font-semibold' : ''}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-charcoal-muted/60 px-0.5">
            <span>Filtered ({filteredEntries.length})</span>
            <button
              onClick={clearFilters}
              className="text-sage-dark hover:underline font-medium"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Entry Cards List */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-parchment-border/60 p-10 text-center flex flex-col items-center justify-center gap-2">
          <BookOpen className="w-5 h-5 text-sage-dark/60" />
          <p className="text-sm text-charcoal-muted">No reflections found</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-sage-dark underline"
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EntryList;
