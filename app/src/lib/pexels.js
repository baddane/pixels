const BASE_URL = 'https://api.pexels.com';

export class PexelsClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async searchVideos(query, { perPage = 5, page = 1, orientation, size, locale } = {}) {
    const params = new URLSearchParams({
      query,
      per_page: String(perPage),
      page: String(page),
    });

    if (orientation) params.set('orientation', orientation);
    if (size) params.set('size', size);
    if (locale) params.set('locale', locale);

    const response = await fetch(`${BASE_URL}/videos/search?${params}`, {
      headers: { Authorization: this.apiKey },
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('Clé API Pexels invalide');
      if (response.status === 429) throw new Error('Limite de requêtes atteinte. Réessayez plus tard.');
      throw new Error(`Erreur Pexels: ${response.status}`);
    }

    return response.json();
  }

  async searchPhotos(query, { perPage = 5, page = 1 } = {}) {
    const params = new URLSearchParams({
      query,
      per_page: String(perPage),
      page: String(page),
    });

    const response = await fetch(`${BASE_URL}/v1/search?${params}`, {
      headers: { Authorization: this.apiKey },
    });

    if (!response.ok) {
      throw new Error(`Erreur Pexels: ${response.status}`);
    }

    return response.json();
  }

  getBestVideoFile(video, preferredQuality = 'hd') {
    if (!video.video_files?.length) return null;

    const files = [...video.video_files].sort((a, b) => (b.width || 0) - (a.width || 0));

    if (preferredQuality === 'hd') {
      return files.find(f => f.width >= 1080 && f.width <= 1920) || files[0];
    }
    if (preferredQuality === '4k') {
      return files.find(f => f.width >= 3840) || files[0];
    }

    return files.find(f => f.width >= 720) || files[0];
  }
}
