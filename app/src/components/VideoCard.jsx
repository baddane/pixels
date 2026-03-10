import { Download, Play, ExternalLink, User } from 'lucide-react';

export default function VideoCard({ video, onDownload }) {
  const bestFile = video.video_files
    ?.slice()
    .sort((a, b) => (b.width || 0) - (a.width || 0))
    .find(f => f.width >= 1080 && f.width <= 1920)
    || video.video_files?.[0];

  const resolution = bestFile ? `${bestFile.width}x${bestFile.height}` : 'N/A';

  return (
    <div className="bg-slate-600/30 border border-slate-600/50 rounded-lg overflow-hidden group hover:border-cyan-500/30 transition">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-700">
        {video.image ? (
          <img
            src={video.image}
            alt={`Video by ${video.user?.name || video.photographer || 'Unknown'}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={32} className="text-slate-500" />
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration}s
        </div>

        {/* Play overlay on hover */}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <Play size={36} className="text-white drop-shadow-lg" fill="white" />
        </a>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <User size={12} />
          <span className="truncate">{video.user?.name || video.photographer || 'Pexels'}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{resolution}</span>
          <span>{video.duration}s</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onDownload}
            className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-xs font-medium py-1.5 rounded-md transition"
          >
            <Download size={13} />
            Télécharger
          </button>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 bg-slate-600/50 hover:bg-slate-600 text-slate-400 text-xs py-1.5 px-2 rounded-md transition"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
