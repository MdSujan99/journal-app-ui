import React from 'react';
import { RefreshCw, Plus, X, Sparkles } from 'lucide-react';
import { getRandomPrompt } from '../../data/writingPrompts';

const PromptCard = ({ prompt, onUpdatePrompt, onInsertPrompt, onDismiss }) => {
  if (!prompt) return null;

  const handleShuffle = () => {
    const newPrompt = getRandomPrompt(prompt);
    onUpdatePrompt(newPrompt);
  };

  return (
    <div className="flex items-center justify-between gap-3 py-1.5 px-3 rounded-xl bg-sage-light/30 border border-sage-border/30 text-xs transition-all">
      <div className="flex items-center gap-2 overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 text-sage-dark shrink-0" />
        <span className="font-serif italic text-charcoal-muted truncate text-sm">
          "{prompt}"
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0 text-charcoal-muted">
        <button
          type="button"
          onClick={handleShuffle}
          className="p-1 rounded-md hover:text-charcoal hover:bg-parchment/60 transition-colors"
          title="New prompt"
        >
          <RefreshCw className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={() => onInsertPrompt(prompt)}
          className="p-1 rounded-md hover:text-charcoal hover:bg-parchment/60 transition-colors text-[11px] font-sans flex items-center gap-0.5"
          title="Insert into entry"
        >
          <Plus className="w-3 h-3" />
          <span className="hidden sm:inline">Insert</span>
        </button>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-md hover:text-charcoal hover:bg-parchment/60 transition-colors"
            title="Dismiss prompt"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptCard;
