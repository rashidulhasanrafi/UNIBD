import { useStore, TuitionSemesterItem, PaymentRecord } from "@/src/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Plus, Trash2, GraduationCap, Edit, Clock, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";

const formatCurrency = (amount: number | string) => {
  return Number(amount || 0).toLocaleString('en-IN');
};

const SemesterCard: React.FC<{ 
  sem: TuitionSemesterItem;
  costPerCredit: number;
  handleUpdateSem: (sem: TuitionSemesterItem) => void;
  deleteTuitionSemester: (id: string) => void;
}> = ({ 
  sem, 
  costPerCredit, 
  handleUpdateSem, 
  deleteTuitionSemester 
}) => {
  const handleUpdateField = (field: keyof TuitionSemesterItem, value: string | number | PaymentRecord[]) => {
    handleUpdateSem({ ...sem, [field]: value });
  };

  const creditsNum = Number(sem.credits) || 0;
  const additionalFeesNum = Number(sem.additionalFees) || 0;
  const waiverPercentageNum = Number(sem.waiverPercentage);
  const waiverNum = Number(sem.waiver) || 0;

  const semTuition = creditsNum * costPerCredit;
  const waiverAmt = (sem.waiverPercentage !== undefined && sem.waiverPercentage !== '')
    ? (semTuition * (waiverPercentageNum / 100))
    : waiverNum;

  const semFeeBeforeWaiver = semTuition + additionalFeesNum;
  const semFeeActual = semFeeBeforeWaiver - waiverAmt;

  const payments = sem.payments !== undefined 
    ? sem.payments 
    : ((Number(sem.paidAmount) || 0) > 0 ? [{ id: crypto.randomUUID(), amount: Number(sem.paidAmount), date: new Date().toISOString() }] : []);
    
  const semPaid = payments.reduce((acc: number, p: PaymentRecord) => acc + Number(p.amount), 0);
  const semDue = Math.max(0, semFeeActual - semPaid);

  // local states for payments
  const [newPayAmount, setNewPayAmount] = useState("");
  const [newPayDate, setNewPayDate] = useState(() => {
    const tzOffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    return new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
  });
  
  const [editingPayId, setEditingPayId] = useState<string | null>(null);
  const [editPayAmount, setEditPayAmount] = useState("");
  const [editPayDate, setEditPayDate] = useState("");
  
  // Track expand/collapse state
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddPayment = () => {
    if (newPayAmount && !isNaN(Number(newPayAmount))) {
      const p: PaymentRecord = {
        id: crypto.randomUUID(),
        amount: Number(newPayAmount),
        date: new Date(newPayDate).toISOString()
      };
      handleUpdateField('payments', [...payments, p]);
      setNewPayAmount("");
    }
  };

  const startEditingPayment = (p: PaymentRecord) => {
    setEditingPayId(p.id);
    setEditPayAmount(String(p.amount));
    // format as YYYY-MM-DDThh:mm for datetime-local input
    const tzOffset = (new Date(p.date)).getTimezoneOffset() * 60000;
    const localISOTime = new Date(new Date(p.date).getTime() - tzOffset).toISOString().slice(0, 16);
    setEditPayDate(localISOTime);
  };

  const saveEditedPayment = () => {
    if (editingPayId && editPayAmount && !isNaN(Number(editPayAmount))) {
      const updatedPayments = payments.map(p => 
        p.id === editingPayId 
          ? { ...p, amount: editPayAmount as any, date: new Date(editPayDate).toISOString() } 
          : p
      );
      handleUpdateField('payments', updatedPayments);
      setEditingPayId(null);
    }
  };

  const deletePayment = (pid: string) => {
    if(confirm("Are you sure you want to delete this payment?")) {
      handleUpdateField('payments', payments.filter(p => p.id !== pid));
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden border-t-4 border-t-blue-500 transition-all duration-300">
      <CardHeader 
        className="bg-slate-50 dark:bg-slate-900/30 flex flex-row items-center justify-between pb-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
          <div>
            <CardTitle className="text-lg">{sem.name}</CardTitle>
            <CardDescription>
              {isExpanded 
                ? "Calculate fee and track payments this semester." 
                : <span className="font-medium text-red-500 dark:text-red-400">Due: ৳ {formatCurrency(semDue)}</span>
              }
            </CardDescription>
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={(e) => {
          e.stopPropagation(); // prevent collapsing when clicking delete
          if (confirm("Are you sure you want to delete this semester record?")) {
            deleteTuitionSemester(sem.id);
          }
        }}>
          <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" />
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side: Setup */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Credits Taken</label>
                <Input 
                  type="number" 
                  value={sem.credits ?? ''} 
                  onChange={(e) => handleUpdateField('credits', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Extra Fees (৳)</label>
                <Input 
                  type="number"
                  value={sem.additionalFees ?? ''} 
                  onChange={(e) => handleUpdateField('additionalFees', e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2 lg:col-span-1">
                <label className="text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase">Waiver (%)</label>
                <Input 
                  type="number"
                  className="border-amber-200 focus-visible:ring-amber-500 dark:border-amber-900/50"
                  placeholder="e.g. 50"
                  value={sem.waiverPercentage ?? ''} 
                  onChange={(e) => handleUpdateField('waiverPercentage', e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Semester Total Fee:</span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-400">৳ {formatCurrency(semFeeActual)}</span>
            </div>
            {waiverAmt > 0 && (
              <p className="text-xs text-amber-600 font-medium px-1">
                Included waiver savings: ৳ {formatCurrency(waiverAmt)}
              </p>
            )}
          </div>

          {/* Right Side: Payment History */}
          <div className="space-y-4 bg-slate-50 shadow-inner rounded-3xl p-5 border border-slate-100 dark:bg-slate-900/30 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Payment History</span>
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-lg">
                Paid: ৳ {formatCurrency(semPaid)}
              </span>
            </div>

            {/* List of Payments */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {payments.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-4 italic">No payments recorded.</div>
              ) : payments.map(p => (
                <div key={p.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {editingPayId === p.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          type="number" 
                          value={editPayAmount} 
                          onChange={e => setEditPayAmount(e.target.value)} 
                          className="h-8 text-sm"
                          placeholder="Amount"
                        />
                        <Input 
                          type="datetime-local" 
                          value={editPayDate} 
                          onChange={e => setEditPayDate(e.target.value)} 
                          className="h-8 text-sm px-2"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingPayId(null)}>Cancel</Button>
                        <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700" onClick={saveEditedPayment}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">৳ {formatCurrency(p.amount)}</div>
                        <div className="text-xs text-slate-500 font-medium flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(p.date), "dd MMM yyyy, hh:mm a")}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditingPayment(p)}>
                          <Edit className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => deletePayment(p.id)}>
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Payment UI */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Record New Payment</label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Amount" 
                  className="flex-1"
                  value={newPayAmount}
                  onChange={e => setNewPayAmount(e.target.value)}
                />
                <Input 
                  type="datetime-local" 
                  className="flex-1 px-2"
                  value={newPayDate}
                  onChange={e => setNewPayDate(e.target.value)}
                />
                <Button className="bg-green-600 hover:bg-green-700 px-3" onClick={handleAddPayment}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">Total Semester Due:</span>
              <span className="font-bold text-red-600 dark:text-red-400 text-lg">৳ {formatCurrency(semDue)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      )}
    </Card>
  );
}

export function Tuition() {
  const { tuition, updateTuition, addTuitionSemester, updateTuitionSemester, deleteTuitionSemester } = useStore();
  const [newSemName, setNewSemName] = useState("");

  const semesters = tuition.tuitionSemesters || [];
  
  const totalCreditsTaken = semesters.reduce((acc, sem) => acc + (Number(sem.credits) || 0), 0);
  const remainingCredits = Math.max(0, (Number(tuition.totalDegreeCredits) || 0) - totalCreditsTaken);

  let totalPaid = 0;
  let totalWaivers = 0;
  const costPerCredit = Number(tuition.costPerCredit) || 0;

  semesters.forEach(sem => {
    const semTuition = (Number(sem.credits) || 0) * costPerCredit;
    const wPct = sem.waiverPercentage;
    const waiverAmt = (wPct !== undefined && wPct !== '') 
      ? (semTuition * (Number(wPct) / 100)) 
      : (Number(sem.waiver) || 0);

    totalWaivers += waiverAmt;

    const payments = sem.payments !== undefined 
      ? sem.payments 
      : ((Number(sem.paidAmount) || 0) > 0 ? [{ id: 'legacy', amount: sem.paidAmount, date: new Date().toISOString() }] : []);
    
    totalPaid += payments.reduce((acc, p) => acc + Number(p.amount), 0);
  });

  const degreeDueAmount = Math.max(0, (Number(tuition.totalDegreeCost) || 0) - totalPaid - totalWaivers);
  const totalCostNum = Number(tuition.totalDegreeCost) || 0;
  const progressPercentage = totalCostNum > 0 ? ((totalPaid + totalWaivers) / totalCostNum) * 100 : 0;

  const handleAddSemester = () => {
    const defaultName = `SEMESTER ${semesters.length + 1}`;
    const name = newSemName.trim() ? newSemName.toUpperCase() : defaultName;
    addTuitionSemester({
      id: crypto.randomUUID(),
      name,
      credits: 0,
      additionalFees: tuition.defaultSemesterFee || 0,
      waiverPercentage: 0,
      paidAmount: 0,
      payments: []
    });
    setNewSemName("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Tuition Fees Calculator</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Track your overall degree cost and break it down by semester.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Full Degree Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">৳ {formatCurrency(tuition.totalDegreeCost)}</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Total Paid (All Semesters)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">৳ {formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">Overall Due Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 dark:text-red-400">৳ {formatCurrency(degreeDueAmount)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Degree Payment Progress <span className="opacity-70 text-xs ml-1">(inc. waivers)</span></span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div 
            className="h-full bg-slate-900 transition-all dark:bg-slate-50" 
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
          />
        </div>
      </div>

      <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle>Global Degree Setup</CardTitle>
          <CardDescription>Setup your full course total cost and total credits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Course Fee (৳)</label>
              <Input 
                type="number" 
                value={tuition.totalDegreeCost ?? ''} 
                onChange={(e) => updateTuition({ totalDegreeCost: e.target.value })}
                className="bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Credits Needed</label>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  value={tuition.totalDegreeCredits ?? ''} 
                  onChange={(e) => updateTuition({ totalDegreeCredits: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-900/50"
                />
              </div>
              <p className="text-xs font-semibold text-slate-500">Remaining: <span className="text-slate-900 dark:text-slate-100">{remainingCredits}</span></p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cost Per Credit (৳)</label>
              <Input 
                type="number" 
                value={tuition.costPerCredit ?? ''} 
                onChange={(e) => updateTuition({ costPerCredit: e.target.value })}
                className="bg-slate-50 dark:bg-slate-900/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Default Extra Fee (৳)</label>
              <Input 
                type="number" 
                value={tuition.defaultSemesterFee ?? ''} 
                onChange={(e) => updateTuition({ defaultSemesterFee: e.target.value })}
                className="bg-slate-50 dark:bg-slate-900/50"
                placeholder="Library fee, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Semester History</h2>
          <div className="flex gap-2">
            <Input 
              placeholder="e.g. Fall 2024" 
              value={newSemName}
              onChange={(e) => setNewSemName(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={handleAddSemester} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Semester
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {semesters.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
              No semesters added yet. Setup your global degree cost above, then click add semester.
            </p>
          ) : (
            semesters.map((sem) => (
              <SemesterCard 
                key={sem.id} 
                sem={sem} 
                costPerCredit={costPerCredit} 
                handleUpdateSem={updateTuitionSemester} 
                deleteTuitionSemester={deleteTuitionSemester} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
