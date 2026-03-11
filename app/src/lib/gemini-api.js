const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Generate a YouTube audio script and visual scenes from an article using Gemini API.
 * Returns an object with { script, scenes } where scenes is an array of { number, content, keywords[] }.
 */
export async function generateScriptAndScenes(apiKey, articleText) {
  // Dynamic scaling based on article length (~150 words/min narration, ~1 scene per 40s)
  const wordCount = articleText.trim().split(/\s+/).length;
  const targetMinutes = Math.max(3, Math.min(15, Math.round(wordCount / 150)));
  const minScenes = Math.max(5, Math.round(targetMinutes * 1.5));
  const maxScenes = Math.min(30, Math.round(targetMinutes * 2.5));
  const minWords = targetMinutes * 150;
  const maxTokens = targetMinutes <= 5 ? 16384 : 32000;

  const prompt = `Tu es un expert en création de contenu vidéo YouTube.

OBJECTIF : Transformer l'article ci-dessous en un script vidéo COMPLET et DÉTAILLÉ de ${targetMinutes} minutes de narration, découpé en scènes visuelles. Tu dois AUSSI créer une version PODCAST sous forme de dialogue entre deux experts.

IMPORTANT : Le script DOIT couvrir TOUT le contenu de l'article. Ne résume pas, développe chaque point. Enrichis et développe les idées pour atteindre la durée cible. Le champ "script" doit contenir le texte intégral de la narration. Chaque scène contient un morceau de cette narration dans "narration".

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
  ],
  "podcast": [
    {
      "speaker": "Alex",
      "text": "Réplique du premier expert."
    },
    {
      "speaker": "Sarah",
      "text": "Réplique du second expert."
    }
  ]
}

STRUCTURE :
- Génère entre ${minScenes} et ${maxScenes} scènes.
- Chaque scène doit avoir quatre à dix phrases de narration.
- Le script total doit faire au minimum ${minWords} mots. C'est crucial.
- Les mots-clés doivent être en ANGLAIS, concrets et visuels pour la recherche Pexels.

RÈGLES POUR LE PODCAST :
- Le podcast est un dialogue entre deux experts : Alex et Sarah.
- Le podcast doit être AUSSI LONG que le script audio, soit environ ${minWords} mots.
- Le dialogue doit couvrir TOUT le contenu de l'article, comme le script.
- Alex et Sarah se posent des questions, réagissent, rebondissent sur les idées.
- Le ton est naturel, conversationnel, comme une vraie discussion entre experts passionnés.
- Ils ne se contentent pas de répéter l'article, ils ajoutent des réflexions, des analogies, des exemples.
- Alterne les répliques régulièrement, chaque réplique fait deux à cinq phrases.
- Les mêmes règles TTS ci-dessous s'appliquent au podcast.

Règles STRICTES pour le script audio ET le podcast (optimisé Text-to-Speech) :
- Écris des phrases courtes et simples, maximum vingt mots par phrase.
- Une seule idée par phrase, jamais de phrases à rallonge.
- Utilise le POINT pour les fins de phrase, il crée une pause naturelle.
- Utilise la VIRGULE uniquement pour des pauses courtes et nécessaires.
- Utilise les POINTS DE SUSPENSION pour les pauses dramatiques ou les transitions.
- N'utilise JAMAIS de tirets, de barres obliques, de parenthèses ou de crochets.
- N'utilise JAMAIS d'abréviations : écris "c'est-à-dire" au lieu de "c.à.d", "numéro" au lieu de "n°", "pourcentage" au lieu de "%".
- Écris tous les nombres EN TOUTES LETTRES : "trois millions" pas "3 000 000", "vingt-cinq" pas "25".
- Écris les sigles lettre par lettre avec des points : "I.A." pas "IA", "O.N.U." pas "ONU".
- N'utilise JAMAIS de caractères spéciaux : *, #, @, &, =, +, <, >.
- N'utilise JAMAIS de listes à puces ou numérotées dans le script.
- N'utilise JAMAIS de gras, d'italique ou de formatage markdown.
- Évite les mots difficiles à prononcer ou les termes trop techniques sans les expliquer.
- Préfère les mots courants et naturels à l'oral.
- Termine chaque segment de narration par un point final.
- Ton engageant, fluide, naturel à l'oral.
- IMPORTANT pour le script : sépare le texte en paragraphes thématiques avec des sauts de ligne. Chaque changement de sujet ou de section doit commencer un nouveau paragraphe. Utilise le caractère antislash n antislash n pour séparer les paragraphes dans le JSON.

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
          maxOutputTokens: maxTokens,
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

    // Ensure podcast array exists (graceful fallback if Gemini omits it)
    if (!Array.isArray(result.podcast)) {
      result.podcast = [];
    }

    return result;
  } catch (e) {
    throw new Error('Impossible de parser la réponse Gemini. Réessayez.');
  }
}
