import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { MOODS } from '../../data/mockEntries';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowRight, Plus } from 'lucide-react';

const CalendarView = () => {
  const { entries, selectEntryForEdit, createNewEntry, setActiveEntry, setActiveView, activeJournal } = useJournal();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const entriesByDate = {};
  entries.forEach((e) => {
    const d = new Date(e.date);
    const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!entriesByDate[dateKey]) entriesByDate[dateKey] = [];
    entriesByDate[dateKey].push(e);
  });

  const selectedKey = `${year}-${month}-${selectedDay}`;
  const selectedDayEntries = entriesByDate[selectedKey] || [];

  const handleWriteForSelectedDate = () => {
    const entryDate = new Date(year, month, selectedDay, 12, 0, 0);
    createNewEntry();
    setActiveEntry(prev => ({
      ...prev,
      date: entryDate.toISOString()
    }));
    setActiveView('today');
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 md:py-8 px-4 md:px-6 flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-parchment-border/40 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-charcoal tracking-tight">
            Calendar Rhythm
          </h2>
          {activeJournal && (
            <span className="text-xs font-sans text-sage-dark bg-sage-light/60 px-2 py-0.5 rounded-md font-medium">
              {activeJournal.title}
            </span>
          )}
        </div>
        <p className="text-xs text-charcoal-muted/70 mt-0.5">
          Browse your reflections across the days.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="md:col-span-2 rounded-xl border border-parchment-border/40 p-5">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-medium text-charcoal">
              {monthNames[month]} {year}
            </h3>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded text-charcoal-muted hover:text-charcoal transition-colors"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded text-charcoal-muted hover:text-charcoal transition-colors"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="text-[11px] font-medium text-charcoal-muted/60 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Month Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 rounded-lg bg-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const cellKey = `${year}-${month}-${dayNum}`;
              const dayEntries = entriesByDate[cellKey] || [];
              const isSelected = selectedDay === dayNum;
              const hasEntries = dayEntries.length > 0;
              const primaryMood = hasEntries ? dayEntries[0].mood : null;
              const moodConfig = MOODS.find((m) => m.id === primaryMood);

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center p-1 text-xs transition-all relative ${
                    isSelected
                      ? 'bg-sage-light text-sage-dark font-semibold ring-1 ring-sage/50'
                      : hasEntries
                      ? 'text-charcoal font-medium hover:bg-parchment/40'
                      : 'text-charcoal-muted/60 hover:bg-parchment/20'
                  }`}
                >
                  <span className="text-[11px] leading-tight">
                    {dayNum}
                  </span>

                  {hasEntries && (
                    <span className="text-[9px] leading-none mt-0.5">
                      {moodConfig?.icon || '•'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Entries Panel */}
        <div className="rounded-xl border border-parchment-border/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 pb-2.5 border-b border-parchment-border/40">
              <CalendarIcon className="w-3.5 h-3.5 text-sage" />
              <h4 className="font-serif text-base font-medium text-charcoal">
                {monthNames[month]} {selectedDay}
              </h4>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {selectedDayEntries.length > 0 ? (
                selectedDayEntries.map((entry) => {
                  const mood = MOODS.find((m) => m.id === entry.mood);
                  return (
                    <div
                      key={entry.id}
                      onClick={() => selectEntryForEdit(entry.id)}
                      className="p-2.5 rounded-lg border border-parchment-border/30 hover:bg-parchment/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[10px] text-charcoal-muted/70 mb-0.5">
                        <span>{mood?.icon} {mood?.label}</span>
                        <span>{new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <h5 className="font-serif font-medium text-xs text-charcoal group-hover:text-sage-dark line-clamp-1">
                        {entry.title}
                      </h5>
                      <div className="mt-1 flex items-center justify-end text-[11px] text-sage-dark group-hover:underline">
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3 ml-0.5" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-charcoal-muted/60">
                  <p className="text-xs">No reflections on this day.</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleWriteForSelectedDate}
            className="w-full mt-3 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-charcoal hover:bg-parchment/50 border border-parchment-border transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-sage" />
            <span>Write for this date</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
