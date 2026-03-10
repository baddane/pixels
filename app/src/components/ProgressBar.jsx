export default function ProgressBar({ scenes }) {
  if (scenes.length === 0) return null;

  const completed = scenes.filter(s => s.status === 'ready' || s.status === 'error').length;
  const progress = Math.round((completed / scenes.length) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          Progression : {completed}/{scenes.length} scènes
        </span>
        <span className="text-cyan-400 font-semibold">{progress}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
