import { FileText } from 'lucide-react';

const EXAMPLE_SCRIPT = `SCENE 1: Une métropole au lever du soleil. Time-lapse des premiers rayons illuminant les buildings modernes.

SCENE 2: Un jeune homme marche dans une rue animée, café à la main, observant l'énergie de la ville qui se réveille.

SCENE 3: Gros plan sur des mains tapant sur un clavier de laptop dans un café moderne, avec une tasse de café fumante à côté.

SCENE 4: Vue aérienne d'une forêt dense au coucher du soleil, les arbres dorés par la lumière.

SCENE 5: Une femme contemple l'océan depuis un balcon au crépuscule, le vent dans les cheveux.`;

export default function ScriptInput({ value, onChange, onSubmit, loading }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Script vidéo</h2>
      </div>

      <textarea
        className="w-full h-64 bg-slate-800 border border-slate-600 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-y font-mono text-sm leading-relaxed"
        placeholder={"Collez votre script vidéo ici...\n\nUtilisez le format :\nSCENE 1: Description de la scène...\nSCENE 2: Description de la scène...\n\nOu simplement des paragraphes séparés par des lignes vides."}
        value={value}
        onChange={e => onChange(e.target.value)}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Recherche en cours...' : 'Rechercher les vidéos'}
        </button>

        <button
          onClick={() => onChange(EXAMPLE_SCRIPT)}
          className="px-4 py-2.5 text-slate-400 border border-slate-600 rounded-lg hover:text-white hover:border-slate-400 transition-all text-sm"
        >
          Charger un exemple
        </button>
      </div>
    </div>
  );
}
