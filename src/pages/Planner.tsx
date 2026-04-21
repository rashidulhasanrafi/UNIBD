import React, { useState } from "react";
import { useStore, Task } from "@/src/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { parseISO, format, isThisWeek, isFuture, isToday } from "date-fns";
import { Trash2, CheckCircle2, Circle, AlertCircle, Plus } from "lucide-react";

const TaskItem: React.FC<{ 
  task: Task, 
  toggleTask: (id: string) => void, 
  onDeleteReq: (id: string) => void 
}> = ({ task, toggleTask, onDeleteReq }) => (
  <div className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
    task.completed ? 'bg-slate-50 border-slate-100 dark:bg-slate-900/50 dark:border-slate-800' 
    : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800'
  }`}>
    <button onClick={() => toggleTask(task.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
      {task.completed ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6" />}
    </button>
    <div className="flex-1">
      <p className={`font-medium ${task.completed ? 'opacity-50 line-through' : ''}`}>
        {task.title}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          task.type === 'Exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
          task.type === 'Assignment' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
          task.type === 'Class' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
        }`}>
          {task.type}
        </span>
        <span className="text-xs text-slate-500">
          {format(parseISO(task.date), 'MMM d, yyyy')}
          {isToday(parseISO(task.date)) && <span className="ml-2 font-bold text-blue-500">Today</span>}
        </span>
      </div>
    </div>
    <Button type="button" variant="ghost" size="icon" onClick={() => onDeleteReq(task.id)}>
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  </div>
);

export function Planner() {
  const { tasks, addTask, toggleTask, deleteTask } = useStore();
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    type: "Assignment",
  });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; onConfirm: () => void; message: string }>({
    isOpen: false,
    onConfirm: () => {},
    message: ""
  });

  const reqDeleteTask = (id: string) => {
    setDeleteModal({
      isOpen: true,
      message: "Are you sure you want to delete this task?",
      onConfirm: () => deleteTask(id)
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.date) {
      addTask({
        ...newTask,
        id: crypto.randomUUID(),
        completed: false,
      } as Task);
      setNewTask({ ...newTask, title: "" });
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const thisWeekTasks = sortedTasks.filter(t => isThisWeek(parseISO(t.date)));
  const upcomingTasks = sortedTasks.filter(t => isFuture(parseISO(t.date)) && !isThisWeek(parseISO(t.date)));

  return (
    <div className="space-y-8">
      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))} 
        onConfirm={deleteModal.onConfirm}
        message={deleteModal.message}
      />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Weekly Planner</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Keep track of your assignments, exams, and important tasks</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="What do you need to do?" 
              value={newTask.title} 
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              className="flex-1"
              required
            />
            <div className="flex gap-4">
              <Input 
                type="date" 
                value={newTask.date} 
                onChange={e => setNewTask({...newTask, date: e.target.value})}
                required
              />
              <select 
                className="flex h-10 w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                value={newTask.type}
                onChange={e => setNewTask({...newTask, type: e.target.value as Task['type']})}
              >
                <option value="Assignment">Assignment</option>
                <option value="Exam">Exam</option>
                <option value="Class">Class</option>
                <option value="Other">Other</option>
              </select>
              <Button type="submit"><Plus className="h-4 w-4 mr-2"/> Add Task</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" /> 
            This Week
          </h2>
          {thisWeekTasks.length === 0 ? (
            <p className="text-sm text-slate-500">No tasks scheduled for this week. Enjoy your free time!</p>
          ) : (
            <div className="space-y-3">
              {thisWeekTasks.map(task => <TaskItem key={task.id} task={task} toggleTask={toggleTask} onDeleteReq={reqDeleteTask} />)}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming</h2>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming tasks.</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map(task => <TaskItem key={task.id} task={task} toggleTask={toggleTask} onDeleteReq={reqDeleteTask} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
