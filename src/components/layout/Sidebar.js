import React, { useState, useRef, useEffect } from 'react';
import { useJournal } from '../../context/JournalContext';
import {
  PenLine,
  BookOpen,
  Calendar as CalendarIcon,
  Bookmark,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Feather,
  Book,
  ChevronDown,
  Check,
  BookPlus,
  Wifi,
  WifiOff
} from 'lucide-react';

const Sidebar = () => {
  const {
    activeView,
    setActiveView,
    createNewEntry,
    totalEntries,
    favoriteEntriesCount,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    setIsSettingsOpen,
    journals,
    activeJournal,
    selectJournal,
    setIsJournalModalOpen,
    apiStatus,
  } = useJournal();

  const [isJournalDropdownOpen, setIsJournalDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsJournalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'today', label: 'Today', icon: PenLine },
    { id: 'history', label: 'All Entries', icon: BookOpen, badge: totalEntries },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'favorites', label: 'Favorites', icon: Bookmark, badge: favoriteEntriesCount > 0 ? favoriteEntriesCount : null },
    { id: 'journals', label: 'Journals', icon: Book, badge: journals.length > 0 ? journals.length : null },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between border-r border-parchment-border/40 bg-ivory transition-all duration-300 ease-in-out select-none ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Header & Navigation */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-parchment-border/30">
          <div
            onClick={() => setActiveView('today')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-sage-light/80 text-sage-dark flex items-center justify-center">
              <Feather className="w-3.5 h-3.5 text-sage-dark" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-serif text-lg font-semibold tracking-tight text-charcoal">
                Daybook
              </span>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded-md text-charcoal-muted/50 hover:text-charcoal hover:bg-parchment/50 transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Active Journal Selector Dropdown */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-3 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsJournalDropdownOpen(!isJournalDropdownOpen)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-parchment-border/70 hover:border-sage bg-warmcard/80 text-left transition-all text-xs"
              title="Switch journal"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Book className="w-3.5 h-3.5 text-sage flex-shrink-0" />
                <span className="font-serif font-medium text-charcoal truncate">
                  {activeJournal?.title || 'No Journal'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-charcoal-muted/60 flex-shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {isJournalDropdownOpen && (
              <div className="absolute left-3 right-3 top-12 z-40 rounded-xl bg-warmcard border border-parchment-border shadow-elevated py-1.5 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] uppercase font-semibold text-charcoal-muted tracking-wider">
                  Select Journal
                </div>
                <div className="max-h-48 overflow-y-auto flex flex-col py-0.5">
                  {journals.map((j) => {
                    const isSelected = j.id === activeJournal?.id;
                    const count = j.journalEntryMap ? Object.keys(j.journalEntryMap).length : 0;
                    return (
                      <button
                        key={j.id}
                        onClick={() => {
                          selectJournal(j.id);
                          setIsJournalDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                          isSelected
                            ? 'bg-sage-light/60 text-sage-dark font-medium'
                            : 'text-charcoal hover:bg-parchment/40'
                        }`}
                      >
                        <span className="truncate pr-2">{j.title}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0 text-[10px] text-charcoal-muted/60">
                          <span>{count}</span>
                          {isSelected && <Check className="w-3 h-3 text-sage-dark" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-parchment-border/60 mt-1 pt-1 px-1">
                  <button
                    onClick={() => {
                      setIsJournalDropdownOpen(false);
                      setIsJournalModalOpen(true);
                    }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sage-dark hover:bg-sage-light/40 transition-colors"
                  >
                    <BookPlus className="w-3.5 h-3.5" />
                    <span>Create New Journal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="p-3">
          <button
            onClick={createNewEntry}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-charcoal border border-parchment-border hover:border-sage hover:bg-sage-light/30 active:scale-[0.99] transition-all group ${
              isSidebarCollapsed ? 'px-1' : ''
            }`}
            title="Create new reflection"
          >
            <Plus className="w-3.5 h-3.5 text-sage-dark" />
            {!isSidebarCollapsed && <span>New Entry</span>}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-2 py-1 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all group ${
                  isActive
                    ? 'bg-sage-light/70 text-sage-dark font-medium'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-parchment/40'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-sage-dark' : 'text-charcoal-muted/70 group-hover:text-charcoal'
                    }`}
                  />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </div>

                {!isSidebarCollapsed && item.badge !== undefined && item.badge !== null && (
                  <span className="text-[10px] text-charcoal-muted/60 font-sans">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Stats, Connection Indicator & Settings */}
      <div className="p-3 border-t border-parchment-border/30 flex flex-col gap-2">
        {!isSidebarCollapsed && (
          <div className="px-2 flex items-center justify-between text-[11px] text-charcoal-muted/60">
            <span>
              {totalEntries} {totalEntries === 1 ? 'reflection' : 'reflections'}
            </span>

            {/* Live API indicator */}
            <div
              className="flex items-center gap-1 cursor-default"
              title={
                apiStatus === 'connected'
                  ? 'Connected to Spring Boot API (http://localhost:8081)'
                  : 'Backend API offline'
              }
            >
              {apiStatus === 'connected' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-700 font-medium">8081 live</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span className="text-[10px] text-rose-600">offline</span>
                </>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-charcoal-muted/70 hover:text-charcoal hover:bg-parchment/40 transition-colors ${
            isSidebarCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
