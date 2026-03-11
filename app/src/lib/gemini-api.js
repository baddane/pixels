const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Generate a YouTube audio script and visual scenes from an article using Gemini API.
 * Returns an object with { script, scenes } where scenes is an array of { number, content, keywords[] }.
 */
export async function generateScriptAndScenes(apiKey, articleText) {
  const prompt = `Tu es un expert en création de contenu vidéo YouTube. À partir de l'article suivant, génère :

1. Un **script audio** narratif pour une vidéo YouTube (ton engageant, fluide, adapté à l'oral)
2. Des **scènes visuelles** correspondant au script, chaque scène décrivant ce qu'on voit à l'écran pendant la narration
3. Pour chaque scène, des **mots-clés en anglais** (3 à 5) pour rechercher des vidéos stock sur Pexels

Réponds UNIQUEMENT en JSON valide avec cette structure exacte (pas de markdown, pas de backticks) :
{
  "script": "Le texte complet du script audio...",
  "scenes": [
    {
      "number": 1,
      "narration": "La partie du script audio correspondant à cette scène",
      "visual": "Description visuelle de ce qu'on voit à l'écran",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}

Règles :
- Le script doit durer environ 3-5 minutes de narration
- Génère entre 5 et 12 scènes
- Les mots-clés doivent être en ANGLAIS pour la recherche Pexels
- Les mots-clés doivent être concrets et visuels (pas de concepts abstraits)
- Chaque scène doit avoir une description visuelle claire

Règles STRICTES pour le script audio (optimisé Text-to-Speech) :
- Écris des phrases courtes et simples (max 20 mots par phrase)
- Une seule idée par phrase, jamais de phrases à rallonge
- Utilise le POINT (.) pour les fins de phrase — il crée une pause naturelle
- Utilise la VIRGULE (,) uniquement pour des pauses courtes et nécessaires
- Utilise les POINTS DE SUSPENSION (...) pour les pauses dramatiques ou les transitions
- N'utilise JAMAIS de tirets (—, –), de barres obliques (/), de parenthèses () ou de crochets []
- N'utilise JAMAIS d'abréviations : écris "c'est-à-dire" au lieu de "c.à.d", "numéro" au lieu de "n°", "pourcentage" au lieu de "%"
- Écris tous les nombres EN TOUTES LETTRES : "trois millions" pas "3 000 000", "vingt-cinq" pas "25"
- Écris les sigles lettre par lettre avec des points : "I.A." pas "IA", "O.N.U." pas "ONU"
- N'utilise JAMAIS de caractères spéciaux : *, #, @, &, =, +, <, >
- N'utilise JAMAIS de listes à puces ou numérotées dans le script
- N'utilise JAMAIS de gras (**), d'italique ou de formatage markdown
- Évite les mots difficiles à prononcer ou les termes trop techniques sans les expliquer
- Préfère les mots courants et naturels à l'oral
- Termine chaque segment de narration par un point final

ARTICLE :
${articleText}`;

  const res = await fetch(
    `${GEMINI_BASE}/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 400) throw new Error('Clé API Gemini invalide ou requête incorrecte.');
    if (res.status === 429) throw new Error('Rate limit Gemini atteint. Réessayez dans quelques instants.');
    throw new Error(err.error?.message || `Erreur Gemini API: ${res.status}`);
  }

  const data = await res.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('Réponse vide de Gemini. Réessayez.');
  }

  // Parse JSON from response (strip markdown code blocks if present)
  const cleaned = textContent.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  try {
    const result = JSON.parse(cleaned);

    if (!result.script || !Array.isArray(result.scenes)) {
      throw new Error('Format de réponse inattendu');
    }

    return result;
  } catch (e) {
    throw new Error('Impossible de parser la réponse Gemini. Réessayez.');
  }
}
