import React from 'react';
import { useJournal } from '../../context/JournalContext';
import { Trash2 } from 'lucide-react';

const DeleteConfirmModal = () => {
  const { deleteModal, confirmDelete, cancelDelete } = useJournal();

  if (!deleteModal.isOpen) return null;

  const isJournal = deleteModal.type === 'journal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-dark/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-warmcard border border-parchment-border shadow-elevated p-6 flex flex-col gap-4">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
          <Trash2 className="w-5 h-5" />
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            {isJournal ? 'Delete Journal?' : 'Delete Reflection?'}
          </h3>
          <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
            {isJournal ? (
              <>
                Are you sure you want to delete the journal{' '}
                <span className="font-semibold text-charcoal">
                  "{deleteModal.title || 'Untitled'}"
                </span>
                ? All reflections inside it will be permanently removed from the backend database.
              </>
            ) : (
              <>
                Are you sure you want to remove{' '}
                <span className="font-semibold text-charcoal">
                  "{deleteModal.title || 'Untitled'}"
                </span>
                ? This action cannot be undone.
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={cancelDelete}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-charcoal hover:bg-parchment/60 border border-parchment-border transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-soft"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
