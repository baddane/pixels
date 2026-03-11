import { FileText, Sparkles, RotateCcw, Loader2 } from 'lucide-react';

export default function ArticleInput({ value, onChange, onSubmit, loading, onReset, showReset }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Collez votre article</h2>
      </div>

      <textarea
        className="w-full h-64 bg-slate-800 border border-slate-600 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-y font-mono text-sm leading-relaxed"
        placeholder={"Collez ici l'intégralité de votre article...\n\nL'IA va générer :\n1. Un script audio pour votre vidéo YouTube\n2. Des scènes visuelles avec mots-clés\n3. Des vidéos stock correspondantes depuis Pexels"}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={loading}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Générer le script vidéo
            </>
          )}
        </button>

        {showReset && (
          <button
            onClick={onReset}
            className="px-4 py-2.5 text-slate-400 border border-slate-600 rounded-lg hover:text-white hover:border-slate-400 transition-all text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Recommencer
          </button>
        )}
      </div>
    </div>
  );
}
