
import React, { useState, useRef } from 'react';
import { gemini } from '../services/gemini';
import { Icons } from '../constants';

const VideoAnalysis: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoBase64, setVideoBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Analyze this lecture video and provide a summary of the main points discussed.');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setVideoBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (useThinking = false) => {
    if (!videoBase64 || !videoFile) return;
    setLoading(true);
    setIsThinking(useThinking);
    try {
      let result;
      if (useThinking) {
        // Thinking mode is for complex reasoning, but usually applied to text queries.
        // For video, we'll use the standard Pro analysis first then maybe think about it.
        result = await gemini.analyzeVideo(videoBase64, prompt, videoFile.type);
        const thoughtProcess = await gemini.thinkComplex(`Analyze this summary of a lecture and provide deep pedagogical reflections on its theological implications: ${result}`);
        setAnalysis(`${result}\n\n---\nTHEOLOGICAL REFLECTIONS (Thinking Mode):\n${thoughtProcess}`);
      } else {
        result = await gemini.analyzeVideo(videoBase64, prompt, videoFile.type);
        setAnalysis(result);
      }
    } catch (err) {
      console.error(err);
      setAnalysis("Error analyzing video. Please check the file size and format.");
    } finally {
      setLoading(false);
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold serif text-slate-900">Lecture Video Insights</h2>
        <p className="text-slate-500">Upload recorded lectures for AI-powered summarization and theological depth.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div 
            className="aspect-video bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {videoFile ? (
              <video 
                src={URL.createObjectURL(videoFile)} 
                className="w-full h-full object-cover" 
                controls
              />
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400 group-hover:scale-110 transition-transform">
                  <Icons.Video />
                </div>
                <p className="text-slate-600 font-semibold">Select Lecture Video</p>
                <p className="text-xs text-slate-400 mt-1">MP4, WEBM (Max 20MB recommended)</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="video/*" 
              onChange={handleVideoUpload} 
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold">Analysis Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What should the AI focus on in the video?"
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={loading || !videoBase64}
                onClick={() => handleAnalyze(false)}
                className="bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-900 transition-all disabled:opacity-50"
              >
                Fast Analysis
              </button>
              <button
                disabled={loading || !videoBase64}
                onClick={() => handleAnalyze(true)}
                className="bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Icons.Brain /> Thinking Mode
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Results</h3>
            {loading && (
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                {isThinking ? 'Thinking deeply...' : 'Analyzing...'}
              </div>
            )}
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-[600px] whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
            {analysis || (
              <div className="text-slate-400 italic text-center py-20">
                Analysis results will appear here after processing.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysis;
