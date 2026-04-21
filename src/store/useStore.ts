import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UniversityScale = 'NSU' | 'EWU' | 'UIU' | 'BRAC';

export type Course = {
  id: string;
  name: string;
  credit: number | string;
  grade: string;
};

export type Semester = {
  id: string;
  name: string; // e.g., "Fall 2023"
  courses: Course[];
};

export type RoutineClass = {
  id: string;
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  courseName: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  teacher?: string;
  room?: string;
  semesterId: string;
};

export type RoutineSemester = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Class' | 'Assignment' | 'Exam' | 'Other';
  completed: boolean;
};

export type PaymentRecord = {
  id: string;
  amount: number;
  date: string;
};

export type TuitionSemesterItem = {
  id: string;
  name: string;
  credits: number | string;
  additionalFees: number | string;
  waiver?: number | string;
  waiverPercentage?: number | string;
  paidAmount: number | string;
  payments?: PaymentRecord[];
};

export type TuitionSettings = {
  totalDegreeCost: number | string;
  totalDegreeCredits: number | string;
  costPerCredit: number | string;
  defaultSemesterFee: number | string;
  totalCredits: number | string;
  additionalFees: number | string;
  paidAmount: number | string;
  tuitionSemesters: TuitionSemesterItem[];
};

export type User = {
  name: string;
  email: string;
};

type AppState = {
  user: User | null;
  darkMode: boolean;
  semesters: Semester[];
  universityScale: UniversityScale;
  routine: RoutineClass[];
  routineSemesters: RoutineSemester[];
  tasks: Task[];
  tuition: TuitionSettings;

  login: (user: User) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  setUniversityScale: (scale: UniversityScale) => void;
  
  // CGPA Methods
  addSemester: (sem: Semester) => void;
  updateSemester: (sem: Semester) => void;
  deleteSemester: (id: string) => void;
  
  // Routine Methods
  addRoutineSemester: (sem: RoutineSemester) => void;
  deleteRoutineSemester: (id: string) => void;
  addClass: (cls: RoutineClass) => void;
  deleteClass: (id: string) => void;

  // Task Methods
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Tuition Methods
  updateTuition: (tuition: Partial<TuitionSettings>) => void;
  addTuitionSemester: (sem: TuitionSemesterItem) => void;
  updateTuitionSemester: (sem: TuitionSemesterItem) => void;
  deleteTuitionSemester: (id: string) => void;
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      darkMode: false,
      semesters: [],
      universityScale: 'NSU',
      routine: [],
      routineSemesters: [],
      tasks: [],
      tuition: {
        totalDegreeCost: 0,
        totalDegreeCredits: 130,
        costPerCredit: 0,
        defaultSemesterFee: 0,
        totalCredits: 0,
        additionalFees: 0,
        paidAmount: 0,
        tuitionSemesters: [],
      },

      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setUniversityScale: (scale) => set({ universityScale: scale }),

      addSemester: (sem) => set((state) => ({ semesters: [...state.semesters, sem] })),
      updateSemester: (sem) => set((state) => ({
        semesters: state.semesters.map((s) => (s.id === sem.id ? sem : s)),
      })),
      deleteSemester: (id) => set((state) => ({
        semesters: state.semesters.filter((s) => s.id !== id),
      })),

      addClass: (cls) => set((state) => ({ routine: [...state.routine, cls] })),
      deleteClass: (id) => set((state) => ({
        routine: state.routine.filter((c) => c.id !== id),
      })),

      addRoutineSemester: (sem) => set((state) => ({ routineSemesters: [...state.routineSemesters, sem] })),
      deleteRoutineSemester: (id) => set((state) => ({
        routineSemesters: state.routineSemesters.filter((s) => s.id !== id),
        routine: state.routine.filter((c) => c.semesterId !== id),
      })),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),

      updateTuition: (t) => set((state) => ({ tuition: { ...state.tuition, ...t } })),
      addTuitionSemester: (sem) => set((state) => ({ 
        tuition: { ...state.tuition, tuitionSemesters: [...(state.tuition.tuitionSemesters || []), sem] } 
      })),
      updateTuitionSemester: (sem) => set((state) => ({ 
        tuition: { 
          ...state.tuition, 
          tuitionSemesters: (state.tuition.tuitionSemesters || []).map(s => s.id === sem.id ? sem : s) 
        } 
      })),
      deleteTuitionSemester: (id) => set((state) => ({ 
        tuition: { 
          ...state.tuition, 
          tuitionSemesters: (state.tuition.tuitionSemesters || []).filter(s => s.id !== id) 
        } 
      })),
    }),
    {
      name: 'unitrack-storage',
    }
  )
);
