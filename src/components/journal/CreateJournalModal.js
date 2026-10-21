import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { X, BookPlus, Loader2 } from 'lucide-react';

const CreateJournalModal = () => {
  const { isJournalModalOpen, setIsJournalModalOpen, createNewJournal } = useJournal();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isJournalModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the journal.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await createNewJournal({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create journal on backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError('');
      setTitle('');
      setDescription('');
      setIsJournalModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-dark/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-warmcard border border-parchment-border shadow-elevated overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-parchment-border/70 bg-ivory-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sage-light text-sage-dark flex items-center justify-center">
              <BookPlus className="w-4 h-4 text-sage-dark" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                New Journal
              </h3>
              <p className="text-xs text-charcoal-muted">
                Create a distinct space for reflections.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-parchment-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-charcoal font-sans">
              Journal Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Work Notes, Travel Diary, Gratitude..."
              autoFocus
              className="px-3.5 py-2.5 rounded-xl border border-parchment-border bg-ivory-50 text-xs text-charcoal placeholder:text-charcoal-muted/40 outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-charcoal font-sans">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What intentions or topics will live in this journal?"
              className="px-3.5 py-2.5 rounded-xl border border-parchment-border bg-ivory-50 text-xs text-charcoal placeholder:text-charcoal-muted/40 outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-parchment-border/60">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-charcoal hover:bg-parchment/60 border border-parchment-border transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-charcoal text-white hover:bg-charcoal-light transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-soft"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Journal</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJournalModal;
