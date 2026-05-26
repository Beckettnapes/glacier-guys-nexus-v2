import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { motion } from "framer-motion";
import { ClipboardList, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "../components/assignments/TaskCard";
import EventCalendar from "../components/assignments/EventCalendar";

export default function Assignments() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const data = await db.Assignment.list();
      setTasks(data);
      setLoading(false);
    }
    load();
  }, []);

  const filterByCategory = (list) => {
    if (categoryFilter === "all") return list;
    return list.filter(t => t.category === categoryFilter);
  };

  const notStarted = filterByCategory(tasks.filter(t => t.status === "Not Started"));
  const inProgress = filterByCategory(tasks.filter(t => t.status === "In Progress"));
  const completed = filterByCategory(tasks.filter(t => t.status === "Completed"));

  const overallProgress = tasks.length > 0
    ? Math.round(tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / tasks.length)
    : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              The Momentum
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              Mission Log
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl">
              Your off-grid assignments. Each expedition brings us closer to the goal.
            </p>
          </motion.div>

          {/* Overview Stats */}
          <div className="flex flex-wrap gap-6 mt-10">
            <div className="frost-glass rounded-xl px-6 py-4">
              <p className="text-3xl font-black text-primary">{tasks.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Missions</p>
            </div>
            <div className="frost-glass rounded-xl px-6 py-4">
              <p className="text-3xl font-black text-amber-400">{inProgress.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">In Progress</p>
            </div>
            <div className="frost-glass rounded-xl px-6 py-4">
              <p className="text-3xl font-black text-emerald-400">{completed.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Completed</p>
            </div>
            <div className="frost-glass rounded-xl px-6 py-4">
              <p className="text-3xl font-black text-foreground">{overallProgress}%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Overall</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-56 bg-card border-border">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
              <SelectItem value="Outreach">Outreach</SelectItem>
              <SelectItem value="Fundraising">Fundraising</SelectItem>
              <SelectItem value="Field Work">Field Work</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Advocacy">Advocacy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Event Calendar */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <EventCalendar />
        </div>
      </section>

      {/* Tasks by Status */}
      <section className="px-6 pb-48">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-24">
              <ClipboardList className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No assignments yet.</p>
            </div>
          ) : (
            <Tabs defaultValue="in-progress" className="w-full">
              <TabsList className="bg-card border border-border mb-8">
                <TabsTrigger value="not-started">Queued ({notStarted.length})</TabsTrigger>
                <TabsTrigger value="in-progress">Active ({inProgress.length})</TabsTrigger>
                <TabsTrigger value="completed">Done ({completed.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="not-started">
                <div className="grid md:grid-cols-2 gap-5">
                  {notStarted.map((t, i) => <TaskCard key={t.id} task={t} index={i} />)}
                </div>
                {notStarted.length === 0 && <p className="text-muted-foreground text-center py-12">No queued missions.</p>}
              </TabsContent>
              <TabsContent value="in-progress">
                <div className="grid md:grid-cols-2 gap-5">
                  {inProgress.map((t, i) => <TaskCard key={t.id} task={t} index={i} />)}
                </div>
                {inProgress.length === 0 && <p className="text-muted-foreground text-center py-12">No active missions.</p>}
              </TabsContent>
              <TabsContent value="completed">
                <div className="grid md:grid-cols-2 gap-5">
                  {completed.map((t, i) => <TaskCard key={t.id} task={t} index={i} />)}
                </div>
                {completed.length === 0 && <p className="text-muted-foreground text-center py-12">No completed missions yet.</p>}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
}