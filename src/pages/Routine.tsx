import React, { useState } from "react";
import { useStore, RoutineClass, RoutineSemester } from "@/src/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Plus, Trash2, Clock, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

const RoutineSemesterCard: React.FC<{ 
  sem: RoutineSemester; 
  classes: RoutineClass[]; 
  onAddClass: (cls: any) => void;
  onDeleteClass: (id: string) => void;
  onDeleteSemester: (id: string) => void;
}> = ({ 
  sem, 
  classes, 
  onAddClass, 
  onDeleteClass, 
  onDeleteSemester 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingInSem, setIsAddingInSem] = useState(false);
  const [newClassInSem, setNewClassInSem] = useState<Partial<RoutineClass>>({
    day: 'Sunday',
    courseName: '',
    startTime: '',
    endTime: '',
    teacher: '',
    room: ''
  });

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassInSem.courseName && newClassInSem.startTime && newClassInSem.endTime && newClassInSem.day) {
      onAddClass({
        ...newClassInSem,
        semesterId: sem.id,
        id: crypto.randomUUID(),
      });
      setIsAddingInSem(false);
      setNewClassInSem({ day: 'Sunday', courseName: '', startTime: '', endTime: '', teacher: '', room: '' });
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden border-t-4 border-t-emerald-500 transition-all duration-300">
      <CardHeader 
        className="bg-slate-50 dark:bg-slate-900/30 flex flex-row items-center justify-between pb-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
          <div>
            <CardTitle className="text-lg">{sem.name}</CardTitle>
            <CardDescription>
              {isExpanded 
                ? "Manage your weekly class schedule for this semester." 
                : `${classes.length} classes scheduled`
              }
            </CardDescription>
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={(e) => {
          e.stopPropagation();
          if(confirm("Are you sure you want to delete this entire semester routine?")) {
            onDeleteSemester(sem.id);
          }
        }}>
          <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" />
        </Button>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setIsAddingInSem(!isAddingInSem)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Class
                  </Button>
                </div>

                {isAddingInSem && (
                  <Card className="bg-slate-50 dark:bg-slate-900/10 border-dashed border-2 border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleAddClass}>
                      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Day</label>
                          <select 
                            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm dark:border-slate-800 dark:bg-slate-950"
                            value={newClassInSem.day}
                            onChange={(e) => setNewClassInSem({...newClassInSem, day: e.target.value as any})}
                          >
                            {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Course Name</label>
                          <Input required className="h-9" value={newClassInSem.courseName} onChange={e => setNewClassInSem({...newClassInSem, courseName: e.target.value})} placeholder="e.g. CSE101" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Room</label>
                          <Input className="h-9" value={newClassInSem.room} onChange={e => setNewClassInSem({...newClassInSem, room: e.target.value})} placeholder="e.g. 504AB" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Start Time</label>
                          <Input type="time" required className="h-9" value={newClassInSem.startTime} onChange={e => setNewClassInSem({...newClassInSem, startTime: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase">End Time</label>
                          <Input type="time" required className="h-9" value={newClassInSem.endTime} onChange={e => setNewClassInSem({...newClassInSem, endTime: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Teacher</label>
                          <Input className="h-9" value={newClassInSem.teacher} onChange={e => setNewClassInSem({...newClassInSem, teacher: e.target.value})} placeholder="e.g. Dr. John" />
                        </div>
                      </CardContent>
                      <div className="p-4 pt-0 flex gap-2">
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingInSem(false)}>Cancel</Button>
                      </div>
                    </form>
                  </Card>
                )}

                <div className="grid gap-6">
                  {DAYS.map(day => {
                    const dayClasses = classes.filter(c => c.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                    if (dayClasses.length === 0) return null;

                    return (
                      <div key={day} className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{day}</h4>
                        <div className="grid gap-3">
                          {dayClasses.map(cls => (
                            <div key={cls.id} className="group relative flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-w-[70px]">
                                  <Clock className="mb-0.5 h-3.5 w-3.5 text-emerald-500" />
                                  <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100">{cls.startTime}</span>
                                </div>
                                <div>
                                  <h5 className="font-bold text-slate-900 dark:text-slate-50">{cls.courseName}</h5>
                                  <div className="text-xs font-medium text-slate-500 flex items-center gap-2 mt-0.5">
                                    {cls.room && <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">Room: {cls.room}</span>}
                                    {cls.teacher && <span className="truncate max-w-[120px]">Teacher: {cls.teacher}</span>}
                                  </div>
                                </div>
                              </div>
                              <Button type="button" variant="ghost" size="icon" className="text-slate-300 hover:text-red-500 transition-colors" onClick={() => {
                                if (confirm("Are you sure you want to delete this class?")) {
                                  onDeleteClass(cls.id);
                                }
                              }}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {classes.length === 0 && !isAddingInSem && (
                    <div className="text-center py-8 text-sm text-slate-400 italic">
                      No classes added for this semester yet.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function Routine() {
  const { 
    routine, 
    routineSemesters, 
    addClass, 
    deleteClass, 
    addRoutineSemester, 
    deleteRoutineSemester 
  } = useStore();

  const [newSemName, setNewSemName] = useState("");

  const handleAddSemester = () => {
    const defaultName = `SEMESTER ${routineSemesters.length + 1}`;
    const name = newSemName.trim() ? newSemName.toUpperCase() : defaultName;
    addRoutineSemester({
      id: crypto.randomUUID(),
      name
    });
    setNewSemName("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Class Routine</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Organize your weekly class schedule by semester.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <Input 
            placeholder="e.g. Summer 2024" 
            value={newSemName}
            onChange={(e) => setNewSemName(e.target.value)}
            className="max-w-[250px]"
          />
          <Button onClick={handleAddSemester} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Semester
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {routineSemesters.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No routine semesters created yet.</p>
            <p className="text-xs text-slate-400 mt-1">Add a semester above to start building your class schedule.</p>
          </div>
        ) : (
          routineSemesters.map(sem => (
            <RoutineSemesterCard 
              key={sem.id}
              sem={sem}
              classes={routine.filter(c => c.semesterId === sem.id)}
              onAddClass={addClass}
              onDeleteClass={deleteClass}
              onDeleteSemester={deleteRoutineSemester}
            />
          ))
        )}
      </div>
    </div>
  );
}

