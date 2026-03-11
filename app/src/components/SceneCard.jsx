import { useState, useRef } from 'react';
import { Search, Play, ExternalLink, Download, ChevronDown, ChevronUp, Loader2, AlertCircle, Tag, Sparkles, Film, Copy, Check } from 'lucide-react';
import { getBestVideoFile } from '../lib/pexels-api';

function SourceBadge({ source }) {
  if (source === 'runway') {
    return (
      <div className="absolute top-1 left-1 flex items-center gap-1 bg-purple-600/80 text-white text-xs px-1.5 py-0.5 rounded">
        <Sparkles className="w-3 h-3" /> IA
      </div>
    );
  }
  return (
    <div className="absolute top-1 left-1 flex items-center gap-1 bg-cyan-600/80 text-white text-xs px-1.5 py-0.5 rounded">
      <Film className="w-3 h-3" /> Stock
    </div>
  );
}

function VideoThumbnail({ video, onSelect, showSource }) {
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const bestFile = getBestVideoFile(video);
  const isRunway = video.source === 'runway';

  return (
    <div
      className="relative group cursor-pointer rounded-lg overflow-hidden bg-slate-800"
      onMouseEnter={() => {
        setHovering(true);
        videoRef.current?.play();
      }}
      onMouseLeave={() => {
        setHovering(false);
        videoRef.current?.pause();
      }}
      onClick={() => onSelect(video)}
    >
      {hovering && bestFile ? (
        <video
          ref={videoRef}
          src={bestFile.link}
          muted
          loop
          playsInline
          className="w-full h-36 object-cover"
        />
      ) : isRunway && bestFile ? (
        <video
          src={bestFile.link}
          muted
          playsInline
          className="w-full h-36 object-cover"
        />
      ) : video.image ? (
        <img
          src={video.image}
          alt={`Video ${video.id}`}
          className="w-full h-36 object-cover"
        />
      ) : (
        <div className="w-full h-36 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-slate-800">
          <Sparkles className="w-8 h-8 text-purple-400" />
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
        <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
      </div>

      {showSource && <SourceBadge source={video.source} />}

      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
        {video.duration}s
      </div>
    </div>
  );
}

function VideoDetail({ video, onClose }) {
  const bestFile = getBestVideoFile(video);

  return (
    <div className="bg-slate-800 rounded-lg p-4 space-y-3 border border-slate-600">
      <video
        src={bestFile?.link}
        controls
        className="w-full rounded-lg max-h-80 bg-black"
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          {video.width}x{video.height} &middot; {video.duration}s
          {video.user?.name && (
            <span> &middot; par <span className="text-cyan-400">{video.user.name}</span></span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Voir sur Pexels"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          {bestFile && (
            <a
              href={bestFile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
              title="Télécharger"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-white ml-2"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-slate-600/50 transition-colors text-slate-500 hover:text-slate-300"
      title="Copier"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function SceneCard({ scene }) {
  const [expanded, setExpanded] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const statusIcon = {
    pending: null,
    searching: <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />,
    ready: <Search className="w-4 h-4 text-green-400" />,
    error: <AlertCircle className="w-4 h-4 text-red-400" />,
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="bg-cyan-500/20 text-cyan-400 text-sm font-bold px-2.5 py-1 rounded-md">
            #{scene.number}
          </span>
          {statusIcon[scene.status]}
          <p className="text-slate-200 text-sm text-left line-clamp-1">
            {scene.content}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        )}
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Narration */}
          {scene.narration && (
            <div className="bg-slate-800/80 rounded-lg p-3 border-l-2 border-cyan-500/50">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-cyan-400">Narration</p>
                <CopyButton text={scene.narration} />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{scene.narration}</p>
            </div>
          )}

          {/* Visual description */}
          <div className="flex items-start gap-2">
            <p className="text-slate-400 text-sm leading-relaxed flex-1">{scene.content}</p>
            <CopyButton text={scene.content} />
          </div>

          {/* Keywords */}
          {scene.keywords.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {scene.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-700 text-cyan-300 px-2 py-0.5 rounded-full"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Error */}
          {scene.error && (
            <p className="text-red-400 text-sm">{scene.error}</p>
          )}

          {/* Loading */}
          {scene.status === 'searching' && (
            <div className="flex items-center gap-2 text-cyan-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Recherche de vidéos...
            </div>
          )}

          {/* Selected video detail */}
          {selectedVideo && (
            <VideoDetail video={selectedVideo} onClose={() => setSelectedVideo(null)} />
          )}

          {/* Video grid */}
          {scene.videos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {scene.videos.map(video => (
                <VideoThumbnail
                  key={video.id}
                  video={video}
                  onSelect={setSelectedVideo}
                  showSource={scene.videos.some(v => v.source === 'runway') && scene.videos.some(v => v.source === 'pexels')}
                />
              ))}
            </div>
          )}

          {scene.status === 'ready' && scene.videos.length === 0 && (
            <p className="text-slate-500 text-sm italic">Aucune vidéo trouvée pour cette scène.</p>
          )}
        </div>
      )}
    </div>
  );
}
