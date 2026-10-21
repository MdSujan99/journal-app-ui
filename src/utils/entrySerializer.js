/**
 * Helper utilities to serialize/deserialize entry content and map keys
 * between Daybook frontend rich format and Spring Boot backend journalEntryMap.
 */

export function parseEntryKey(key, fallbackDate) {
  const delimiterIndex = key.indexOf(':');
  let rawDate;
  let title;

  if (delimiterIndex !== -1) {
    const timestampStr = key.slice(0, delimiterIndex);
    title = key.slice(delimiterIndex + 1).trim();
    
    // Check if timestamp is epoch milliseconds or ISO string
    const millis = Number(timestampStr);
    if (!isNaN(millis) && millis > 0) {
      rawDate = new Date(millis).toISOString();
    } else {
      const parsed = Date.parse(timestampStr);
      rawDate = !isNaN(parsed) ? new Date(parsed).toISOString() : (fallbackDate || new Date().toISOString());
    }
  } else {
    title = key.trim();
    rawDate = fallbackDate || new Date().toISOString();
  }

  return {
    title: title || 'Untitled Reflection',
    date: rawDate,
  };
}

export function parseEntryContent(rawText) {
  let content = rawText || '';
  let mood = 'peaceful';
  let tags = [];
  let isFavorite = false;
  let prompt = '';

  if (typeof content === 'string' && content.startsWith('---')) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (match) {
      const frontmatter = match[1];
      content = match[2];
      
      frontmatter.split('\n').forEach(line => {
        const colon = line.indexOf(':');
        if (colon > -1) {
          const key = line.slice(0, colon).trim();
          const val = line.slice(colon + 1).trim();
          if (key === 'mood') mood = val || 'peaceful';
          if (key === 'tags') tags = val ? val.split(',').map(t => t.trim()).filter(Boolean) : [];
          if (key === 'isFavorite') isFavorite = val === 'true';
          if (key === 'prompt') prompt = val || '';
        }
      });
    }
  }

  return {
    content,
    mood,
    tags,
    isFavorite,
    prompt,
  };
}

export function serializeEntryContent({ content, mood, tags, isFavorite, prompt }) {
  const metaLines = [];
  if (mood) metaLines.push(`mood: ${mood}`);
  if (Array.isArray(tags) && tags.length > 0) metaLines.push(`tags: ${tags.join(', ')}`);
  if (isFavorite) metaLines.push(`isFavorite: true`);
  if (prompt) metaLines.push(`prompt: ${prompt.replace(/\r?\n/g, ' ')}`);

  if (metaLines.length === 0) {
    return content || '';
  }

  return `---\n${metaLines.join('\n')}\n---\n${content || ''}`;
}

export function convertJournalToEntries(journal) {
  if (!journal || !journal.journalEntryMap || typeof journal.journalEntryMap !== 'object') {
    return [];
  }

  const entries = [];
  for (const [key, rawText] of Object.entries(journal.journalEntryMap)) {
    const { title, date } = parseEntryKey(key, journal.updatedAt || journal.createdAt);
    const { content, mood, tags, isFavorite, prompt } = parseEntryContent(rawText);

    entries.push({
      id: key,
      journalId: journal.id,
      title,
      content,
      date,
      mood,
      tags,
      isFavorite,
      prompt,
      updatedAt: date,
    });
  }

  // Sort descending by date
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  return entries;
}
