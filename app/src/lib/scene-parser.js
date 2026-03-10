/**
 * Parse a video script into individual scenes.
 * Supports formats like "SCENE 1", "SCÈNE 2", "Scene 3", or plain paragraphs.
 */
export function parseScenes(text) {
  const scenePattern = /(?:SCENE|SCÈNE|scene|scène)\s*(\d+)\s*[:\-\s]*(.*?)(?=(?:SCENE|SCÈNE|scene|scène)\s*\d+|$)/gis;
  const matches = [...text.matchAll(scenePattern)];

  if (matches.length > 0) {
    return matches.map((match, idx) => ({
      id: `scene-${idx}`,
      number: parseInt(match[1], 10),
      content: match[2].trim(),
      keywords: [],
      status: 'pending',
      videos: [],
      error: null,
    }));
  }

  // Fallback: split by double newline into paragraphs
  const paragraphs = text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return paragraphs.slice(0, 15).map((content, idx) => ({
    id: `scene-${idx}`,
    number: idx + 1,
    content,
    keywords: [],
    status: 'pending',
    videos: [],
    error: null,
  }));
}

/**
 * Extract search keywords from a scene description.
 * Uses a simple NLP approach: extracts meaningful words, removes stop words,
 * and builds search queries suitable for Pexels.
 */
const STOP_WORDS_FR = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'en', 'au', 'aux',
  'à', 'ce', 'ces', 'son', 'sa', 'ses', 'sur', 'dans', 'par', 'pour', 'avec',
  'qui', 'que', 'se', 'ne', 'pas', 'est', 'sont', 'ont', 'elle', 'il', 'ils',
  'elles', 'nous', 'vous', 'leur', 'leurs', 'mon', 'ma', 'mes', 'ton', 'ta',
  'tes', 'notre', 'votre', 'y', 'ou', 'mais', 'donc', 'car', 'ni', 'si',
  'plus', 'très', 'bien', 'aussi', 'même', 'tout', 'tous', 'cette', 'comme',
  'quand', 'alors', 'encore', 'entre', 'vers', 'chez', 'dont',
]);

const STOP_WORDS_EN = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'and', 'but', 'or', 'if', 'it', 'its',
  'he', 'she', 'they', 'them', 'this', 'that', 'these', 'those',
]);

// French to English translation map for common visual terms
const FR_TO_EN = {
  'femme': 'woman', 'homme': 'man', 'jeune': 'young', 'ville': 'city',
  'soleil': 'sun', 'lumière': 'light', 'matin': 'morning', 'soir': 'evening',
  'nuit': 'night', 'jour': 'day', 'ciel': 'sky', 'mer': 'sea', 'ocean': 'ocean',
  'montagne': 'mountain', 'forêt': 'forest', 'arbre': 'tree', 'eau': 'water',
  'rue': 'street', 'route': 'road', 'voiture': 'car', 'maison': 'house',
  'bureau': 'office', 'travail': 'work', 'café': 'coffee', 'cuisine': 'kitchen',
  'fenêtre': 'window', 'porte': 'door', 'chambre': 'bedroom', 'salon': 'living room',
  'appartement': 'apartment', 'bâtiment': 'building', 'bâtiments': 'buildings',
  'coucher': 'sunset', 'lever': 'sunrise', 'nuages': 'clouds', 'nuage': 'cloud',
  'pluie': 'rain', 'neige': 'snow', 'vent': 'wind', 'fleur': 'flower',
  'jardin': 'garden', 'parc': 'park', 'plage': 'beach', 'rivière': 'river',
  'pont': 'bridge', 'tour': 'tower', 'église': 'church', 'école': 'school',
  'enfant': 'child', 'enfants': 'children', 'famille': 'family', 'ami': 'friend',
  'amis': 'friends', 'groupe': 'group', 'gens': 'people', 'personne': 'person',
  'marche': 'walking', 'court': 'running', 'danse': 'dancing', 'chante': 'singing',
  'mange': 'eating', 'boit': 'drinking', 'dort': 'sleeping', 'assis': 'sitting',
  'debout': 'standing', 'regarde': 'watching', 'sourire': 'smile', 'sourit': 'smiling',
  'moderne': 'modern', 'ancien': 'old', 'nouveau': 'new', 'grand': 'large',
  'petit': 'small', 'blanc': 'white', 'noir': 'black', 'rouge': 'red',
  'bleu': 'blue', 'vert': 'green', 'doré': 'golden', 'rose': 'pink',
  'métropole': 'metropolis', 'futuriste': 'futuristic', 'urbain': 'urban',
  'trottoir': 'sidewalk', 'trottoirs': 'sidewalks', 'balcon': 'balcony',
  'couché': 'sunset', 'illuminer': 'illuminate', 'lumières': 'lights',
  'feux': 'traffic lights', 'circulation': 'traffic', 'avenues': 'avenues',
  'laptop': 'laptop', 'clavier': 'keyboard', 'ordinateur': 'computer',
  'photo': 'photo', 'table': 'table', 'chaise': 'chair',
  'cafetière': 'coffee maker', 'vapeur': 'steam', 'tasse': 'cup', 'tasses': 'cups',
  'porcelaine': 'porcelain', 'épuré': 'minimalist', 'minimaliste': 'minimalist',
  'réveille': 'waking up', 'ouvre': 'opens', 'ferme': 'closes',
  'contemple': 'contemplating', 'observe': 'observing', 'inspire': 'inspired',
  'beauté': 'beauty', 'moment': 'moment', 'pause': 'break',
  'spectacle': 'spectacle', 'couleurs': 'colors', 'couleur': 'color',
  'time-lapse': 'timelapse', 'timelapse': 'timelapse', 'montage': 'montage',
  'détails': 'details', 'énergie': 'energy',
};

export function extractKeywords(sceneContent, maxKeywords = 5) {
  const text = sceneContent.toLowerCase();

  // Tokenize
  const words = text
    .replace(/[.,;:!?()'"«»\-–—]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  // Remove stop words and translate to English
  const meaningful = [];
  const seen = new Set();

  for (const word of words) {
    if (STOP_WORDS_FR.has(word) || STOP_WORDS_EN.has(word)) continue;

    const translated = FR_TO_EN[word] || word;
    if (seen.has(translated)) continue;
    seen.add(translated);
    meaningful.push(translated);
  }

  // Take top keywords (prioritize translated English terms)
  return meaningful.slice(0, maxKeywords);
}

/**
 * Build a Pexels search query from keywords.
 */
export function buildSearchQuery(keywords) {
  return keywords.join(' ');
}
