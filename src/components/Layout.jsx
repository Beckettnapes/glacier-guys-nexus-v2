import { Outlet, Link, useLocation } from "react-router-dom";
import { Mountain, Users, ClipboardList, Heart, Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "Mission", icon: Mountain },
  { path: "/community", label: "Community", icon: Users },
  { path: "/assignments", label: "Goals", icon: ClipboardList },
  { path: "/impact", label: "Impact", icon: Heart },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeIndex = navItems.findIndex(n => n.path === location.pathname);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Desktop Nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 frost-glass">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-8 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <span className="text-3xl select-none inline-block transition-transform duration-300 group-hover:scale-110">🐻‍❄️</span>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-bold tracking-wider text-foreground">
              GLACIER <span className="text-primary">GUYS</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
            <Link
              to="/join"
              className="ml-3 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Join Us
            </Link>
            <Link
              to="/admin"
              className="ml-1 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              title="Admin"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 frost-glass">
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐻‍❄️</span>
            <span className="text-base font-bold tracking-wider">
              GLACIER <span className="text-primary">GUYS</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/join" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground">Join Us</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground p-1">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-20"
          >
            <div className="flex flex-col items-center gap-2 p-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <Settings className="w-5 h-5" />
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16 md:pt-20 min-h-screen pb-48">
        <Outlet />
      </main>
    </div>
  );
}