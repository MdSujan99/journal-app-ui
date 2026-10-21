import React from 'react';
import { useJournal } from '../../context/JournalContext';
import { Check } from 'lucide-react';

const Toast = () => {
  const { toastMessage } = useJournal();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal text-white text-xs font-medium shadow-elevated border border-charcoal-light/30 animate-bounce-subtle">
      <Check className="w-4 h-4 text-emerald-400" />
      <span>{toastMessage}</span>
    </div>
  );
};

export default Toast;
