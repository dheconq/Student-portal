
import React, { useState } from 'react';
import { Course, AcademicLevel } from '../types';

interface CoursesProps {
  courses: Course[];
  userLevel?: AcademicLevel;
}

const Courses: React.FC<CoursesProps> = ({ courses, userLevel }) => {
  const [filter, setFilter] = useState<AcademicLevel | 'All'>(userLevel || 'All');

  const levels = Object.values(AcademicLevel);
  const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.level === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold serif text-slate-900">Course Catalog</h2>
          <p className="text-slate-500">View academic offerings and course details.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">Filter:</span>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="p-2 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="All">All Levels</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                {course.code}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {course.credits} Credits
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">{course.title}</h3>
            <p className="text-xs text-blue-600 font-semibold mb-3">{course.level}</p>
            <p className="text-sm text-slate-600 mb-6 flex-1">{course.description}</p>
            <button className="w-full py-2.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              VIEW SYLLABUS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
