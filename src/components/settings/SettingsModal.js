import React from 'react';
import { useJournal } from '../../context/JournalContext';
import {
  X,
  Type,
  FileDown,
  RotateCcw,
  Sparkles,
  Check,
  Server,
  RefreshCw
} from 'lucide-react';

const SettingsModal = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    updateSettings,
    exportEntries,
    totalEntries,
    apiStatus,
    activeJournal,
    loadJournalsFromBackend,
  } = useJournal();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-dark/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-warmcard border border-parchment-border shadow-elevated overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-parchment-border/70 bg-ivory-50/50">
          <div>
            <h3 className="font-serif text-xl font-semibold text-charcoal">
              Daybook Preferences
            </h3>
            <p className="text-xs text-charcoal-muted">
              Customize your writing ambiance and manage data.
            </p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-parchment-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
          {/* Typography Preference */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted font-sans flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Editor Typography</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ fontFamily: 'serif' })}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  settings?.fontFamily === 'serif'
                    ? 'bg-sage-light text-sage-dark border-sage ring-1 ring-sage'
                    : 'bg-ivory-50 border-parchment-border/80 text-charcoal hover:bg-parchment/40'
                }`}
              >
                <div>
                  <div className="font-serif text-base font-semibold">Editorial Serif</div>
                  <div className="text-[11px] text-charcoal-muted">Newsreader & Georgia</div>
                </div>
                {settings?.fontFamily === 'serif' && <Check className="w-4 h-4 text-sage-dark" />}
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ fontFamily: 'sans' })}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  settings?.fontFamily === 'sans'
                    ? 'bg-sage-light text-sage-dark border-sage ring-1 ring-sage'
                    : 'bg-ivory-50 border-parchment-border/80 text-charcoal hover:bg-parchment/40'
                }`}
              >
                <div>
                  <div className="font-sans text-base font-semibold">Modern Sans</div>
                  <div className="text-[11px] text-charcoal-muted">Plus Jakarta Sans</div>
                </div>
                {settings?.fontFamily === 'sans' && <Check className="w-4 h-4 text-sage-dark" />}
              </button>
            </div>
          </div>

          {/* Font Size Preference */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted font-sans">
              Writing Font Scale
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Standard', desc: '18px' },
                { id: 'large', label: 'Spacious', desc: '20px' },
                { id: 'editorial', label: 'Editorial', desc: '24px' },
              ].map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => updateSettings({ fontSize: size.id })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    settings?.fontSize === size.id
                      ? 'bg-sage-light text-sage-dark border-sage ring-1 ring-sage'
                      : 'bg-ivory-50 border-parchment-border/80 text-charcoal hover:bg-parchment/40'
                  }`}
                >
                  <div className="text-xs font-semibold">{size.label}</div>
                  <div className="text-[10px] text-charcoal-muted">{size.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-ivory-50 border border-parchment-border/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sage-light text-sage-dark flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-sage-dark" />
              </div>
              <div>
                <div className="text-sm font-semibold text-charcoal">Daily Writing Prompts</div>
                <div className="text-xs text-charcoal-muted">Suggest gentle questions when opening a blank canvas</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateSettings({ showPrompts: !settings?.showPrompts })}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                settings?.showPrompts ? 'bg-sage justify-end' : 'bg-parchment justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-soft" />
            </button>
          </div>

          {/* Data Backup & Export */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-parchment-border/70">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted font-sans flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5" />
              <span>Export & Backup</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportEntries('markdown')}
                className="flex-1 py-2 px-3 rounded-xl border border-parchment-border text-xs font-medium text-charcoal hover:bg-parchment/60 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Export as Markdown (.md)</span>
              </button>
              <button
                type="button"
                onClick={() => exportEntries('json')}
                className="flex-1 py-2 px-3 rounded-xl border border-parchment-border text-xs font-medium text-charcoal hover:bg-parchment/60 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Export as JSON</span>
              </button>
            </div>
          </div>

          {/* Backend Connection Status */}
          <div className="pt-2 border-t border-parchment-border/70 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-sage" />
                <span className="text-xs font-semibold text-charcoal">Spring Boot API</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                {apiStatus === 'connected' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected (8081)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Offline
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-charcoal-muted">
              <span>
                Active Journal: <strong className="text-charcoal">{activeJournal?.title || 'None'}</strong>
              </span>
              <button
                type="button"
                onClick={loadJournalsFromBackend}
                className="inline-flex items-center gap-1 text-xs text-sage-dark hover:underline font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync with Server</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-parchment-border/70 bg-ivory-50/50 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-charcoal text-white hover:bg-charcoal-light transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
