import { useState, useCallback } from 'react';
import { Clapperboard } from 'lucide-react';
import ScriptInput from './components/ScriptInput';
import SceneCard from './components/SceneCard';
import ProgressBar from './components/ProgressBar';
import { parseScenes, extractKeywords, buildSearchQuery } from './lib/scene-parser';
import { searchVideos } from './lib/pexels-api';

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

function App() {
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateScene = useCallback((id, updates) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const handleSearch = useCallback(async () => {
    if (!API_KEY) {
      alert('Variable d\'environnement VITE_PEXELS_API_KEY non configurée.');
      return;
    }
    if (!script.trim()) return;

    setLoading(true);

    // Parse scenes
    const parsed = parseScenes(script);

    // Extract keywords for each scene
    const withKeywords = parsed.map(scene => ({
      ...scene,
      keywords: extractKeywords(scene.content),
      status: 'pending',
      videos: [],
      error: null,
    }));

    setScenes(withKeywords);

    // Search Pexels for each scene sequentially (to respect rate limits)
    for (const scene of withKeywords) {
      const query = buildSearchQuery(scene.keywords);
      updateScene(scene.id, { status: 'searching' });

      try {
        const result = await searchVideos(API_KEY, query, { perPage: 6, orientation: 'landscape' });
        updateScene(scene.id, {
          status: 'ready',
          videos: result.videos || [],
        });
      } catch (err) {
        updateScene(scene.id, {
          status: 'error',
          error: err.message,
        });
      }

      // Small delay between requests to be respectful of rate limits
      await new Promise(r => setTimeout(r, 300));
    }

    setLoading(false);
  }, [script, updateScene]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clapperboard className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold">
              Pexels <span className="text-cyan-400">Video Scenes</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            Vidéos fournies par{' '}
            <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
              Pexels
            </a>
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Script Input */}
        <ScriptInput
          value={script}
          onChange={setScript}
          onSubmit={handleSearch}
          loading={loading}
        />

        {/* Progress */}
        {scenes.length > 0 && <ProgressBar scenes={scenes} />}

        {/* Scenes */}
        {scenes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-300">
              Scènes ({scenes.length})
            </h2>
            {scenes.map(scene => (
              <SceneCard key={scene.id} scene={scene} />
            ))}
          </div>
        )}

        {/* Attribution */}
        {scenes.some(s => s.videos.length > 0) && (
          <footer className="text-center text-xs text-slate-600 pt-4 border-t border-slate-800">
            Photos et vidéos fournies par{' '}
            <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
              Pexels
            </a>
          </footer>
        )}
      </main>
    </div>
  );
}

export default App;
