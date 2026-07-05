// Web Worker for handling search and matching tasks in BrowserScope

interface IndexItem {
  id: string;
  title: string;
  content: string;
}

interface SearchMessage {
  query: string;
  items: IndexItem[];
  scope: 'all' | 'content';
  mode: 'fuzzy' | 'exact';
}

// Simple helper to clean and normalize strings for matching
function normalize(str: string): string {
  return (str || '').toLowerCase().trim();
}

// Sequential fuzzy matching (e.g., query "crm" matches "chrome")
function fuzzyMatch(text: string, query: string): boolean {
  const normText = normalize(text);
  const normQuery = normalize(query);
  
  if (!normQuery) return true;
  if (!normText) return false;
  
  // Try multi-term matching first (space-separated words)
  const terms = normQuery.split(/\s+/).filter(Boolean);
  if (terms.length > 1) {
    return terms.every(term => normText.includes(term));
  }
  
  // Sequential character matching
  let textIdx = 0;
  let queryIdx = 0;
  
  while (textIdx < normText.length && queryIdx < normQuery.length) {
    if (normText[textIdx] === normQuery[queryIdx]) {
      queryIdx++;
    }
    textIdx++;
  }
  
  return queryIdx === normQuery.length;
}

// Exact match check
function exactMatch(text: string, query: string): boolean {
  const normText = normalize(text);
  const normQuery = normalize(query);
  return normText.includes(normQuery);
}

self.onmessage = (event: MessageEvent<SearchMessage>) => {
  const { query, items, scope, mode } = event.data;
  
  if (!query || !query.trim()) {
    // If query is empty, return all IDs
    self.postMessage({ matchingIds: items.map(item => item.id) });
    return;
  }
  
  const matchingIds: string[] = [];
  
  for (const item of items) {
    // Select text to search based on scope
    const searchText = scope === 'all' ? `${item.title} ${item.content}` : item.content;
    const isMatch = mode === 'exact' ? exactMatch(searchText, query) : fuzzyMatch(searchText, query);
    
    if (isMatch) {
      matchingIds.push(item.id);
    }
  }
  
  self.postMessage({ matchingIds });
};
