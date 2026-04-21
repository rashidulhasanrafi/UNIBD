import { Semester, Course } from "../store/useStore";

export type UniversityScale = 'NSU' | 'EWU' | 'UIU' | 'BRAC';

export const GRADING_SCALES: Record<UniversityScale, Record<string, number>> = {
  NSU: {
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "F": 0.0,
  },
  EWU: {
    "A+": 4.0,
    "A": 3.75,
    "A-": 3.5,
    "B+": 3.25,
    "B": 3.0,
    "B-": 2.75,
    "C+": 2.5,
    "C": 2.25,
    "D+": 2.0,
    "D": 1.75,
    "F": 0.0,
  },
  UIU: {
    "A": 4.0,
    "A-": 3.67,
    "B+": 3.33,
    "B": 3.0,
    "B-": 2.67,
    "C+": 2.33,
    "C": 2.0,
    "C-": 1.67,
    "D+": 1.33,
    "D": 1.0,
    "F": 0.0,
  },
  BRAC: {
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "F": 0.0,
  }
};

export function calculateGPA(courses: Course[], scaleId: UniversityScale = 'NSU'): { gpa: number; credits: number } {
  let totalCredits = 0;
  let totalPoints = 0;
  const gradePointMap = GRADING_SCALES[scaleId] || GRADING_SCALES.NSU;

  courses.forEach(course => {
    const point = gradePointMap[course.grade] || 0;
    const creditNum = Number(course.credit) || 0;
    totalCredits += creditNum;
    totalPoints += point * creditNum;
  });

  if (totalCredits === 0) return { gpa: 0, credits: 0 };
  return { 
    gpa: Number((totalPoints / totalCredits).toFixed(2)), 
    credits: totalCredits 
  };
}

export function calculateCGPA(semesters: Semester[], scaleId: UniversityScale = 'NSU'): { cgpa: number; totalCredits: number } {
  let allCourses: Course[] = [];
  semesters.forEach(sem => {
    allCourses = allCourses.concat(sem.courses);
  });
  const res = calculateGPA(allCourses, scaleId);
  return { cgpa: res.gpa, totalCredits: res.credits };
}
