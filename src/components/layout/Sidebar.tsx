import { NavLink } from "react-router-dom";
import { useStore } from "@/src/store/useStore";
import { 
  LayoutDashboard, 
  CalendarDays, 
  GraduationCap, 
  Wallet, 
  CheckSquare, 
  LogOut,
  Moon,
  Sun,
  X
} from "lucide-react";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { logout, darkMode, toggleDarkMode } = useStore();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Routine", href: "/routine", icon: CalendarDays },
    { name: "CGPA Tracker", href: "/cgpa", icon: GraduationCap },
    { name: "Tuition Fees", href: "/tuition", icon: Wallet },
    { name: "Planner", href: "/planner", icon: CheckSquare },
  ];

  return (
    <aside className="h-full w-64 bg-slate-900 flex-shrink-0 flex flex-col font-sans transition-all dark:bg-slate-950">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
              U
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              UniTrack BD
            </span>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              onClick={onClose}
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800/50">
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleDarkMode}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
