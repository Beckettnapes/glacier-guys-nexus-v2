import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Users, ClipboardList, Heart, LogOut, CalendarDays, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/AuthContext";
import AdminCommunity from "../components/admin/AdminCommunity";
import AdminGoals from "../components/admin/AdminGoals";
import AdminImpact from "../components/admin/AdminImpact";
import AdminEvents from "../components/admin/AdminEvents";
import AdminMission from "../components/admin/AdminMission";
import AdminPillars from "../components/admin/AdminPillars";

const tabs = [
  { id: "community", label: "Community",   icon: Users },
  { id: "goals",     label: "Goals",        icon: ClipboardList },
  { id: "impact",    label: "Impact",        icon: Heart },
  { id: "events",    label: "Events",        icon: CalendarDays },
  { id: "mission",   label: "Mission Page",  icon: Mountain },
  { id: "pillars",   label: "Pillars",       icon: Mountain },
];

// Simple login form shown when not authenticated
function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Email and password are required."); return; }
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
    } catch (err) {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="frost-glass rounded-2xl p-10 w-full max-w-sm shimmer-border"
      >
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
          <Lock className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Admin Access</h1>
        <p className="text-muted-foreground text-sm mb-6 text-center">Sign in with your admin account.</p>
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-secondary/50 border-border"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className="bg-secondary/50 border-border"
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
          <Button
            className="w-full bg-primary text-primary-foreground font-bold"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const { isAuthenticated, isLoadingAuth, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("community");

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <LoginForm />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="frost-glass rounded-2xl p-10 w-full max-w-sm shimmer-border text-center"
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-sm mb-6">
            You don't have admin permissions for this page.
          </p>
          <Button variant="outline" onClick={logout}>Sign Out</Button>
        </motion.div>
      </div>
    );
  }

  const activeTabObj = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen pb-24">
      {/* Admin Header */}
      <div className="px-6 py-6 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-1">Admin</p>
            <h1 className="text-2xl font-black tracking-tight">Management Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-border">
        <div className="max-w-7xl mx-auto">
          {/* Mobile dropdown */}
          <div className="md:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                <SelectValue>
                  {activeTabObj && (
                    <span className="flex items-center gap-2">
                      <activeTabObj.icon className="w-4 h-4" />
                      {activeTabObj.label}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tabs.map(tab => (
                  <SelectItem key={tab.id} value={tab.id}>
                    <span className="flex items-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop tab row */}
          <div className="hidden md:flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === "community" && <AdminCommunity />}
          {activeTab === "goals"     && <AdminGoals />}
          {activeTab === "impact"    && <AdminImpact />}
          {activeTab === "events"    && <AdminEvents />}
          {activeTab === "mission"   && <AdminMission />}
          {activeTab === "pillars"   && <AdminPillars />}
        </div>
      </div>
    </div>
  );
}
