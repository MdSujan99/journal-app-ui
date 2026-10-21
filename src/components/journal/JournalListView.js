import React from 'react';
import { useJournal } from '../../context/JournalContext';
import { Book, Plus, Trash2, Calendar, FileText, ArrowRight, Check } from 'lucide-react';

const JournalListView = () => {
  const {
    journals,
    activeJournalId,
    selectJournal,
    promptDeleteJournal,
    setIsJournalModalOpen,
    setActiveView,
  } = useJournal();

  return (
    <div className="w-full max-w-3xl mx-auto py-6 md:py-8 px-4 md:px-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-parchment-border/40 pb-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-charcoal tracking-tight">
            Your Journals
          </h2>
          <p className="text-xs text-charcoal-muted/70 mt-0.5">
            Manage your distinct notebooks stored on the backend.
          </p>
        </div>

        <button
          onClick={() => setIsJournalModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal hover:bg-parchment/50 border border-parchment-border transition-colors shadow-soft"
        >
          <Plus className="w-3.5 h-3.5 text-sage" />
          <span>New Journal</span>
        </button>
      </div>

      {/* Journals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {journals.map((journal) => {
          const isActive = journal.id === activeJournalId;
          const entryCount = journal.journalEntryMap
            ? Object.keys(journal.journalEntryMap).length
            : 0;

          const createdFormatted = journal.createdAt
            ? new Date(journal.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Unknown';

          return (
            <div
              key={journal.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                isActive
                  ? 'border-sage ring-1 ring-sage/60 bg-sage-light/20 shadow-soft'
                  : 'border-parchment-border/60 hover:border-sage-border/80 bg-warmcard hover:bg-parchment/30'
              }`}
            >
              <div className="flex flex-col gap-2.5">
                {/* Header row: badge & delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive
                          ? 'bg-sage text-white'
                          : 'bg-sage-light text-sage-dark'
                      }`}
                    >
                      <Book className="w-4 h-4" />
                    </div>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sage-light text-sage-dark border border-sage-border">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => promptDeleteJournal(journal.id, journal.title)}
                    className="p-1.5 rounded-lg text-charcoal-muted/40 hover:text-rose-600 transition-colors"
                    title="Delete journal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-serif text-lg font-semibold text-charcoal tracking-tight">
                    {journal.title}
                  </h3>
                  {journal.description ? (
                    <p className="text-xs text-charcoal-muted line-clamp-2 mt-1">
                      {journal.description}
                    </p>
                  ) : (
                    <p className="text-xs text-charcoal-muted/50 italic mt-1">
                      No description provided.
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom stats & action */}
              <div className="mt-5 pt-3 border-t border-parchment-border/40 flex items-center justify-between text-xs text-charcoal-muted">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-sage" />
                    <span>
                      {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-charcoal-muted/60" />
                    <span>{createdFormatted}</span>
                  </span>
                </div>

                {isActive ? (
                  <button
                    onClick={() => setActiveView('today')}
                    className="inline-flex items-center gap-1 text-xs text-sage-dark font-medium hover:underline"
                  >
                    <span>Write</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      selectJournal(journal.id);
                      setActiveView('history');
                    }}
                    className="px-2.5 py-1 rounded-lg border border-parchment-border text-[11px] font-medium text-charcoal hover:bg-parchment/60 transition-colors"
                  >
                    Open
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {journals.length === 0 && (
        <div className="rounded-2xl border border-dashed border-parchment-border p-12 text-center flex flex-col items-center justify-center gap-3">
          <Book className="w-8 h-8 text-sage" />
          <h3 className="font-serif text-base font-medium text-charcoal">
            No journals found on the backend
          </h3>
          <p className="text-xs text-charcoal-muted max-w-sm">
            Create your first journal to begin storing your reflections in MongoDB.
          </p>
          <button
            onClick={() => setIsJournalModalOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-charcoal text-white hover:bg-charcoal-light transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Journal</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default JournalListView;
