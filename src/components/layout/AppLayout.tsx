import { Outlet, Navigate, useLocation, NavLink } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useStore } from "@/src/store/useStore";
import { useEffect } from "react";
import { 
  LayoutDashboard, 
  CalendarDays, 
  GraduationCap, 
  Wallet, 
  CheckSquare,
  LogOut
} from "lucide-react";

export function AppLayout() {
  const { user, darkMode, logout } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Routine", href: "/routine", icon: CalendarDays },
    { name: "Tracker", href: "/cgpa", icon: GraduationCap },
    { name: "Tuition", href: "/tuition", icon: Wallet },
    { name: "Planner", href: "/planner", icon: CheckSquare },
  ];

  return (
    <div className={`flex h-screen w-full bg-slate-50 font-sans antialiased overflow-hidden dark:bg-slate-900 ${darkMode ? 'dark' : ''}`}>
      {/* Desktop Sidebar container */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 flex-shrink-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-sm text-sm">U</div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">UniTrack</span>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto w-full pb-20 md:pb-0">
          <div className="p-4 sm:p-6 md:p-8 mx-auto xl:max-w-7xl max-w-5xl w-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-2 py-2 flex justify-between items-center z-50">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full py-1 rounded-xl transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                }`
              }
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] sm:text-xs font-semibold">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
