import React, { useState, useRef } from 'react';
import { Film, Upload, Play, Download, Search, Zap, CheckCircle, AlertCircle, X } from 'lucide-react';

const VideoScriptApp = () => {
  const [scriptText, setScriptText] = useState('');
  const [scenes, setScenes] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [videos, setVideos] = useState({});
  const [pexelsApiKey, setPexelsApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(!pexelsApiKey);
  const fileInputRef = useRef(null);

  const parseScenes = (text) => {
    const scenePattern = /(?:SCENE|SCÈNE)\s*(\d+)[:\s]+(.*?)(?=(?:SCENE|SCÈNE)\s*\d+|$)/gis;
    const matches = [...text.matchAll(scenePattern)];
    
    if (matches.length > 0) {
      return matches.map((match, idx) => ({
        id: idx,
        number: match[1],
        content: match[2].trim(),
        keywords: [],
        status: 'pending'
      }));
    }

    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    return paragraphs.slice(0, 10).map((content, idx) => ({
      id: idx,
      number: idx + 1,
      content: content.substring(0, 200),
      keywords: [],
      status: 'pending'
    }));
  };

  const extractKeywords = async (text) => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `Extrait 3-5 mots-clés pertinents (séparés par des virgules) pour rechercher des vidéos stock de cette scène. Sois concis et spécifique:\n\n${text}`
          }]
        })
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        return data.content[0].text
          .split(',')
          .map(k => k.trim())
          .filter(k => k.length > 0)
          .slice(0, 5);
      }
    } catch (error) {
      console.error('Erreur extraction keywords:', error);
    }
    return [];
  };

  const searchPexelsVideos = async (keywords) => {
    if (!pexelsApiKey) return [];
    
    try {
      const query = keywords.join(' ');
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5`,
        {
          headers: { 'Authorization': pexelsApiKey }
        }
      );

      const data = await response.json();
      return data.videos || [];
    } catch (error) {
      console.error('Erreur Pexels:', error);
    }
    return [];
  };

  const downloadVideo = async (videoData, sceneId) => {
    try {
      const videoUrl = videoData.video_files[0]?.link;
      if (!videoUrl) throw new Error('Lien vidéo non trouvé');

      const filename = `scene_${sceneId}_${videoData.id}.mp4`;
      
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return { success: true, filename };
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      return { success: false, error: error.message };
    }
  };

  const processScript = async () => {
    if (!scriptText.trim()) return;
    
    setProcessing(true);
    const parsedScenes = parseScenes(scriptText);
    setScenes(parsedScenes);

    const allVideos = {};

    for (let i = 0; i < parsedScenes.length; i++) {
      const scene = parsedScenes[i];
      
      setScenes(prev => prev.map(s => 
        s.id === scene.id ? { ...s, status: 'extracting' } : s
      ));

      const keywords = await extractKeywords(scene.content);
      
      setScenes(prev => prev.map(s => 
        s.id === scene.id ? { ...s, keywords, status: 'searching' } : s
      ));

      const foundVideos = await searchPexelsVideos(keywords);
      allVideos[scene.id] = foundVideos;

      setScenes(prev => prev.map(s => 
        s.id === scene.id ? { ...s, status: 'ready' } : s
      ));
    }

    setVideos(allVideos);
    setProcessing(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScriptText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-gray-100 text-gray-600',
      'extracting': 'bg-blue-100 text-blue-600',
      'searching': 'bg-amber-100 text-amber-600',
      'ready': 'bg-green-100 text-green-600'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    if (status === 'ready') return <CheckCircle size={16} />;
    if (status === 'searching' || status === 'extracting') return <Zap size={16} className="animate-spin" />;
    return <AlertCircle size={16} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Modal API Key */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Clé API Pexels requise</h2>
            <p className="text-slate-400 mb-6">Obtenez une clé gratuite sur <a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">pexels.com/api</a></p>
            <input
              type="password"
              placeholder="Votre clé API Pexels"
              value={pexelsApiKey}
              onChange={(e) => setPexelsApiKey(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white mb-4 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => setShowApiModal(false)}
              disabled={!pexelsApiKey}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-slate-900 font-bold py-2 rounded-lg transition"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
              <Film size={28} />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              VideoMaker Script
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Convertissez votre script en vidéos stock en 5 étapes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Upload size={20} className="text-cyan-400" />
                Script
              </h2>
              
              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Collez votre script ici ou utilisez un fichier..."
                className="w-full h-40 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg py-2 px-3 font-medium transition flex items-center justify-center gap-2"
                >
                  <Upload size={16} />
                  Fichier
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={processScript}
                  disabled={!scriptText.trim() || processing}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 rounded-lg py-2 px-3 font-bold transition flex items-center justify-center gap-2"
                >
                  <Zap size={16} />
                  {processing ? 'Traitement...' : 'Analyser'}
                </button>
              </div>
            </div>

            {/* API Status */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
              <button
                onClick={() => setShowApiModal(true)}
                className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Clé API Pexels</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${pexelsApiKey ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {pexelsApiKey ? '✓ Configurée' : '✗ Manquante'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Search size={20} className="text-cyan-400" />
                Scènes détectées ({scenes.length})
              </h2>

              {scenes.length === 0 ? (
                <div className="text-center py-12">
                  <Play size={48} className="mx-auto text-slate-600 mb-4 opacity-50" />
                  <p className="text-slate-400">Importez un script pour commencer</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {scenes.map((scene) => (
                    <div key={scene.id} className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 space-y-3">
                      {/* Scene Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-white">Scène {scene.number}</h3>
                          <p className="text-slate-400 text-sm line-clamp-2">{scene.content}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(scene.status)}`}>
                          {getStatusIcon(scene.status)}
                          {scene.status === 'pending' && 'En attente'}
                          {scene.status === 'extracting' && 'Extraction'}
                          {scene.status === 'searching' && 'Recherche'}
                          {scene.status === 'ready' && 'Prêt'}
                        </div>
                      </div>

                      {/* Keywords */}
                      {scene.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {scene.keywords.map((keyword, idx) => (
                            <span key={idx} className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Videos */}
                      {videos[scene.id] && videos[scene.id].length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">Vidéos trouvées</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {videos[scene.id].map((video) => (
                              <div key={video.id} className="bg-slate-600/50 rounded-lg p-2 flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-white truncate">
                                    {video.photographer}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {video.duration}s • {Math.round(video.video_files[0]?.width || 0)}p
                                  </p>
                                </div>
                                <button
                                  onClick={() => downloadVideo(video, scene.id)}
                                  className="ml-2 p-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 rounded-lg transition"
                                  title="Télécharger"
                                >
                                  <Download size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { num: '1', label: 'Import Script', icon: '📝' },
            { num: '2', label: 'Extraction Keywords', icon: '🎯' },
            { num: '3', label: 'API Pexels', icon: '🔍' },
            { num: '4', label: 'Récupération Videos', icon: '📥' },
            { num: '5', label: 'Téléchargement', icon: '⬇️' },
          ].map((step) => (
            <div key={step.num} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{step.icon}</div>
              <p className="font-bold text-white text-sm">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoScriptApp;
