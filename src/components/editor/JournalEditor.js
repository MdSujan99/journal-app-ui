import React, { useState, useEffect, useRef } from 'react';
import { useJournal } from '../../context/JournalContext';
import MoodSelector from './MoodSelector';
import PromptCard from './PromptCard';
import {
  Bold,
  Italic,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Minus,
  Tag,
  X,
  BookOpen,
  Check,
  Loader2,
  Save
} from 'lucide-react';

const JournalEditor = () => {
  const {
    activeEntry,
    saveEntry,
    saveStatus,
    settings,
    zenMode,
    activeJournal,
  } = useJournal();

  const [title, setTitle] = useState(activeEntry?.title || '');
  const [content, setContent] = useState(activeEntry?.content || '');
  const [mood, setMood] = useState(activeEntry?.mood || 'peaceful');
  const [prompt, setPrompt] = useState(activeEntry?.prompt || '');
  const [showPromptCard, setShowPromptCard] = useState(settings?.showPrompts ?? true);
  const [tags, setTags] = useState(activeEntry?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isTagInputOpen, setIsTagInputOpen] = useState(false);

  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Sync internal state whenever activeEntry changes from outside
  useEffect(() => {
    setTitle(activeEntry?.title || '');
    setContent(activeEntry?.content || '');
    setMood(activeEntry?.mood || 'peaceful');
    setPrompt(activeEntry?.prompt || '');
    setTags(activeEntry?.tags || []);
  }, [activeEntry?.id]);

  // Auto-save debounce effect (saves 1.5 seconds after typing stops)
  useEffect(() => {
    if (!title && !content && !activeEntry?.id) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveEntry({
        ...activeEntry,
        title,
        content,
        mood,
        prompt,
        tags,
      });
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, content, mood, prompt, tags]);

  // Text formatting helper
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 0);
  };

  const handleInsertPrompt = (promptText) => {
    const formatted = `> *${promptText}*\n\n`;
    setContent(prev => (prev ? `${formatted}${prev}` : formatted));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const getFontSizeClass = () => {
    if (settings?.fontSize === 'large') return 'text-xl md:text-2xl leading-relaxed md:leading-loose';
    if (settings?.fontSize === 'editorial') return 'text-2xl md:text-3xl leading-loose font-serif';
    return 'text-lg md:text-xl leading-relaxed md:leading-loose';
  };

  const getFontFamilyClass = () => {
    return settings?.fontFamily === 'sans' ? 'font-sans' : 'font-serif';
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col gap-5 transition-all ${
      zenMode ? 'py-6 px-4 md:px-0' : 'py-4 md:py-8 px-4 md:px-6'
    }`}>
      {/* Subtle Writing Prompt */}
      {!zenMode && showPromptCard && settings?.showPrompts && (
        <PromptCard
          prompt={prompt}
          onUpdatePrompt={setPrompt}
          onInsertPrompt={handleInsertPrompt}
          onDismiss={() => setShowPromptCard(false)}
        />
      )}

      {/* Understated Controls Row: Mood, Tags & Minimal Toolbar */}
      {!zenMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-charcoal-muted pt-1">
          {/* Left: Mood Selector */}
          <div className="flex items-center gap-2">
            <MoodSelector currentMood={mood} onSelectMood={setMood} />
          </div>

          {/* Right: Whisper-soft Formatting Toolbar */}
          <div className="flex items-center gap-0.5 text-charcoal-muted/60 hover:text-charcoal-muted transition-colors">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**')}
              className="p-1.5 rounded hover:bg-parchment/60 transition-colors"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*')}
              className="p-1.5 rounded hover:bg-parchment/60 transition-colors"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('## ')}
              className="p-1.5 rounded hover:bg-parchment/60 transition-colors"
              title="Heading"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('> ')}
              className="p-1.5 rounded hover:bg-parchment/60 transition-colors"
              title="Quote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('- ')}
              className="p-1.5 rounded hover:bg-parchment/60 transition-colors"
              title="List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('1. ')}
              className="p-1.5 rounded hover:bg-parchment/60 transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n---\n')}
              className="p-1.5 rounded hover:bg-parchment/60 transition-colors"
              title="Divider"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Editor Main Canvas — Clean, open, seamless without heavy card borders */}
      <div className="flex flex-col gap-4 mt-2">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Reflection..."
            className="w-full font-serif text-3xl md:text-4xl font-medium tracking-tight text-charcoal placeholder:text-charcoal-muted/30 bg-transparent border-none outline-none focus:ring-0 px-0"
          />
        </div>

        {/* Tags Row — Delicate & minimal */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-charcoal-muted">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-parchment/40 text-charcoal-muted/80 hover:text-charcoal"
            >
              <span>#{t}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(t)}
                className="hover:text-charcoal"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {isTagInputOpen ? (
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              onBlur={() => {
                if (!tagInput.trim()) setIsTagInputOpen(false);
              }}
              autoFocus
              placeholder="Tag + Enter"
              className="text-xs px-2 py-0.5 rounded-md border border-sage-border/60 bg-transparent outline-none w-24"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsTagInputOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] text-charcoal-muted/60 hover:text-charcoal px-1.5 py-0.5 rounded hover:bg-parchment/40 transition-colors"
            >
              <Tag className="w-3 h-3" />
              <span>tag</span>
            </button>
          )}
        </div>

        {/* Main Textarea — Pure distraction-free writing space */}
        <div className="pt-2">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Begin writing..."
            className={`w-full min-h-[460px] bg-transparent border-none outline-none resize-none placeholder:text-charcoal-muted/30 text-charcoal/90 px-0 ${getFontSizeClass()} ${getFontFamilyClass()}`}
          />
        </div>

        {/* Quiet Footer Stats & Actions */}
        <div className="pt-4 border-t border-parchment-border/40 flex items-center justify-between text-xs text-charcoal-muted/60 font-sans">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-sage" />
              <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            </span>
            <span>•</span>
            <span>~{readingTime} min read</span>
            {activeJournal && (
              <>
                <span>•</span>
                <span className="text-[11px] text-sage-dark/80">
                  Saving to: <span className="font-medium">{activeJournal.title}</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
                saveEntry({
                  ...activeEntry,
                  title,
                  content,
                  mood,
                  prompt,
                  tags,
                });
              }}
              disabled={saveStatus === 'saving' || (!title.trim() && !content.trim())}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal hover:bg-parchment/60 border border-parchment-border transition-colors disabled:opacity-40"
              title="Save to backend"
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sage" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-sage" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;
