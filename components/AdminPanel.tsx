
import React, { useState } from 'react';
import { Announcement, SeminaryProfile, Course, AcademicLevel, StudentReport, LectureNote } from '../types';
// Import Icons from constants to fix the missing name error
import { Icons } from '../constants';

interface AdminPanelProps {
  onAddAnnouncement: (ann: Announcement) => void;
  announcements: Announcement[];
  seminary: SeminaryProfile;
  onUpdateSeminary: (profile: SeminaryProfile) => void;
  onAddCourse: (course: Course) => void;
  courses: Course[];
  onAddReport: (report: StudentReport) => void;
  onAddNote: (note: LectureNote) => void;
  notes: LectureNote[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onAddAnnouncement, 
  announcements, 
  seminary, 
  onUpdateSeminary,
  onAddCourse,
  courses,
  onAddReport,
  onAddNote,
  notes
}) => {
  const [activeTab, setActiveTab] = useState<'seminary' | 'announcements' | 'courses' | 'reports' | 'notes'>('seminary');
  
  // Announcement state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Seminary Profile state
  const [semName, setSemName] = useState(seminary.name);
  const [semMotto, setSemMotto] = useState(seminary.motto);
  const [semAddress, setSemAddress] = useState(seminary.address);
  const [semRector, setSemRector] = useState(seminary.rector);

  // Course state
  const [cCode, setCCode] = useState('');
  const [cTitle, setCTitle] = useState('');
  const [cLevel, setCLevel] = useState(AcademicLevel.YEAR_1);
  const [cCredits, setCCredits] = useState(3);
  const [cDesc, setCDesc] = useState('');

  // Report state
  const [rStudentId, setRStudentId] = useState('student-1');
  const [rGPA, setRGPA] = useState(4.0);
  const [rRemarks, setRRemarks] = useState('');

  // Note state
  const [nSubject, setNSubject] = useState('');
  const [nTitle, setNTitle] = useState('');
  const [nContent, setNContent] = useState('');

  const handleAnnounceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddAnnouncement({
      id: Date.now().toString(),
      title,
      content,
      author: 'Admin',
      date: new Date().toISOString().split('T')[0]
    });
    setTitle(''); setContent('');
  };

  const handleSeminaryUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSeminary({ name: semName, motto: semMotto, address: semAddress, rector: semRector });
    alert('Seminary profile updated successfully!');
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCourse({
      id: Date.now().toString(),
      code: cCode,
      title: cTitle,
      level: cLevel,
      credits: cCredits,
      description: cDesc
    });
    setCCode(''); setCTitle(''); setCDesc('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReport({
      id: Date.now().toString(),
      studentId: rStudentId,
      semester: 'First',
      academicYear: '2023/2024',
      gpa: rGPA,
      remarks: rRemarks,
      publishedDate: new Date().toISOString().split('T')[0],
      grades: []
    });
    alert(`Report for ${rStudentId} created.`);
    setRRemarks('');
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNote({
      id: Date.now().toString(),
      subject: nSubject,
      title: nTitle,
      content: nContent,
      date: new Date().toISOString().split('T')[0]
    });
    setNSubject(''); setNTitle(''); setNContent('');
    alert('Lecture note published successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold serif text-slate-900">Institutional Management</h2>
        <p className="text-slate-500">Administrator access for St. Paul's Catholic Seminary.</p>
      </header>

      <div className="flex space-x-1 bg-slate-200 p-1 rounded-2xl w-fit overflow-x-auto max-w-full">
        {[
          { id: 'seminary', label: 'Seminary Info' },
          { id: 'announcements', label: 'Announcements' },
          { id: 'courses', label: 'Courses' },
          { id: 'reports', label: 'Reports' },
          { id: 'notes', label: 'Lecture Notes' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-300/50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'seminary' && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold serif mb-6">Institution Configuration</h3>
              <form onSubmit={handleSeminaryUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Seminary Official Name</label>
                  <input type="text" value={semName} onChange={e => setSemName(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Motto (Latin preferred)</label>
                  <input type="text" value={semMotto} onChange={e => setSemMotto(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Physical Address</label>
                  <input type="text" value={semAddress} onChange={e => setSemAddress(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Rector / Principal Name</label>
                  <input type="text" value={semRector} onChange={e => setSemRector(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <button type="submit" className="col-span-2 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95 mt-4">
                  Update Seminary Identity
                </button>
              </form>
            </section>
          )}

          {activeTab === 'announcements' && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold serif mb-6">Broadcast New Message</h3>
              <form onSubmit={handleAnnounceSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Announcement Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Semestral Exams Schedule..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Message Details</label>
                  <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Provide clear instructions for students..." />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                  Publish to Student Dashboards
                </button>
              </form>
            </section>
          )}

          {activeTab === 'courses' && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold serif mb-6">Academic Course Setup</h3>
              <form onSubmit={handleCourseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Course Code</label>
                  <input type="text" value={cCode} onChange={e => setCCode(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="THL 101" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Title</label>
                  <input type="text" value={cTitle} onChange={e => setCTitle(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Fundamental Theology" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Target Academic Level</label>
                  <select value={cLevel} onChange={e => setCLevel(e.target.value as any)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {Object.values(AcademicLevel).map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Credit Hours</label>
                  <input type="number" value={cCredits} onChange={e => setCCredits(parseInt(e.target.value))} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Catalog Description</label>
                  <textarea value={cDesc} onChange={e => setCDesc(e.target.value)} rows={3} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Briefly describe the course scope..." />
                </div>
                <button type="submit" className="col-span-2 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95 mt-2">
                  Finalize Course Offering
                </button>
              </form>
            </section>
          )}

          {activeTab === 'reports' && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold serif mb-6">Issue Student Exam Report</h3>
              <form onSubmit={handleReportSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Student Unique Identifier</label>
                  <input type="text" value={rStudentId} onChange={e => setRStudentId(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Cumulative GPA for Term</label>
                  <input type="number" step="0.01" value={rGPA} onChange={e => setRGPA(parseFloat(e.target.value))} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Dean's Official Remarks</label>
                  <textarea value={rRemarks} onChange={e => setRRemarks(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" rows={4} placeholder="Summarize academic and spiritual performance..." />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                  Publish Official Report
                </button>
              </form>
            </section>
          )}

          {activeTab === 'notes' && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold serif mb-6">Distribute Lecture Material</h3>
              <form onSubmit={handleNoteSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Subject Area</label>
                    <input type="text" value={nSubject} onChange={e => setNSubject(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="E.g., Moral Theology" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Lecture Title</label>
                    <input type="text" value={nTitle} onChange={e => setNTitle(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="The Principle of Double Effect" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Lecture Content</label>
                  <textarea value={nContent} onChange={e => setNContent(e.target.value)} rows={10} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" placeholder="Paste or type lecture notes here..." />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                  Upload & Notify Students
                </button>
              </form>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Institutional Status</h3>
            <div className="space-y-4">
              {[
                { label: 'Active Courses', val: courses.length, color: 'blue' },
                { label: 'Enrolled Seminarians', val: 142, color: 'amber' },
                { label: 'Recent Announcements', val: announcements.length, color: 'slate' },
                { label: 'Lecture Materials', val: notes.length, color: 'blue' }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <span className="text-sm font-semibold text-slate-500">{stat.label}</span>
                  <span className={`font-black text-lg text-${stat.color}-600`}>{stat.val}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-amber-50 p-8 rounded-3xl border border-amber-100 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-amber-900 font-bold mb-3 flex items-center gap-2">
                <Icons.Brain /> Administrator Ethics
              </h3>
              <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                You are managing the digital presence of St. Paul's. Every update, report, and lecture note shared here contributes to the spiritual and intellectual formation of future priests.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl -mr-12 -mt-12"></div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
