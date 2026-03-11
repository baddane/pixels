const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Generate a YouTube audio script and visual scenes from an article using Gemini API.
 * Returns an object with { script, scenes } where scenes is an array of { number, content, keywords[] }.
 */
export async function generateScriptAndScenes(apiKey, articleText) {
  const prompt = `Tu es un expert en création de contenu vidéo YouTube.

OBJECTIF : Transformer l'article ci-dessous en un script vidéo COMPLET et DÉTAILLÉ de trois à cinq minutes de narration, découpé en scènes visuelles.

IMPORTANT : Le script DOIT couvrir TOUT le contenu de l'article. Ne résume pas, développe chaque point. Le champ "script" doit contenir le texte intégral de la narration. Chaque scène contient un morceau de cette narration dans "narration".

FORMAT DE SORTIE : JSON valide uniquement, sans markdown, sans backticks.
{
  "script": "Le texte COMPLET et LONG du script audio, couvrant tout l'article...",
  "scenes": [
    {
      "number": 1,
      "narration": "Le morceau de narration pour cette scène. Plusieurs phrases.",
      "visual": "Description visuelle de ce qu'on voit à l'écran",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}

STRUCTURE :
- Génère entre huit et douze scènes.
- Chaque scène doit avoir trois à huit phrases de narration.
- Le script total doit faire au minimum six cents mots.
- Les mots-clés doivent être en ANGLAIS, concrets et visuels pour la recherche Pexels.

STYLE DE NARRATION (optimisé pour synthèse vocale) :
- Phrases courtes, maximum vingt mots. Une idée par phrase.
- Ponctuation simple : point final pour les pauses, virgule pour les courtes respirations, points de suspension pour les transitions dramatiques.
- Aucun tiret, parenthèse, crochet, barre oblique.
- Aucune abréviation. Écris les mots en entier : "c'est-à-dire" et non "c.à.d", "numéro" et non "n°".
- Nombres en toutes lettres : "trois millions" et non "3 000 000".
- Sigles épelés avec des points : "I.A." et non "IA".
- Aucun caractère spécial, aucun formatage markdown, aucune liste à puces.
- Ton engageant, fluide, naturel à l'oral.

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
          maxOutputTokens: 8192,
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
