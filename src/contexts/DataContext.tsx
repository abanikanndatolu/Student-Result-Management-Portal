import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: number;
  instructor: string;
}

export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  semester: string;
  grade: string;
  score: number;
  gpa: number;
}

export interface Registration {
  id: string;
  studentId: string;
  courseId: string;
  semester: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
}

interface DataContextType {
  courses: Course[];
  results: Result[];
  registrations: Registration[];
  announcements: Announcement[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addResult: (result: Omit<Result, 'id'>) => void;
  updateResult: (id: string, result: Partial<Result>) => void;
  addRegistration: (registration: Omit<Registration, 'id'>) => void;
  updateRegistration: (id: string, status: Registration['status']) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const initialCourses: Course[] = [
  {
    id: '1',
    code: 'CS101',
    name: 'Introduction to Programming',
    department: 'Computer Science',
    credits: 3,
    semester: 1,
    instructor: 'Dr. Smith',
  },
  {
    id: '2',
    code: 'CS201',
    name: 'Data Structures',
    department: 'Computer Science',
    credits: 4,
    semester: 3,
    instructor: 'Dr. Johnson',
  },
  {
    id: '3',
    code: 'MATH101',
    name: 'Calculus I',
    department: 'Mathematics',
    credits: 3,
    semester: 1,
    instructor: 'Dr. Williams',
  },
  {
    id: '4',
    code: 'ENG101',
    name: 'Thermodynamics',
    department: 'Engineering',
    credits: 4,
    semester: 4,
    instructor: 'Dr. Brown',
  },
];

const initialResults: Result[] = [
  {
    id: '1',
    studentId: 'STU2024001',
    courseId: '1',
    semester: 'Fall 2024',
    grade: 'A',
    score: 95,
    gpa: 4.0,
  },
  {
    id: '2',
    studentId: 'STU2024001',
    courseId: '2',
    semester: 'Fall 2024',
    grade: 'B+',
    score: 87,
    gpa: 3.5,
  },
  {
    id: '3',
    studentId: 'STU2024002',
    courseId: '3',
    semester: 'Fall 2024',
    grade: 'A-',
    score: 90,
    gpa: 3.7,
  },
];

const initialRegistrations: Registration[] = [
  {
    id: '1',
    studentId: 'STU2024001',
    courseId: '1',
    semester: 'Spring 2025',
    status: 'approved',
  },
  {
    id: '2',
    studentId: 'STU2024002',
    courseId: '4',
    semester: 'Spring 2025',
    status: 'pending',
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Course Registration Open',
    content: 'Course registration for Spring 2025 semester is now open. Please register before the deadline.',
    date: '2025-01-15',
    author: 'Academic Office',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Exam Schedule Released',
    content: 'The examination schedule for Fall 2024 has been published. Check your portal for details.',
    date: '2025-01-10',
    author: 'Examination Department',
    priority: 'medium',
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [results, setResults] = useState<Result[]>(initialResults);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = { ...course, id: Date.now().toString() };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updatedCourse } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const addResult = (result: Omit<Result, 'id'>) => {
    const newResult = { ...result, id: Date.now().toString() };
    setResults([...results, newResult]);
  };

  const updateResult = (id: string, updatedResult: Partial<Result>) => {
    setResults(results.map(r => r.id === id ? { ...r, ...updatedResult } : r));
  };

  const addRegistration = (registration: Omit<Registration, 'id'>) => {
    const newRegistration = { ...registration, id: Date.now().toString() };
    setRegistrations([...registrations, newRegistration]);
  };

  const updateRegistration = (id: string, status: Registration['status']) => {
    setRegistrations(registrations.map(r => r.id === id ? { ...r, status } : r));
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement = { ...announcement, id: Date.now().toString() };
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        results,
        registrations,
        announcements,
        addCourse,
        updateCourse,
        deleteCourse,
        addResult,
        updateResult,
        addRegistration,
        updateRegistration,
        addAnnouncement,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
