import { useStore, UniversityScale } from "@/src/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { calculateCGPA } from "@/src/lib/calculations";
import { format, isThisWeek, parseISO } from "date-fns";
import { GraduationCap, Wallet, BookOpen, CheckCircle } from "lucide-react";

export function Dashboard() {
  const { user, semesters, universityScale, tuition, tasks, routine, routineSemesters } = useStore();
  
  const today = format(new Date(), 'EEEE');
  const activeSemester = routineSemesters.length > 0 ? routineSemesters[routineSemesters.length - 1] : null;
  
  const todayClasses = routine
    .filter(c => c.day === today && (!activeSemester || c.semesterId === activeSemester.id))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalClassesCount = activeSemester 
    ? routine.filter(r => r.semesterId === activeSemester.id).length 
    : routine.length;

  const { cgpa, totalCredits } = calculateCGPA(semesters, universityScale);
  
  const costPerCredit = Number(tuition.costPerCredit) || 0;
  const semestersData = tuition.tuitionSemesters || [];

  let totalSemestersFee = 0;
  let totalPaid = 0;
  let totalWaiversAmount = 0;

  semestersData.forEach(sem => {
    const semTuition = (Number(sem.credits) || 0) * costPerCredit;
    const wPct = sem.waiverPercentage;
    const waiverAmt = (wPct !== undefined && wPct !== '')
      ? (semTuition * (Number(wPct) / 100)) 
      : (Number(sem.waiver) || 0);
    
    totalSemestersFee += semTuition + (Number(sem.additionalFees) || 0);
    totalWaiversAmount += waiverAmt;
    
    const semPaid = sem.payments !== undefined 
      ? sem.payments.reduce((acc, p) => acc + Number(p.amount), 0) 
      : (Number(sem.paidAmount) || 0);
    totalPaid += semPaid;
  });

  const dueAmount = Math.max(0, (Number(tuition.totalDegreeCost) || 0) - totalPaid - totalWaiversAmount);
  // Calculate specific "Semester Due" as requested
  const activeSemesterDue = Math.max(0, totalSemestersFee - totalPaid - totalWaiversAmount);

  const thisWeekTasks = tasks.filter(t => {
    try {
      return isThisWeek(parseISO(t.date));
    } catch {
      return false;
    }
  });

  const completedTasks = thisWeekTasks.filter(t => t.completed).length;

  const universityNames: Record<UniversityScale, string> = {
    NSU: 'North South University',
    BRAC: 'BRAC University',
    EWU: 'East West University',
    UIU: 'United International University'
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {universityNames[universityScale]} • Dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Current CGPA</CardTitle>
            <GraduationCap className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{cgpa.toFixed(2)}</div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded mt-2 inline-block">Total Credits: {totalCredits}</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Due</CardTitle>
            <Wallet className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">৳ {dueAmount.toLocaleString()}</div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded mt-2 inline-block">
               Cur. Semesters Due: ৳ {activeSemesterDue.toLocaleString()}
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Weekly Progress</CardTitle>
            <CheckCircle className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {completedTasks} / {thisWeekTasks.length}
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-1 rounded mt-2 inline-block">Tasks completed this week</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Classes</CardTitle>
            <BookOpen className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalClassesCount}</div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded mt-2 inline-block">Scheduled {activeSemester ? `in ${activeSemester.name}` : 'per week'}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="col-span-8 rounded-3xl">
          <CardHeader className="flex flex-row justify-between items-center bg-transparent border-b border-slate-100 p-6">
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {todayClasses.length === 0 ? (
              <p className="text-sm text-slate-500">No classes scheduled for today.</p>
            ) : (
              <div className="space-y-4">
                {todayClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-4 italic text-xs">
                      {cls.courseName.substring(0, 3).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">{cls.courseName}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Room {cls.room || 'TBD'} • {cls.teacher || 'No Teacher'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{cls.startTime}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Until {cls.endTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-4 rounded-3xl">
          <CardHeader className="bg-transparent border-b border-slate-100 p-6">
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             {tasks.filter(t => !t.completed).length === 0 ? (
              <p className="text-sm text-slate-500">No pending tasks.</p>
            ) : (
              <div className="space-y-6">
                {tasks.filter(t => !t.completed).slice(0, 5).map((task) => (
                  <div key={task.id} className="relative pl-8">
                    <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      task.type === 'Exam' ? 'border-red-500' :
                      task.type === 'Assignment' ? 'border-amber-500' :
                      'border-blue-500'
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                      task.type === 'Exam' ? 'bg-red-500' :
                      task.type === 'Assignment' ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`}></div>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{task.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{task.date}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
