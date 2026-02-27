// frontend counterpart of the backend normalization logic
// ensures UI always shows one of the four canonical categories when possible

export const VALID_CATEGORIES = ['Heritage', 'Nature', 'Adventure', 'Religious'];

export function normalizeCategory(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const lower = raw.trim().toLowerCase();

  if (lower.includes('heritage') || lower.includes('fort') || lower.includes('palace') || lower.includes('historic')) {
    return 'Heritage';
  }
  if (
    lower.includes('nature') ||
    lower.includes('water') ||
    lower.includes('lake') ||
    lower.includes('river') ||
    lower.includes('hill') ||
    lower.includes('mountain') ||
    lower.includes('park') ||
    lower.includes('forest') ||
    lower.includes('waterfall')
  ) {
    return 'Nature';
  }
  if (lower.includes('adventure') || lower.includes('trek') || lower.includes('rafting') || lower.includes('camp') || lower.includes('climb')) {
    return 'Adventure';
  }
  if (lower.includes('relig') || lower.includes('temple') || lower.includes('mosque') || lower.includes('church') || lower.includes('gurudwara') || lower.includes('shrine')) {
    return 'Religious';
  }

  // exact match
  const matched = VALID_CATEGORIES.find(c => c.toLowerCase() === lower);
  if (matched) return matched;

  // fallback to raw with capitalized first letter
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// optional helper to get a color for a normalized category
export function categoryColor(cat) {
  const normalized = normalizeCategory(cat);
  switch (normalized) {
    case 'Heritage': return '#8b5cf6';
    case 'Nature': return '#10b981';
    case 'Adventure': return '#f59e0b';
    case 'Religious': return '#ef4444';
    default: return '#6b7280';
  }
}
