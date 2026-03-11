import { X, Key } from 'lucide-react';

export default function ApiKeysModal({ geminiKey, pexelsKey, onGeminiKeyChange, onPexelsKeyChange, onClose }) {
  const canClose = geminiKey && pexelsKey;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Configuration API</h2>
          </div>
          {canClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Clé API Gemini
            </label>
            <p className="text-xs text-slate-500">
              Obtenez une clé gratuite sur{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                aistudio.google.com
              </a>
            </p>
            <input
              type="password"
              placeholder="AIza..."
              value={geminiKey}
              onChange={e => onGeminiKeyChange(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Clé API Pexels
            </label>
            <p className="text-xs text-slate-500">
              Obtenez une clé gratuite sur{' '}
              <a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                pexels.com/api
              </a>
            </p>
            <input
              type="password"
              placeholder="Votre clé API Pexels"
              value={pexelsKey}
              onChange={e => onPexelsKeyChange(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          disabled={!canClose}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all"
        >
          {canClose ? 'Continuer' : 'Renseignez les deux clés API'}
        </button>
      </div>
    </div>
  );
}
