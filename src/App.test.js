import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import journalApi from './api/journalApi';

jest.mock('./api/journalApi');

const MOCK_JOURNAL = {
  id: 'test-journal-1',
  title: 'Personal Journal',
  description: 'My test journal',
  createdAt: '2026-10-18T10:00:00.000Z',
  updatedAt: '2026-10-18T10:00:00.000Z',
  journalEntryMap: {
    '1729270093847:The quiet rhythm of an autumn morning':
      '---\nmood: peaceful\ntags: Morning, Mindfulness\nisFavorite: true\n---\nWoke up before the alarm today.',
    '1729183693847:Walking through the old pine trail':
      '---\nmood: reflective\ntags: Nature, Solitude\nisFavorite: false\n---\nTook the trail behind the reservoir.',
  },
};

describe('Daybook Journal Application with Backend Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    journalApi.checkHealth.mockResolvedValue({ success: true, data: 'Hello from Journal API' });
    journalApi.getAllJournals.mockResolvedValue([MOCK_JOURNAL]);
    journalApi.createJournal.mockImplementation(async ({ title, description }) => ({
      id: `journal-${Date.now()}`,
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      journalEntryMap: {},
    }));
    journalApi.createJournalEntry.mockImplementation(async (id, { title, textContent }) => ({
      ...MOCK_JOURNAL,
      journalEntryMap: {
        ...MOCK_JOURNAL.journalEntryMap,
        [`${Date.now()}:${title}`]: textContent,
      },
    }));
    journalApi.deleteJournal.mockResolvedValue('test-journal-1');
  });

  test('renders Daybook branding and navigation links', async () => {
    render(<App />);
    expect(screen.getAllByText(/Daybook/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Today/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/All Entries|Entries/i)[0]).toBeInTheDocument();
    expect(screen.getByTitle('Journals')).toBeInTheDocument();
  });

  test('displays reflective writing prompt and mood selector on Today page', async () => {
    render(<App />);
    expect(screen.getByTitle(/Peaceful/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Grateful/i)).toBeInTheDocument();
    expect(screen.getByText(/Peaceful/i)).toBeInTheDocument();
  });

  test('navigates to All Entries page and shows backend reflections', async () => {
    render(<App />);

    await waitFor(() => {
      expect(journalApi.getAllJournals).toHaveBeenCalled();
    });

    const allEntriesButton = screen.getByTitle('All Entries');
    fireEvent.click(allEntriesButton);

    await waitFor(() => {
      expect(screen.getByText(/All Reflections/i)).toBeInTheDocument();
      expect(screen.getByText(/The quiet rhythm of an autumn morning/i)).toBeInTheDocument();
      expect(screen.getByText(/Walking through the old pine trail/i)).toBeInTheDocument();
    });
  });

  test('allows searching reflections in All Entries view', async () => {
    render(<App />);

    await waitFor(() => {
      expect(journalApi.getAllJournals).toHaveBeenCalled();
    });

    const allEntriesButton = screen.getByTitle('All Entries');
    fireEvent.click(allEntriesButton);

    await waitFor(() => {
      expect(screen.getByText(/The quiet rhythm of an autumn morning/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search reflections/i);
    fireEvent.change(searchInput, { target: { value: 'autumn' } });

    expect(screen.getByText(/The quiet rhythm of an autumn morning/i)).toBeInTheDocument();
    expect(screen.queryByText(/Walking through the old pine trail/i)).not.toBeInTheDocument();
  });

  test('navigates to Calendar view and displays days', async () => {
    render(<App />);
    const calendarButton = screen.getByTitle('Calendar');
    fireEvent.click(calendarButton);

    expect(screen.getByText(/Calendar Rhythm/i)).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  test('navigates to Journals management view and lists backend journals', async () => {
    render(<App />);

    await waitFor(() => {
      expect(journalApi.getAllJournals).toHaveBeenCalled();
    });

    const journalsButton = screen.getByTitle('Journals');
    fireEvent.click(journalsButton);

    await waitFor(() => {
      expect(screen.getByText(/Your Journals/i)).toBeInTheDocument();
      expect(screen.getAllByText('Personal Journal').length).toBeGreaterThan(0);
    });
  });

  test('opens and closes settings modal', async () => {
    render(<App />);
    const settingsButton = screen.getByTitle('Settings');
    fireEvent.click(settingsButton);

    expect(screen.getByText(/Daybook Preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/Editor Typography/i)).toBeInTheDocument();

    const doneButton = screen.getByText(/Done/i);
    fireEvent.click(doneButton);

    expect(screen.queryByText(/Daybook Preferences/i)).not.toBeInTheDocument();
  });
});
