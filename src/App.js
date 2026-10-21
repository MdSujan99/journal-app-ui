import React from 'react';
import { JournalProvider, useJournal } from './context/JournalContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import JournalEditor from './components/editor/JournalEditor';
import EntryList from './components/history/EntryList';
import CalendarView from './components/calendar/CalendarView';
import JournalListView from './components/journal/JournalListView';
import CreateJournalModal from './components/journal/CreateJournalModal';
import SettingsModal from './components/settings/SettingsModal';
import DeleteConfirmModal from './components/common/DeleteConfirmModal';
import Toast from './components/common/Toast';
import { Minimize2 } from 'lucide-react';

const DaybookApp = () => {
  const { activeView, zenMode, setZenMode } = useJournal();

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col md:flex-row antialiased selection:bg-sage-light selection:text-sage-dark relative">
      {/* Desktop Sidebar (hidden when in Zen mode) */}
      {!zenMode && <Sidebar />}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 pb-16 md:pb-0 overflow-x-hidden">
        {/* TopBar (hidden when in Zen mode) */}
        {!zenMode ? (
          <TopBar />
        ) : (
          /* Subtle Zen Mode Exit Header */
          <div className="flex justify-end p-4">
            <button
              onClick={() => setZenMode(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-charcoal-muted hover:text-charcoal bg-ivory-200/80 hover:bg-parchment transition-all border border-parchment-border"
              title="Exit focus mode"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Focus</span>
            </button>
          </div>
        )}

        {/* View Content */}
        <main className="flex-1 overflow-y-auto">
          {activeView === 'today' && <JournalEditor />}
          {activeView === 'history' && <EntryList onlyFavorites={false} />}
          {activeView === 'favorites' && <EntryList onlyFavorites={true} />}
          {activeView === 'calendar' && <CalendarView />}
          {activeView === 'journals' && <JournalListView />}
        </main>
      </div>

      {/* Mobile Sticky Bottom Nav (hidden in Zen mode) */}
      {!zenMode && <BottomNav />}

      {/* Modals & Notifications */}
      <CreateJournalModal />
      <SettingsModal />
      <DeleteConfirmModal />
      <Toast />
    </div>
  );
};

function App() {
  return (
    <JournalProvider>
      <DaybookApp />
    </JournalProvider>
  );
}

export default App;
