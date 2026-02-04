
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum AcademicLevel {
  YEAR_1 = 'Year 1 (Philosophy I)',
  YEAR_2 = 'Year 2 (Philosophy II)',
  YEAR_3 = 'Year 3 (Theology I)',
  YEAR_4 = 'Year 4 (Theology II)'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  level?: AcademicLevel;
  avatar?: string;
}

export interface Announcement {
  id: string;
  author: string;
  content: string;
  date: string;
  title: string;
}

export interface LectureNote {
  id: string;
  subject: string;
  title: string;
  content: string;
  date: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  level: AcademicLevel;
  credits: number;
  description: string;
}

export interface Grade {
  courseCode: string;
  courseTitle: string;
  score: number;
  grade: string;
}

export interface StudentReport {
  id: string;
  studentId: string;
  semester: 'First' | 'Second';
  academicYear: string;
  grades: Grade[];
  gpa: number;
  remarks: string;
  publishedDate: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SeminaryProfile {
  name: string;
  motto: string;
  address: string;
  rector: string;
}
