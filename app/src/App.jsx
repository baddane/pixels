import { useState, useCallback } from 'react';
import { Clapperboard, Key } from 'lucide-react';
import ArticleInput from './components/ArticleInput';
import GeneratedScript from './components/GeneratedScript';
import SceneCard from './components/SceneCard';
import ProgressBar from './components/ProgressBar';
import ApiKeysModal from './components/ApiKeysModal';
import { generateScriptAndScenes } from './lib/gemini-api';
import { searchVideos } from './lib/pexels-api';

function App() {
  const [geminiKey, setGeminiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [pexelsKey, setPexelsKey] = useState(import.meta.env.VITE_PEXELS_API_KEY || '');
  const [showKeysModal, setShowKeysModal] = useState(false);

  const [article, setArticle] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [scenes, setScenes] = useState([]);
  const [step, setStep] = useState('input'); // input | generating | searching | done
  const [error, setError] = useState(null);

  const keysConfigured = !!(geminiKey && pexelsKey);

  const updateScene = useCallback((id, updates) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!geminiKey || !pexelsKey) {
      setShowKeysModal(true);
      return;
    }
    if (!article.trim()) return;

    setError(null);
    setStep('generating');
    setScenes([]);
    setGeneratedScript('');

    try {
      // Step 1: Gemini generates script + scenes + keywords
      const result = await generateScriptAndScenes(geminiKey, article);
      setGeneratedScript(result.script);

      // Build scenes state from Gemini result
      const sceneList = result.scenes.map((s, idx) => ({
        id: `scene-${idx}`,
        number: s.number || idx + 1,
        content: s.visual,
        narration: s.narration,
        keywords: s.keywords || [],
        status: 'pending',
        videos: [],
        error: null,
      }));

      setScenes(sceneList);
      setStep('searching');

      // Step 2: Search Pexels for each scene
      for (const scene of sceneList) {
        const query = scene.keywords.join(' ');
        updateScene(scene.id, { status: 'searching' });

        try {
          const searchResult = await searchVideos(pexelsKey, query, {
            perPage: 6,
            orientation: 'landscape',
          });
          updateScene(scene.id, {
            status: 'ready',
            videos: searchResult.videos || [],
          });
        } catch (err) {
          updateScene(scene.id, {
            status: 'error',
            error: err.message,
          });
        }

        await new Promise(r => setTimeout(r, 300));
      }

      setStep('done');
    } catch (err) {
      setError(err.message);
      setStep('input');
    }
  }, [article, geminiKey, pexelsKey, updateScene]);

  const handleReset = () => {
    setArticle('');
    setGeneratedScript('');
    setScenes([]);
    setStep('input');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* API Keys Modal */}
      {showKeysModal && (
        <ApiKeysModal
          geminiKey={geminiKey}
          pexelsKey={pexelsKey}
          onGeminiKeyChange={setGeminiKey}
          onPexelsKeyChange={setPexelsKey}
          onClose={() => setShowKeysModal(false)}
        />
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clapperboard className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold">
              Pexels <span className="text-cyan-400">Video Scenes</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowKeysModal(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">
                {keysConfigured ? 'API configurées' : 'Configurer les API'}
              </span>
              <span className={`w-2 h-2 rounded-full ${keysConfigured ? 'bg-green-400' : 'bg-red-400'}`} />
            </button>
            <p className="text-xs text-slate-500 hidden sm:block">
              Vidéos par{' '}
              <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                Pexels
              </a>
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <StepBadge num={1} label="Coller l'article" active={step === 'input'} done={step !== 'input'} />
          <span className="text-slate-700">&rarr;</span>
          <StepBadge num={2} label="Script audio IA" active={step === 'generating'} done={['searching', 'done'].includes(step)} />
          <span className="text-slate-700">&rarr;</span>
          <StepBadge num={3} label="Scènes & Mots-clés" active={step === 'searching'} done={step === 'done'} />
          <span className="text-slate-700">&rarr;</span>
          <StepBadge num={4} label="Vidéos Pexels" active={step === 'done'} done={false} />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Article Input */}
        <ArticleInput
          value={article}
          onChange={setArticle}
          onSubmit={handleGenerate}
          loading={step === 'generating' || step === 'searching'}
          onReset={handleReset}
          showReset={step === 'done'}
        />

        {/* Generated Script */}
        {generatedScript && <GeneratedScript script={generatedScript} />}

        {/* Progress */}
        {scenes.length > 0 && <ProgressBar scenes={scenes} />}

        {/* Scenes */}
        {scenes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-300">
              Scènes visuelles ({scenes.length})
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

function StepBadge({ num, label, active, done }) {
  const base = 'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors';
  if (active) return <span className={`${base} bg-cyan-500/20 text-cyan-400`}>{num}. {label}</span>;
  if (done) return <span className={`${base} bg-green-500/10 text-green-400`}>{num}. {label}</span>;
  return <span className={`${base} bg-slate-800 text-slate-500`}>{num}. {label}</span>;
}

export default App;
