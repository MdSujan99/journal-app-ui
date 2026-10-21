import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getRandomPrompt } from '../data/writingPrompts';
import journalApi from '../api/journalApi';
import { convertJournalToEntries, serializeEntryContent } from '../utils/entrySerializer';

const SETTINGS_KEY = 'daybook_settings_v1';
const ACTIVE_JOURNAL_ID_KEY = 'daybook_active_journal_id';

const DEFAULT_SETTINGS = {
  fontSize: 'normal', // normal, large, editorial
  showPrompts: true,
  fontFamily: 'serif', // serif, sans
};

const JournalContext = createContext(null);

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export const JournalProvider = ({ children }) => {
  // Backend journals list
  const [journals, setJournals] = useState([]);
  const [activeJournalId, setActiveJournalId] = useState(() => {
    return localStorage.getItem(ACTIVE_JOURNAL_ID_KEY) || null;
  });

  // API connectivity status: 'checking' | 'connected' | 'offline'
  const [apiStatus, setApiStatus] = useState('checking');
  const [isLoading, setIsLoading] = useState(true);

  // Load user settings from localStorage
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Active view: 'today' | 'history' | 'calendar' | 'favorites' | 'journals'
  const [activeView, setActiveView] = useState('today');

  // Active entry draft or opened entry
  const [activeEntry, setActiveEntry] = useState(() => ({
    id: null,
    title: '',
    content: '',
    date: new Date().toISOString(),
    mood: 'peaceful',
    tags: [],
    isFavorite: false,
    prompt: getRandomPrompt(),
  }));

  // Editor states
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved', 'error'
  const [zenMode, setZenMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // History filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState('all');

  // Modals
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: 'entry', // 'entry' | 'journal'
    targetId: null,
    title: '',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Toast notification helper
  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Sync active journal ID to localStorage
  useEffect(() => {
    if (activeJournalId) {
      localStorage.setItem(ACTIVE_JOURNAL_ID_KEY, activeJournalId);
    }
  }, [activeJournalId]);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // Find active journal object from list
  const activeJournal = useMemo(() => {
    if (!journals || journals.length === 0) return null;
    return journals.find((j) => j.id === activeJournalId) || journals[0];
  }, [journals, activeJournalId]);

  // Derive parsed entries from the active journal
  const entries = useMemo(() => {
    if (!activeJournal) return [];
    return convertJournalToEntries(activeJournal);
  }, [activeJournal]);

  // Load journals and verify backend connection
  const loadJournalsFromBackend = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Health check
      const health = await journalApi.checkHealth();
      if (!health.success) {
        setApiStatus('offline');
        showToast('Backend offline - using local mode');
        setIsLoading(false);
        return;
      }
      setApiStatus('connected');

      // 2. Fetch all journals
      let serverJournals = await journalApi.getAllJournals();

      // If database has no journals, create a default "Personal Journal"
      if (!serverJournals || serverJournals.length === 0) {
        try {
          const defaultJournal = await journalApi.createJournal({
            title: 'Personal Journal',
            description: 'My daily reflections and thoughts',
          });
          serverJournals = [defaultJournal];
        } catch (createErr) {
          console.warn('Could not auto-create default journal:', createErr);
        }
      }

      setJournals(serverJournals);

      // Select active journal
      if (serverJournals.length > 0) {
        const savedId = localStorage.getItem(ACTIVE_JOURNAL_ID_KEY);
        const match = serverJournals.find((j) => j.id === savedId);
        setActiveJournalId(match ? match.id : serverJournals[0].id);
      }
    } catch (error) {
      console.error('Failed to load journals from backend:', error);
      setApiStatus('offline');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Initial load on component mount
  useEffect(() => {
    loadJournalsFromBackend();
  }, [loadJournalsFromBackend]);

  // Save or update an entry to the backend API
  const saveEntry = async (entryData) => {
    setSaveStatus('saving');

    // Auto-generate title if empty
    let finalTitle = entryData.title ? entryData.title.trim() : '';
    if (!finalTitle) {
      if (entryData.content) {
        const firstLine = entryData.content.split('\n')[0].replace(/[#*_-]/g, '').trim();
        finalTitle = firstLine ? (firstLine.slice(0, 45) + (firstLine.length > 45 ? '...' : '')) : 'Untitled Reflection';
      } else {
        finalTitle = 'Untitled Reflection';
      }
    }

    // Ensure we have an active journal to save to
    let currentJournalId = activeJournal?.id;
    if (!currentJournalId) {
      try {
        const newJournal = await journalApi.createJournal({
          title: 'Personal Journal',
          description: 'Created automatically for reflections',
        });
        currentJournalId = newJournal.id;
        setJournals((prev) => [newJournal, ...prev]);
        setActiveJournalId(newJournal.id);
      } catch (err) {
        console.error('Error creating fallback journal:', err);
        setSaveStatus('error');
        showToast('Error: No active journal to save to');
        return null;
      }
    }

    try {
      // Serialize rich content with frontmatter
      const serializedContent = serializeEntryContent({
        content: entryData.content,
        mood: entryData.mood,
        tags: entryData.tags,
        isFavorite: entryData.isFavorite,
        prompt: entryData.prompt,
      });

      // Call backend API: POST /api/journal/{journalId}/entry
      const updatedJournal = await journalApi.createJournalEntry(currentJournalId, {
        title: finalTitle,
        textContent: serializedContent,
      });

      // Update local journals list with the backend response
      setJournals((prev) =>
        prev.map((j) => (j.id === currentJournalId ? updatedJournal : j))
      );

      const finalEntry = {
        ...entryData,
        title: finalTitle,
        updatedAt: new Date().toISOString(),
      };

      setActiveEntry(finalEntry);
      setSaveStatus('saved');
      showToast('Reflection saved to backend');
      return finalEntry;
    } catch (error) {
      console.error('Failed to save journal entry to backend:', error);
      setSaveStatus('error');
      showToast('Failed to save to backend');
      return null;
    }
  };

  // Create new blank entry draft
  const createNewEntry = () => {
    const newDraft = {
      id: null,
      title: '',
      content: '',
      date: new Date().toISOString(),
      mood: 'peaceful',
      tags: [],
      isFavorite: false,
      prompt: getRandomPrompt(),
    };
    setActiveEntry(newDraft);
    setActiveView('today');
    setSaveStatus('saved');
  };

  // Select an existing entry for editing
  const selectEntryForEdit = (id) => {
    const found = entries.find((e) => e.id === id);
    if (found) {
      setActiveEntry(found);
      setActiveView('today');
      setSaveStatus('saved');
    }
  };

  // Create a new Journal via backend API: POST /api/journal
  const createNewJournal = async ({ title, description }) => {
    try {
      const created = await journalApi.createJournal({ title, description });
      setJournals((prev) => [created, ...prev]);
      setActiveJournalId(created.id);
      setIsJournalModalOpen(false);
      showToast(`Journal "${created.title}" created`);
      return created;
    } catch (error) {
      console.error('Failed to create journal:', error);
      showToast('Error creating journal');
      throw error;
    }
  };

  // Switch active journal
  const selectJournal = (journalId) => {
    const match = journals.find((j) => j.id === journalId);
    if (match) {
      setActiveJournalId(journalId);
      createNewEntry();
      showToast(`Switched to "${match.title}"`);
    }
  };

  // Toggle favorite for an entry
  const toggleFavorite = async (id) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    const updatedFavorite = !entry.isFavorite;
    const updatedEntry = { ...entry, isFavorite: updatedFavorite };

    if (activeEntry && activeEntry.id === id) {
      setActiveEntry(updatedEntry);
    }

    // Persist updated favorite to backend
    await saveEntry(updatedEntry);
  };

  // Prompt delete entry
  const promptDeleteEntry = (id, title) => {
    setDeleteModal({
      isOpen: true,
      type: 'entry',
      targetId: id,
      title: title || 'Untitled Reflection',
    });
  };

  // Prompt delete journal
  const promptDeleteJournal = (journalId, title) => {
    setDeleteModal({
      isOpen: true,
      type: 'journal',
      targetId: journalId,
      title: title || 'Journal',
    });
  };

  // Confirm delete handler (for entry or journal)
  const confirmDelete = async () => {
    if (!deleteModal.targetId) return;

    if (deleteModal.type === 'journal') {
      try {
        await journalApi.deleteJournal(deleteModal.targetId);
        setJournals((prev) => {
          const remaining = prev.filter((j) => j.id !== deleteModal.targetId);
          if (activeJournalId === deleteModal.targetId) {
            setActiveJournalId(remaining.length > 0 ? remaining[0].id : null);
          }
          return remaining;
        });
        showToast('Journal deleted');
      } catch (err) {
        console.error('Failed to delete journal:', err);
        showToast('Error deleting journal');
      }
    } else {
      // Entry delete
      const idToDelete = deleteModal.targetId;
      // In the backend, entry removal is reflected by updating local journal map
      if (activeJournal && activeJournal.journalEntryMap) {
        const updatedMap = { ...activeJournal.journalEntryMap };
        delete updatedMap[idToDelete];
        const updatedJournal = { ...activeJournal, journalEntryMap: updatedMap };
        setJournals((prev) =>
          prev.map((j) => (j.id === activeJournal.id ? updatedJournal : j))
        );
      }

      if (activeEntry && activeEntry.id === idToDelete) {
        createNewEntry();
      }
      showToast('Reflection removed');
    }

    setDeleteModal({ isOpen: false, type: 'entry', targetId: null, title: '' });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, type: 'entry', targetId: null, title: '' });
  };

  // Export entries as Markdown or JSON
  const exportEntries = (format = 'markdown') => {
    let content = '';
    const journalName = activeJournal?.title?.replace(/[^a-zA-Z0-9_-]/g, '_') || 'daybook';
    let filename = `${journalName}-export-${new Date().toISOString().slice(0, 10)}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(entries, null, 2);
      filename += '.json';
      mimeType = 'application/json';
    } else {
      filename += '.md';
      content = entries
        .map((e) => {
          const dateStr = new Date(e.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          return `# ${e.title}\n**Date:** ${dateStr}  \n**Mood:** ${e.mood}  \n**Tags:** ${
            e.tags.join(', ') || 'None'
          }\n\n${e.prompt ? `> *Prompt: ${e.prompt}*\n\n` : ''}${e.content}\n\n---\n`;
        })
        .join('\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${entries.length} reflections as ${format.toUpperCase()}`);
  };

  // Update user preferences
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Preferences updated');
  };

  // Calculated stats
  const totalEntries = entries.length;
  const favoriteEntriesCount = entries.filter((e) => e.isFavorite).length;

  return (
    <JournalContext.Provider
      value={{
        // Backend state
        journals,
        activeJournal,
        activeJournalId,
        selectJournal,
        createNewJournal,
        promptDeleteJournal,
        apiStatus,
        isLoading,
        loadJournalsFromBackend,

        // Entries & Views
        entries,
        activeEntry,
        setActiveEntry,
        activeView,
        setActiveView,
        saveStatus,
        setSaveStatus,
        zenMode,
        setZenMode,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        settings,
        updateSettings,

        // Filters
        searchQuery,
        setSearchQuery,
        selectedMoodFilter,
        setSelectedMoodFilter,
        selectedTagFilter,
        setSelectedTagFilter,

        // Modals & Notifications
        deleteModal,
        promptDeleteEntry,
        confirmDelete,
        confirmDeleteEntry: confirmDelete,
        cancelDelete,
        isSettingsOpen,
        setIsSettingsOpen,
        isJournalModalOpen,
        setIsJournalModalOpen,
        toastMessage,
        showToast,

        // Actions
        saveEntry,
        createNewEntry,
        selectEntryForEdit,
        toggleFavorite,
        exportEntries,
        totalEntries,
        favoriteEntriesCount,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
