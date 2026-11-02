import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  Brain,
  Target,
  Settings,
  FileText,
  PiggyBank,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Expenses", path: "/expenses", icon: ArrowDownCircle },
  { name: "Income", path: "/income", icon: ArrowUpCircle },
  { name: "Accounts", path: "/accounts", icon: Wallet },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Forecast", path: "/forecast", icon: Brain },
  { name: "Budgets", path: "/budgets", icon: PiggyBank },
  { name: "Goals", path: "/goals", icon: Target },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const Sidebar = () => (
    <aside className="flex h-full w-64 flex-col bg-slate-950 text-white">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold">💰 Finance</h1>
        <p className="mt-1 text-xs text-slate-400">
          Smart personal finance
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="m-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative h-full">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">
              Personal Finance Dashboard
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button className="rounded-full p-2 hover:bg-slate-100">
              🔔
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
              M
            </div>
          </div>

          {mobileOpen && (
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X />
            </button>
          )}
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}