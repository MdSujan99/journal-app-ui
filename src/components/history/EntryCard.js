import React from 'react';
import { useJournal } from '../../context/JournalContext';
import { MOODS } from '../../data/mockEntries';
import {
  Bookmark,
  Calendar,
  Trash2,
  ArrowRight,
  BookOpen
} from 'lucide-react';

const EntryCard = ({ entry }) => {
  const { selectEntryForEdit, toggleFavorite, promptDeleteEntry } = useJournal();

  const moodConfig = MOODS.find((m) => m.id === entry.mood) || MOODS[0];

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const wordCount = entry.content.trim() ? entry.content.trim().split(/\s+/).length : 0;

  const previewText = entry.content
    .replace(/^>.*$/gm, '')
    .replace(/[#*`_~-]/g, '')
    .trim()
    .slice(0, 160);

  return (
    <article className="group rounded-xl border border-parchment-border/40 hover:border-sage-border/60 hover:bg-parchment/20 p-5 transition-all flex flex-col justify-between gap-3">
      <div className="flex flex-col gap-2">
        {/* Top Metadata Row: Date, Mood, Actions */}
        <div className="flex items-center justify-between text-xs text-charcoal-muted/70">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-sans">
              <Calendar className="w-3 h-3 text-sage" />
              <span>{formattedDate}</span>
            </span>

            <span>•</span>

            <span className="inline-flex items-center gap-1">
              <span>{moodConfig.icon}</span>
              <span>{moodConfig.label}</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleFavorite(entry.id)}
              className={`p-1 rounded transition-colors ${
                entry.isFavorite
                  ? 'text-amber-600'
                  : 'text-charcoal-muted/40 hover:text-charcoal'
              }`}
              title={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${entry.isFavorite ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => promptDeleteEntry(entry.id, entry.title)}
              className="p-1 rounded text-charcoal-muted/40 hover:text-rose-600 transition-colors"
              title="Delete reflection"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => selectEntryForEdit(entry.id)}
          className="font-serif text-xl md:text-2xl font-medium text-charcoal group-hover:text-sage-dark cursor-pointer transition-colors leading-snug"
        >
          {entry.title}
        </h3>

        {/* Excerpt */}
        <p
          onClick={() => selectEntryForEdit(entry.id)}
          className="text-sm text-charcoal-muted line-clamp-2 leading-relaxed cursor-pointer font-serif italic"
        >
          "{previewText}..."
        </p>
      </div>

      {/* Bottom Row */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal-muted/60 font-sans">
        <div className="flex flex-wrap items-center gap-1">
          {entry.tags && entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-charcoal-muted/70 mr-1"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]">
            <BookOpen className="w-3 h-3 text-sage" />
            <span>{wordCount} words</span>
          </span>

          <button
            type="button"
            onClick={() => selectEntryForEdit(entry.id)}
            className="flex items-center gap-1 text-xs text-sage-dark hover:underline font-medium"
          >
            <span>Open</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default EntryCard;
