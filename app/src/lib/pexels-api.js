const PEXELS_BASE = 'https://api.pexels.com';

export async function searchVideos(apiKey, query, { orientation = '', size = '', perPage = 6, page = 1 } = {}) {
  const params = new URLSearchParams({ query, per_page: perPage, page });
  if (orientation) params.set('orientation', orientation);
  if (size) params.set('size', size);

  const res = await fetch(`${PEXELS_BASE}/videos/search?${params}`, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limit atteint. Attendez quelques minutes.');
    throw new Error(`Erreur Pexels API: ${res.status}`);
  }

  return res.json();
}

export function getBestVideoFile(video) {
  if (!video.video_files?.length) return null;
  // Prefer HD quality (720-1080p)
  const sorted = [...video.video_files]
    .filter(f => f.width && f.height)
    .sort((a, b) => {
      const aScore = Math.abs(a.height - 720);
      const bScore = Math.abs(b.height - 720);
      return aScore - bScore;
    });
  return sorted[0] || video.video_files[0];
}
