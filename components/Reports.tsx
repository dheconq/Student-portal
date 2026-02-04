
import React from 'react';
import { StudentReport } from '../types';

interface ReportsProps {
  reports: StudentReport[];
}

const Reports: React.FC<ReportsProps> = ({ reports }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold serif text-slate-900">Semestral Exam Reports</h2>
        <p className="text-slate-500">Official academic results and performance breakdown.</p>
      </header>

      {reports.length > 0 ? (
        <div className="space-y-8">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 text-white p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold serif">{report.semester} Semester • {report.academicYear}</h3>
                  <div className="bg-blue-600 px-4 py-1 rounded-full font-bold">GPA: {report.gpa.toFixed(2)}</div>
                </div>
                <p className="text-xs text-slate-400">Published on {report.publishedDate}</p>
              </div>
              
              <div className="p-0">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <th className="px-6 py-4">Course Code</th>
                      <th className="px-6 py-4">Course Title</th>
                      <th className="px-6 py-4 text-center">Score</th>
                      <th className="px-6 py-4 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.grades.map((grade, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono font-bold text-blue-700">{grade.courseCode}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{grade.courseTitle}</td>
                        <td className="px-6 py-4 text-sm text-center text-slate-600">{grade.score}</td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">{grade.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Lecturer's Remarks</h4>
                <p className="text-sm text-slate-700 italic">"{report.remarks}"</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-20 text-center">
          <p className="text-slate-400 serif text-lg italic">No reports have been published for your profile yet.</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
