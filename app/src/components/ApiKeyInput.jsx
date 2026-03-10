import { Key } from 'lucide-react';

export default function ApiKeyInput({ apiKey, onChange }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3">
      <Key className="w-4 h-4 text-amber-400 shrink-0" />
      <input
        type="password"
        placeholder="Clé API Pexels (depuis pexels.com/api)"
        value={apiKey}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-sm focus:outline-none"
      />
      {apiKey && (
        <span className="text-green-400 text-xs font-medium">OK</span>
      )}
    </div>
  );
}
