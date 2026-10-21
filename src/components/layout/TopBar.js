import React from 'react';
import { useJournal } from '../../context/JournalContext';
import {
  Check,
  Loader2,
  Maximize2,
  Minimize2,
  Bookmark,
  Feather,
  Plus,
  Book,
  AlertCircle
} from 'lucide-react';

const TopBar = () => {
  const {
    activeEntry,
    activeView,
    saveStatus,
    zenMode,
    setZenMode,
    toggleFavorite,
    createNewEntry,
    setActiveView,
    activeJournal,
  } = useJournal();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Late night contemplation';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isFavorite = activeEntry?.isFavorite;

  return (
    <header className="h-14 md:h-16 px-4 md:px-8 border-b border-parchment-border/40 bg-ivory/80 backdrop-blur-sm flex items-center justify-between transition-all">
      {/* Mobile Brand / Desktop Date & Greeting */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo */}
        <div
          onClick={() => setActiveView('today')}
          className="md:hidden flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-sage-light text-sage-dark flex items-center justify-center">
            <Feather className="w-3.5 h-3.5 text-sage-dark" />
          </div>
          <span className="font-serif font-medium text-base text-charcoal">
            Daybook
          </span>
        </div>

        {/* Desktop Date & Greeting */}
        <div className="hidden md:flex items-baseline gap-2.5 text-left">
          <span className="font-serif text-lg font-medium text-charcoal tracking-tight">
            {getGreeting()}
          </span>
          <span className="text-xs text-charcoal-muted/60 font-sans">
            — {formattedDate}
          </span>

          {activeJournal && (
            <button
              onClick={() => setActiveView('journals')}
              className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-sans font-medium text-sage-dark bg-sage-light/60 hover:bg-sage-light border border-sage-border/50 transition-colors"
              title="Click to view all journals"
            >
              <Book className="w-3 h-3 text-sage-dark" />
              <span>{activeJournal.title}</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Save Status, Zen Mode, Favorite, Mobile New Entry */}
      <div className="flex items-center gap-2">
        {/* Save Status Badge */}
        {activeView === 'today' && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-sans text-charcoal-muted/70">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-sage" />
                <span className="hidden sm:inline text-[11px]">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="w-3 h-3 text-sage" />
                <span className="hidden sm:inline text-[11px]">Saved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-3 h-3 text-rose-500" />
                <span className="hidden sm:inline text-[11px] text-rose-600">Error saving</span>
              </>
            )}
          </div>
        )}

        {/* Favorite toggle for active entry */}
        {activeView === 'today' && activeEntry?.id && (
          <button
            onClick={() => toggleFavorite(activeEntry.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isFavorite
                ? 'text-amber-600'
                : 'text-charcoal-muted/50 hover:text-charcoal'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
          </button>
        )}

        {/* Zen Mode Toggle */}
        <button
          onClick={() => setZenMode(!zenMode)}
          className={`p-1.5 rounded-lg text-charcoal-muted/60 hover:text-charcoal hover:bg-parchment/50 transition-colors hidden sm:flex items-center gap-1 text-xs ${
            zenMode ? 'text-sage-dark font-medium' : ''
          }`}
          title={zenMode ? 'Exit focus mode' : 'Distraction-free focus mode'}
        >
          {zenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{zenMode ? 'Exit Focus' : 'Focus'}</span>
        </button>

        {/* Mobile New Entry Button */}
        <button
          onClick={createNewEntry}
          className="md:hidden p-1.5 rounded-lg text-sage-dark hover:bg-sage-light transition-colors"
          title="New reflection"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
