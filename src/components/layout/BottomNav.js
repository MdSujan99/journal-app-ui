import React from 'react';
import { useJournal } from '../../context/JournalContext';
import {
  PenLine,
  BookOpen,
  Calendar as CalendarIcon,
  Bookmark,
  Book,
  Settings,
} from 'lucide-react';

const BottomNav = () => {
  const { activeView, setActiveView, setIsSettingsOpen } = useJournal();

  const navItems = [
    { id: 'today', label: 'Today', icon: PenLine },
    { id: 'history', label: 'Entries', icon: BookOpen },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'favorites', label: 'Starred', icon: Bookmark },
    { id: 'journals', label: 'Journals', icon: Book },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory-100/95 backdrop-blur-md border-t border-parchment-border px-2 py-1.5 shadow-medium">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-sage-dark font-semibold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-sage-light' : 'bg-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-charcoal-muted hover:text-charcoal transition-all"
        >
          <div className="p-1 rounded-lg bg-transparent">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
