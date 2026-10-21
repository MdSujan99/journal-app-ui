import React from 'react';
import { MOODS } from '../../data/mockEntries';

const MoodSelector = ({ currentMood, onSelectMood }) => {
  return (
    <div className="flex items-center gap-1">
      {MOODS.map((mood) => {
        const isSelected = currentMood === mood.id;
        return (
          <button
            key={mood.id}
            type="button"
            onClick={() => onSelectMood(mood.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
              isSelected
                ? 'bg-sage-light text-sage-dark font-medium ring-1 ring-sage/40 scale-105'
                : 'text-charcoal-muted/60 hover:text-charcoal hover:bg-parchment/40'
            }`}
            title={mood.label}
          >
            <span className="text-sm">{mood.icon}</span>
            {isSelected && <span className="text-[11px] font-sans">{mood.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
