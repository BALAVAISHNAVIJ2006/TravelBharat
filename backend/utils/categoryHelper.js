// helper functions for category normalization and validation

const VALID_CATEGORIES = ['Heritage', 'Nature', 'Adventure', 'Religious'];

// synonyms for database filtering; keys are normalized categories
const SYNONYMS = {
  Heritage: ['heritage', 'fort', 'palace', 'historic'],
  Nature: ['nature','water','lake','river','hill','mountain','park','forest','waterfall'],
  Adventure: ['adventure','trek','rafting','camp','climb'],
  Religious: ['relig','temple','mosque','church','gurudwara','shrine']
};

function normalizeCategory(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const lower = raw.trim().toLowerCase();
  
  // common synonyms / keywords mapping to the four valid categories
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

  // try exact match with valid categories
  const matched = VALID_CATEGORIES.find(c => c.toLowerCase() === lower);
  if (matched) return matched;

  // fallback: return a default valid category (Heritage) to avoid enum errors
  // we choose Heritage as a safe default if no keyword matched
  return 'Heritage';
}

// build a regex that will match any of the synonyms for a given raw category string
function categoryFilterRegex(rawCategory) {
  const norm = normalizeCategory(rawCategory);
  const keywords = SYNONYMS[norm] || [norm.toLowerCase()];
  // escape regex special characters
  const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^(${escaped.join('|')})$`, 'i');
}

module.exports = {
  VALID_CATEGORIES,
  normalizeCategory,
  SYNONYMS,
  categoryFilterRegex
};
