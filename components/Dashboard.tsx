
import React, { useState } from 'react';
import { User, Announcement, LectureNote } from '../types';
import { gemini } from '../services/gemini';
import { Icons } from '../constants';

interface DashboardProps {
  user: User;
  announcements: Announcement[];
  notes: LectureNote[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, announcements, notes }) => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<LectureNote | null>(null);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await gemini.fastTextResponse(`As an assistant for St. Paul's Seminary, answer this student query briefly: ${query}`);
      setAiResponse(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold serif text-slate-900">Academic Portal</h2>
          <p className="text-slate-500">Welcome back, {user.name} • {user.level || 'Academic Staff'}</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 border border-blue-100">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>First Semester - 2024</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
            <h3 className="text-xl font-bold serif mb-6 flex items-center gap-2 text-slate-800">
              <Icons.Message /> Institutional Announcements
            </h3>
            <div className="space-y-4">
              {announcements.length > 0 ? announcements.map(ann => (
                <div key={ann.id} className="p-5 rounded-xl bg-slate-50 border-l-4 border-blue-600 transition-all hover:bg-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{ann.title}</h4>
                    <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">{ann.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">{ann.content}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">— {ann.author}</p>
                </div>
              )) : (
                <p className="text-center py-10 text-slate-400 italic">No new announcements today.</p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-xl font-bold serif mb-6 flex items-center gap-2 text-slate-800">
              <Icons.Book /> Distributed Lecture Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {notes.length > 0 ? notes.map(note => (
                <div key={note.id} className="p-5 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-lg transition-all bg-white group flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                      {note.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{note.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">{note.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1 leading-relaxed">{note.content}</p>
                  <button 
                    onClick={() => setSelectedNote(note)}
                    className="text-xs font-bold text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:text-blue-700 hover:border-blue-700 transition-all w-fit uppercase tracking-tighter"
                  >
                    View Lecture Details
                  </button>
                </div>
              )) : (
                <p className="col-span-2 text-center py-10 text-slate-400 italic">No lecture notes have been uploaded yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl overflow-hidden relative border border-slate-800">
            <div className="relative z-10">
              <h3 className="text-lg font-bold serif mb-4 flex items-center gap-2">
                <span className="text-blue-400"><Icons.Brain /></span> Divine Wisdom AI
              </h3>
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mb-4">Gemini Intelligence Layer</p>
              
              <form onSubmit={handleAskAi} className="space-y-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a theological question..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                />
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-900/50"
                >
                  {loading ? 'Consulting Sources...' : 'Request Insight'}
                </button>
              </form>

              {aiResponse && (
                <div className="mt-6 p-4 bg-slate-800 rounded-xl text-sm text-slate-200 border border-slate-700 max-h-60 overflow-y-auto leading-relaxed shadow-inner">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 animate-pulse shrink-0"></div>
                    <p className="font-semibold text-blue-400 text-xs uppercase">Response</p>
                  </div>
                  {aiResponse}
                </div>
              )}
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold serif mb-4 text-slate-800">Academic Navigation</h3>
            <ul className="space-y-3">
              {[
                'Semestral Exam Schedule',
                'Theological Library Catalog',
                'Spiritual Direction Booking',
                'Refectory Weekly Menu',
                'Seminary Health Guidelines'
              ].map((link, idx) => (
                <li key={idx} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all group border border-transparent hover:border-blue-100">
                  <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-800">{link}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Note Reader Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded mb-2 inline-block">
                  {selectedNote.subject}
                </span>
                <h3 className="text-3xl font-bold serif text-slate-900 leading-tight">{selectedNote.title}</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Lecture Date: {selectedNote.date}</p>
              </div>
              <button 
                onClick={() => setSelectedNote(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
                {selectedNote.content}
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button className="px-6 py-2 rounded-xl text-sm font-bold border border-slate-200 hover:bg-white transition-all text-slate-600">Print Note</button>
              <button 
                onClick={() => setSelectedNote(null)}
                className="px-8 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
