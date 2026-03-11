import { useState } from 'react';
import { Mic, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function GeneratedScript({ script }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      <button
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Script audio généré</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); handleCopy(); }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Copier le script"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          <div className="bg-slate-900/50 rounded-lg p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {script}
          </div>
        </div>
      )}
    </div>
  );
}
