
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { User, UserRole, Announcement, LectureNote, StudentReport, Course, AcademicLevel, SeminaryProfile } from './types';
import { Icons, THEME_COLORS } from './constants';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import ImageEditor from './components/ImageEditor';
import VoiceChat from './components/VoiceChat';
import VideoAnalysis from './components/VideoAnalysis';
import MapSearch from './components/MapSearch';
import LoginForm from './components/LoginForm';
import Courses from './components/Courses';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [seminary, setSeminary] = useState<SeminaryProfile>({
    name: "St. Paul's Catholic Seminary",
    motto: "Vas Mihi Electionis",
    address: "Accra, Ghana",
    rector: "Very Rev. Fr. Rector"
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Welcome to the New Semester',
      content: 'We are pleased to welcome all returning and new students to the 2024 academic year.',
      author: 'Rev. Fr. Rector',
      date: '2024-05-20'
    }
  ]);

  const [notes, setNotes] = useState<LectureNote[]>([
    {
      id: 'n1',
      subject: 'Theology',
      title: 'Introduction to Sacraments',
      content: 'The seven sacraments are the visible signs of God’s invisible grace. They are: Baptism, Confirmation, Eucharist, Penance, Anointing of the Sick, Holy Orders, and Matrimony.\n\n"The whole liturgical life of the Church revolves around the Eucharistic sacrifice and the sacraments" (CCC 1113). Each sacrament is an outward sign instituted by Christ to give grace.\n\nIn this lecture, we will focus on the Sacraments of Initiation.',
      date: '2024-05-22'
    },
    {
      id: 'n2',
      subject: 'Philosophy',
      title: 'Aristotelian Ethics',
      content: 'Aristotle defines the good as "that at which all things aim." For humans, this supreme good is Eudaimonia, often translated as happiness or flourishing.\n\nVirtue (Arete) is found in the "Golden Mean" between the two extremes of deficiency and excess. For example, courage is the mean between cowardice and rashness.',
      date: '2024-05-25'
    }
  ]);

  const [courses, setCourses] = useState<Course[]>([
    { id: 'c1', code: 'PHL 101', title: 'Logic I', level: AcademicLevel.YEAR_1, credits: 3, description: 'Basic principles of reasoning.' },
    { id: 'c2', code: 'PHL 102', title: 'Ancient Philosophy', level: AcademicLevel.YEAR_1, credits: 3, description: 'Study of early Greek thinkers.' },
    { id: 'c3', code: 'THL 301', title: 'Christology', level: AcademicLevel.YEAR_3, credits: 4, description: 'Study of the person and work of Christ.' },
    { id: 'c4', code: 'THL 401', title: 'Canon Law I', level: AcademicLevel.YEAR_4, credits: 3, description: 'Introduction to Church legal structures.' },
  ]);

  const [reports, setReports] = useState<StudentReport[]>([
    {
      id: 'r1',
      studentId: 'student-1',
      semester: 'First',
      academicYear: '2023/2024',
      gpa: 3.75,
      publishedDate: '2024-01-15',
      remarks: 'Excellent spiritual and academic growth. Shows deep commitment to communal life.',
      grades: [
        { courseCode: 'PHL 101', courseTitle: 'Logic I', score: 85, grade: 'A' },
        { courseCode: 'PHL 102', courseTitle: 'Ancient Philosophy', score: 78, grade: 'B+' }
      ]
    }
  ]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const updateSeminary = (profile: SeminaryProfile) => {
    setSeminary(profile);
  };

  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const addAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const addReport = (report: StudentReport) => {
    setReports(prev => [report, ...prev]);
  };

  const addNote = (note: LectureNote) => {
    setNotes(prev => [note, ...prev]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
        {user ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen shrink-0 border-r border-slate-800">
              <div className="p-8 border-b border-slate-800 flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 text-3xl font-bold shadow-2xl shadow-blue-900/40 rotate-3 hover:rotate-0 transition-transform duration-300">
                  {seminary.name.charAt(0)}
                </div>
                <h1 className="text-xl font-bold serif text-center line-clamp-2 leading-tight">{seminary.name}</h1>
                <p className="text-[10px] text-blue-400 mt-2 uppercase tracking-[0.2em] font-black text-center px-2 italic">{seminary.motto}</p>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                <Link to="/" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all group">
                  <div className="text-slate-400 group-hover:text-blue-400"><Icons.Book /></div>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/courses" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all group">
                  <div className="text-slate-400 group-hover:text-blue-400"><Icons.AcademicCap /></div>
                  <span className="font-medium">Course Catalog</span>
                </Link>
                <Link to="/reports" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all group">
                  <div className="text-slate-400 group-hover:text-blue-400"><Icons.Clipboard /></div>
                  <span className="font-medium">Exam Reports</span>
                </Link>
                
                {user.role === UserRole.ADMIN && (
                  <>
                    <div className="pt-6 pb-2 text-[10px] font-black text-slate-500 uppercase px-4 tracking-[0.15em]">Institution</div>
                    <Link to="/admin" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all group">
                      <div className="text-slate-400 group-hover:text-amber-400"><Icons.Settings /></div>
                      <span className="font-medium">Management</span>
                    </Link>
                  </>
                )}

                <div className="pt-6 pb-2 text-[10px] font-black text-slate-500 uppercase px-4 tracking-[0.15em]">AI Utilities</div>
                <Link to="/voice" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all group">
                  <div className="text-slate-400 group-hover:text-blue-400"><Icons.Mic /></div>
                  <span className="font-medium">Voice Assist</span>
                </Link>
                <Link to="/image-edit" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all group">
                  <div className="text-slate-400 group-hover:text-blue-400"><Icons.Image /></div>
                  <span className="font-medium">Image Tools</span>
                </Link>
                <Link to="/video-analysis" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all group">
                  <div className="text-slate-400 group-hover:text-blue-400"><Icons.Video /></div>
                  <span className="font-medium">Video Insight</span>
                </Link>
                <Link to="/map" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all group">
                  <div className="text-slate-400 group-hover:text-blue-400"><Icons.Map /></div>
                  <span className="font-medium">Map Services</span>
                </Link>
              </nav>

              <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center space-x-3 mb-5 p-2 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black shadow-lg shadow-blue-900/20">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate leading-none mb-1">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Level: {user.level || 'Staff'}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-red-950/30 text-red-400 border border-red-900/30 hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase tracking-widest active:scale-95"
                >
                  <Icons.LogOut />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard user={user} announcements={announcements} notes={notes} />} />
                  <Route path="/courses" element={<Courses courses={courses} userLevel={user.level} />} />
                  <Route path="/reports" element={<Reports reports={reports.filter(r => r.studentId === user.id)} />} />
                  
                  {user.role === UserRole.ADMIN && (
                    <Route path="/admin" element={
                      <AdminPanel 
                        onAddAnnouncement={addAnnouncement} 
                        announcements={announcements} 
                        seminary={seminary}
                        onUpdateSeminary={updateSeminary}
                        onAddCourse={addCourse}
                        courses={courses}
                        onAddReport={addReport}
                        onAddNote={addNote}
                        notes={notes}
                      />
                    } />
                  )}
                  <Route path="/image-edit" element={<ImageEditor />} />
                  <Route path="/voice" element={<VoiceChat />} />
                  <Route path="/video-analysis" element={<VideoAnalysis />} />
                  <Route path="/map" element={<MapSearch />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </main>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 bg-slate-100 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-slate-100 to-slate-200">
            <LoginForm onLogin={handleLogin} />
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
