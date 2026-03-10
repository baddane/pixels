import { useState } from 'react';
import { Key, ExternalLink } from 'lucide-react';

export default function ApiKeyModal({ onSubmit, onClose, initialKey = '' }) {
  const [key, setKey] = useState(initialKey);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) {
      setError('Veuillez entrer votre clé API');
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Key size={20} className="text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Clé API Pexels</h2>
        </div>

        <p className="text-slate-400 mb-6">
          Obtenez une clé gratuite sur{' '}
          <a
            href="https://www.pexels.com/api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline inline-flex items-center gap-1"
          >
            pexels.com/api <ExternalLink size={12} />
          </a>
        </p>

        <input
          type="password"
          placeholder="Votre clé API Pexels"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setError('');
          }}
          autoFocus
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white mb-2 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <div className="flex gap-3 mt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 rounded-lg transition"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={!key.trim()}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold py-2.5 rounded-lg transition"
          >
            Valider
          </button>
        </div>
      </form>
    </div>
  );
}
