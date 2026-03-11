import { useState } from 'react';
import { Headphones, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function PodcastScript({ dialogue }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullText = dialogue
    .map(line => `${line.speaker} : ${line.text}`)
    .join('\n\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
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
          <Headphones className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Version Podcast</h2>
          <span className="text-xs text-slate-500">{dialogue.length} répliques</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); handleCopy(); }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Copier le podcast"
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
          <div className="bg-slate-900/50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
            {dialogue.map((line, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 h-fit ${
                    line.speaker === 'Alex'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {line.speaker}
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">{line.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
