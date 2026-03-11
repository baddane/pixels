const RUNWAY_BASE = 'https://api.dev.runwayml.com';
const RUNWAY_VERSION = '2024-11-06';
const POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_ATTEMPTS = 60; // 5 min max

export async function generateVideo(apiKey, promptText, { duration = 5, ratio = '1280:720' } = {}) {
  // Start generation task
  const res = await fetch(`${RUNWAY_BASE}/v1/text_to_video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'X-Runway-Version': RUNWAY_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gen4.5',
      promptText: promptText.slice(0, 1000),
      ratio,
      duration,
    }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Clé API Runway invalide.');
    if (res.status === 429) throw new Error('Rate limit Runway atteint. Réessayez plus tard.');
    const text = await res.text().catch(() => '');
    throw new Error(`Erreur Runway API: ${res.status} ${text}`);
  }

  const { id: taskId } = await res.json();

  // Poll for completion
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL));

    const pollRes = await fetch(`${RUNWAY_BASE}/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Runway-Version': RUNWAY_VERSION,
      },
    });

    if (!pollRes.ok) continue;

    const task = await pollRes.json();

    if (task.status === 'SUCCEEDED') {
      const videoUrl = task.output?.[0] || task.artifacts?.[0]?.url || task.result?.url || null;
      if (!videoUrl) throw new Error('Vidéo générée mais URL introuvable dans la réponse.');
      return {
        id: taskId,
        url: videoUrl,
        source: 'runway',
        duration,
        prompt: promptText,
      };
    }

    if (task.status === 'FAILED') {
      throw new Error(task.failure || 'La génération vidéo Runway a échoué.');
    }
  }

  throw new Error('Timeout: la génération vidéo Runway a pris trop de temps.');
}

export async function generateVideoForScene(apiKey, scene) {
  const prompt = `${scene.content}. ${scene.keywords.join(', ')}. Cinematic, professional footage, smooth motion.`;
  return generateVideo(apiKey, prompt, { duration: 5, ratio: '1280:720' });
}
