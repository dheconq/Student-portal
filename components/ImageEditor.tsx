
import React, { useState, useRef } from 'react';
import { gemini } from '../services/gemini';
import { Icons } from '../constants';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(base64);
        setResult(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    try {
      const editedImageUrl = await gemini.editImage(image, prompt, mimeType);
      if (editedImageUrl) {
        setResult(editedImageUrl);
        // Update current working image to allow sequential edits
        setImage(editedImageUrl.split(',')[1]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h2 className="text-3xl font-bold serif text-slate-900">Seminary Image Studio</h2>
        <p className="text-slate-500">Prepare liturgical photos or educational materials with AI.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div 
            className="aspect-square bg-slate-200 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {result ? (
              <img src={result} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6">
                <div className="mx-auto w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center mb-2">
                  <Icons.Image />
                </div>
                <p className="text-sm font-semibold text-slate-500">Click to upload photo</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Icons.Image /> Replace Image
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-4">AI Edit Controls</h3>
            <p className="text-sm text-slate-500 mb-4">
              Describe the changes you want. Example: "Add a warm vintage glow", "Remove the people in the background", or "Make the sky look like a dramatic sunset".
            </p>
            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like to do?"
                className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
              <button
                disabled={loading || !image}
                onClick={handleEdit}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>Apply AI Transformation</>
                )}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <h4 className="text-amber-800 font-bold text-sm mb-1 flex items-center gap-2">
              <Icons.Brain /> Pro Tip
            </h4>
            <p className="text-xs text-amber-700">
              Use specific instructions like "Colorize this old black and white photo" or "Convert this to a realistic pencil sketch" for best results with Gemini Nano Banana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
