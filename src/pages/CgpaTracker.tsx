import { useState } from "react";
import { useStore, Semester, Course, UniversityScale } from "@/src/store/useStore";
import { calculateGPA, calculateCGPA, GRADING_SCALES } from "@/src/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { Plus, Trash2, GraduationCap, School } from "lucide-react";

export function CgpaTracker() {
  const { semesters, universityScale, setUniversityScale, addSemester, updateSemester, deleteSemester } = useStore();
  const [newSemName, setNewSemName] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; onConfirm: () => void; message: string }>({
    isOpen: false,
    onConfirm: () => {},
    message: ""
  });
  
  const { cgpa, totalCredits } = calculateCGPA(semesters, universityScale);

  const availableGrades = Object.keys(GRADING_SCALES[universityScale]);

  const handleAddSemester = () => {
    const defaultName = `SEMESTER ${semesters.length + 1}`;
    const name = newSemName.trim() ? newSemName.toUpperCase() : defaultName;
    addSemester({
      id: crypto.randomUUID(),
      name,
      courses: []
    });
    setNewSemName("");
  };

  const handleAddCourse = (semesterId: string) => {
    const sem = semesters.find(s => s.id === semesterId);
    if (sem) {
      updateSemester({
        ...sem,
        courses: [...sem.courses, { id: crypto.randomUUID(), name: "New Course", credit: 3, grade: availableGrades[0] }]
      });
    }
  };

  const handleUpdateCourse = (semesterId: string, courseId: string, field: keyof Course, value: string | number) => {
    const sem = semesters.find(s => s.id === semesterId);
    if (sem) {
      updateSemester({
        ...sem,
        courses: sem.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c)
      });
    }
  };

  const handleDeleteCourse = (semesterId: string, courseId: string) => {
    setDeleteModal({
      isOpen: true,
      message: "Are you sure you want to delete this course?",
      onConfirm: () => {
        const sem = semesters.find(s => s.id === semesterId);
        if (sem) {
          updateSemester({
            ...sem,
            courses: sem.courses.filter(c => c.id !== courseId)
          });
        }
      }
    });
  };

  const handleDeleteSemester = (semesterId: string) => {
    setDeleteModal({
      isOpen: true,
      message: "Are you sure you want to delete this entire semester?",
      onConfirm: () => {
        deleteSemester(semesterId);
      }
    });
  };

  return (
    <div className="space-y-8">
      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))} 
        onConfirm={deleteModal.onConfirm}
        message={deleteModal.message}
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">CGPA Tracker</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 italic">"Your academic journey, tracked with precision."</p>
          
          <div className="mt-6 flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-sm">
            <School className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">University Scale</label>
              <select 
                value={universityScale} 
                onChange={(e) => setUniversityScale(e.target.value as UniversityScale)}
                className="w-full bg-transparent text-sm font-bold text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
              >
                <option value="NSU">North South University (NSU)</option>
                <option value="BRAC">BRAC University</option>
                <option value="EWU">East West University (EWU)</option>
                <option value="UIU">United International University (UIU)</option>
              </select>
            </div>
          </div>
        </div>
        
        <Card className="flex flex-col sm:flex-row items-center gap-6 px-8 py-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-[32px] border-none shadow-xl">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Overall CGPA</p>
            <p className="text-4xl font-black tracking-tighter">{cgpa.toFixed(2)}</p>
          </div>
          <div className="h-px w-full sm:h-12 sm:w-px bg-white/20 dark:bg-slate-900/10" />
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Total Credits</p>
            <p className="text-4xl font-black tracking-tighter">{totalCredits}</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input 
          placeholder="New Semester Name (e.g., Spring 2024)" 
          value={newSemName}
          onChange={(e) => setNewSemName(e.target.value)}
          className="max-w-md h-12 px-5 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium"
        />
        <Button onClick={handleAddSemester} className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all">
          <Plus className="mr-2 h-5 w-5" /> Add Semester
        </Button>
      </div>

      <div className="grid gap-8">
        {semesters.map((sem) => {
          const { gpa, credits } = calculateGPA(sem.courses, universityScale);
          return (
            <Card key={sem.id} className="rounded-[32px] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-8 py-6">
                <div>
                  <CardTitle className="text-xl font-bold">{sem.name}</CardTitle>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">GPA: <span className="text-blue-600 dark:text-blue-400">{gpa.toFixed(2)}</span></span>
                    <span className="text-slate-300 dark:text-slate-700 h-3 w-px" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credits: <span className="text-slate-900 dark:text-slate-100">{credits}</span></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleAddCourse(sem.id)} className="rounded-xl border-slate-200 dark:border-slate-700 font-bold px-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Course
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteSemester(sem.id)} className="rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {sem.courses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">No courses added yet. Start by adding a course to calculate your GPA.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sem.courses.map(course => (
                      <div key={course.id} className="flex flex-col gap-4 lg:flex-row lg:items-center animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Course Title</label>
                          <Input 
                            value={course.name} 
                            onChange={(e) => handleUpdateCourse(sem.id, course.id, 'name', e.target.value)}
                            placeholder="e.g. Introduction to Programming"
                            className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none px-4 font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        <div className="flex gap-3">
                          <div className="w-24">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Credits</label>
                            <Input 
                              type="number" 
                              value={course.credit ?? ''} 
                              onChange={(e) => handleUpdateCourse(sem.id, course.id, 'credit', e.target.value)}
                              placeholder="0"
                              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none px-4 font-bold text-slate-900 dark:text-slate-100 text-center"
                            />
                          </div>
                          <div className="flex-1 min-w-[120px]">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Grade</label>
                            <select 
                              className="flex h-11 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-none px-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                              value={course.grade}
                              onChange={(e) => handleUpdateCourse(sem.id, course.id, 'grade', e.target.value)}
                            >
                              {availableGrades.map(grade => (
                                <option key={grade} value={grade}>{grade} ({GRADING_SCALES[universityScale][grade].toFixed(2)})</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-end">
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteCourse(sem.id, course.id)} className="h-11 w-11 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
