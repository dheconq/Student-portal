
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/gemini';
import { Icons } from '../constants';

const VoiceChat: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{role: string, text: string}[]>([]);
  const [currentText, setCurrentText] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const session = await gemini.connectVoice({
        onOpen: () => {
          setIsActive(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
            session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onMessage: async (message) => {
          if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
            const base64 = message.serverContent.modelTurn.parts[0].inlineData.data;
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            
            const dataInt16 = new Int16Array(bytes.buffer);
            const ctx = audioContextRef.current!;
            const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
            const channelData = buffer.getChannelData(0);
            for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
          
          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onClose: () => setIsActive(false),
        onError: () => setIsActive(false)
      });
      sessionRef.current = session;
    } catch (err) {
      console.error(err);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center space-y-12 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold serif text-slate-900 mb-2">Seminary Voice Assistant</h2>
        <p className="text-slate-500">Real-time spiritual and academic guidance.</p>
      </div>

      <div className="relative">
        {/* Animated Rings when active */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-blue-400/20 rounded-full animate-ping"></div>
            <div className="absolute w-64 h-64 bg-blue-400/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
        )}

        <button
          onClick={isActive ? stopSession : startSession}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl ${
            isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <div className="text-white transform scale-150">
            {isActive ? <Icons.Mic /> : <Icons.Mic />}
          </div>
        </button>
      </div>

      <div className="text-center">
        <p className={`text-lg font-semibold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
          {isActive ? "Listening and speaking..." : "Tap to start a conversation"}
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Ask about liturgy, ethics, or campus life.
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">Session Info</h3>
        <p className="text-xs text-slate-500 italic">
          "I am here to help you navigate your journey at St. Paul's. Speak naturally as if we are in the library."
        </p>
      </div>
    </div>
  );
};

export default VoiceChat;
