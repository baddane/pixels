# Configuration Avancée & Intégration API

## Architecture Technique

### Flux de données
```
Script Input
    ↓
Détection Scènes (Regex)
    ↓
Extraction Keywords (Claude API)
    ↓
Recherche Vidéos (Pexels API)
    ↓
Affichage & Téléchargement
```

---

## Configuration Claude API

### Endpoint utilisé
```
POST https://api.anthropic.com/v1/messages
```

### Paramètres
```javascript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 300,
  messages: [
    {
      role: "user",
      content: "Extrait 3-5 mots-clés pour [SCENE_CONTENT]"
    }
  ]
}
```

### Résultats attendus
- Format : liste de mots-clés séparés par des virgules
- Langues : français, anglais (idéal)
- Exemple : "femme, café, appartement, matin, minimaliste"

---

## Configuration Pexels API

### Endpoint de recherche
```
GET https://api.pexels.com/videos/search
```

### Paramètres requis
```
query=keywords           // Les mots-clés extraits
per_page=5              // Nombre de résultats (max 80)
Authorization: YOUR_KEY // Votre clé API
```

### Réponse exemple
```json
{
  "videos": [
    {
      "id": 3173618,
      "duration": 20,
      "width": 1920,
      "height": 1080,
      "photographer": "John Doe",
      "video_files": [
        {
          "id": 8123455,
          "quality": "hd",
          "type": "video/mp4",
          "width": 1920,
          "height": 1080,
          "link": "https://cdn.pexels.com/videos/..."
        }
      ]
    }
  ]
}
```

---

## Utilisation en Production

### Option 1 : Backend Node.js (Recommandé)

Pour éviter d'exposer votre clé API côté client, créez un backend :

```javascript
// backend/routes/videos.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/search', async (req, res) => {
  const { keywords } = req.body;
  
  try {
    const response = await axios.get(
      'https://api.pexels.com/videos/search',
      {
        params: {
          query: keywords.join(' '),
          per_page: 5
        },
        headers: {
          'Authorization': process.env.PEXELS_API_KEY
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

```javascript
// App.jsx - Mise à jour
const searchPexelsVideos = async (keywords) => {
  const response = await fetch('/api/videos/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords })
  });
  return response.json();
};
```

### Option 2 : Vercel/Netlify Functions

```javascript
// api/search-videos.js (Vercel)
export default async (req, res) => {
  const { keywords } = req.body;
  
  const response = await fetch(
    `https://api.pexels.com/videos/search?query=${keywords.join('+')}&per_page=5`,
    {
      headers: { 'Authorization': process.env.PEXELS_API_KEY }
    }
  );
  
  const data = await response.json();
  res.status(200).json(data);
};
```

### Option 3 : Self-hosted avec Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

ENV PEXELS_API_KEY=your_key_here
CMD ["npm", "start"]
```

---

## Optimisations Performantes

### 1. Cache des résultats
```javascript
const cache = new Map();

const searchWithCache = async (keywords) => {
  const cacheKey = keywords.sort().join('_');
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const results = await searchPexelsVideos(keywords);
  cache.set(cacheKey, results);
  
  return results;
};
```

### 2. Requêtes parallèles
```javascript
const processAllScenes = async () => {
  const promises = scenes.map(async (scene) => {
    const keywords = await extractKeywords(scene.content);
    return searchPexelsVideos(keywords);
  });
  
  const results = await Promise.all(promises);
  return results;
};
```

### 3. Pagination des résultats
```javascript
const loadMoreVideos = async (sceneId, page = 1) => {
  const response = await fetch(
    `https://api.pexels.com/videos/search?query=${query}&per_page=5&page=${page}`,
    { headers: { 'Authorization': pexelsApiKey } }
  );
  
  return response.json();
};
```

---

## Variables d'Environnement

Créez un fichier `.env` :

```env
# Pexels
VITE_PEXELS_API_KEY=votre_cle_api

# Claude (optionnel - si backend)
CLAUDE_API_KEY=votre_cle_claude

# Serveur
VITE_API_BASE_URL=http://localhost:3000

# Mode
VITE_MODE=production
```

---

## Rate Limiting & Quotas

### Pexels (API gratuite)
- **200 requêtes/heure**
- **2000 requêtes/jour**
- Respectez les délais avec `setTimeout`

```javascript
// Limiter à 2 requêtes par seconde
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

for (const scene of scenes) {
  await processScene(scene);
  await sleep(500); // 2 requêtes/sec = 500ms
}
```

### Claude API
- Gratuit pour les artifacts (montant donné)
- Pour production, consultez pricing Anthropic

---

## Gestion des Erreurs

### Retry Logic
```javascript
const retryFetch = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * (i + 1)); // Backoff exponentiel
    }
  }
};
```

### Validation
```javascript
const validateResponse = (data) => {
  if (!data.videos || !Array.isArray(data.videos)) {
    throw new Error('Format de réponse invalide');
  }
  
  return data.videos.filter(v => 
    v.duration >= 3 && 
    v.video_files?.length > 0
  );
};
```

---

## Stockage Avancé

### LocalStorage (Client)
```javascript
const saveSearchHistory = (scene, keywords) => {
  const history = JSON.parse(
    localStorage.getItem('searchHistory') || '[]'
  );
  
  history.push({ scene, keywords, timestamp: Date.now() });
  localStorage.setItem('searchHistory', JSON.stringify(history.slice(-50)));
};
```

### IndexedDB (Pour gros volumes)
```javascript
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VideoMaker', 1);
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore('videos', { keyPath: 'id' });
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
```

---

## Intégration Éditeurs Populaires

### Adobe Premiere Pro (Extension)
```javascript
// Générer un XML compatible Premiere
const generatePremierseXML = (videos) => {
  return `<?xml version="1.0"?>
<project>
  <bin name="Pexels Videos">
    ${videos.map(v => `
      <clip id="${v.id}">
        <name>${v.photographer}</name>
        <file path="/path/to/${v.id}.mp4"/>
        <duration>${v.duration}</duration>
      </clip>
    `).join('')}
  </bin>
</project>`;
};
```

### DaVinci Resolve (Fusion)
```python
# Importer vidéos directement
import DaVinciResolveScript as dvs

resolve = dvs.scriptapp("Resolve")
project = resolve.GetProjectManager().GetCurrentProject()
timeline = project.GetCurrentTimeline()

for video_file in downloaded_videos:
    media_pool = project.GetMediaPool()
    media_pool.ImportMedia([video_file])
```

---

## Monitoring & Analytics

### Tracking des usages
```javascript
const trackUsage = (event, data) => {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      timestamp: new Date(),
      ...data
    })
  });
};

// Utilisation
trackUsage('scene_processed', { sceneId: 1, keywordCount: 4 });
trackUsage('video_downloaded', { videoId: 123, quality: '1080p' });
```

---

## Sécurité

### XSS Protection
```javascript
// Sanitizer les entrées utilisateur
const sanitizeInput = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
```

### CORS
```javascript
// Backend express
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

### Rate Limiting côté serveur
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100 // 100 requêtes par minute
});

app.use('/api/', limiter);
```

---

## Déploiement

### Heroku
```bash
heroku create videomaker-app
heroku config:set PEXELS_API_KEY=your_key
git push heroku main
```

### AWS Lambda
```javascript
// handler.js
exports.searchVideos = async (event) => {
  // Logique de recherche
  return {
    statusCode: 200,
    body: JSON.stringify(videos)
  };
};
```

---

## Ressources pour approfondir

- [Pexels API Docs](https://www.pexels.com/api/documentation/)
- [Claude API Reference](https://docs.anthropic.com/en/api/)
- [React Performance Guide](https://react.dev/reference/react)
- [Web APIs MDN](https://developer.mozilla.org/en-US/docs/Web/API)
