import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { CheckCircle2, Circle, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["Research", "Outreach", "Fundraising", "Field Work", "Education", "Advocacy"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];

export default function AdminGoals() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", category: "Research", priority: "Medium", assigned_to: "", due_date: "" });

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await db.Assignment.list();
    setTasks(data);
    setLoading(false);
  }

  async function toggleComplete(task) {
    const newStatus = task.status === "Completed" ? "In Progress" : "Completed";
    const newProgress = newStatus === "Completed" ? 100 : task.progress;
    await db.Assignment.update(task.id, { status: newStatus, progress: newProgress });
    load();
  }

  async function addTask() {
    if (!newTask.title) return;
    await db.Assignment.create({ ...newTask, status: "Not Started", progress: 0 });
    setAdding(false);
    setNewTask({ title: "", category: "Research", priority: "Medium", assigned_to: "", due_date: "" });
    load();
  }

  async function deleteTask(id) {
    if (!confirm("Delete this goal?")) return;
    await db.Assignment.delete(id);
    load();
  }

  async function saveEdit(task) {
    await db.Assignment.update(task.id, editData);
    setEditId(null);
    load();
  }

  if (loading) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  const incomplete = tasks.filter(t => t.status !== "Completed");
  const completed = tasks.filter(t => t.status === "Completed");

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button onClick={() => setAdding(!adding)} className="bg-primary text-primary-foreground font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Goal
        </Button>
      </div>

      {adding && (
        <div className="frost-glass rounded-xl p-6 border border-primary/20 space-y-4">
          <h3 className="font-semibold text-foreground">New Goal</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Goal title *" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="bg-secondary/50 border-border" />
            <Input placeholder="Assigned to" value={newTask.assigned_to} onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })} className="bg-secondary/50 border-border" />
            <Select value={newTask.category} onValueChange={v => setNewTask({ ...newTask, category: v })}>
              <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={newTask.priority} onValueChange={v => setNewTask({ ...newTask, priority: v })}>
              <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} className="bg-secondary/50 border-border" />
          </div>
          <div className="flex gap-2">
            <Button onClick={addTask} size="sm" className="bg-primary text-primary-foreground">Save Goal</Button>
            <Button onClick={() => setAdding(false)} size="sm" variant="ghost">Cancel</Button>
          </div>
        </div>
      )}

      <GoalList title="Active Goals" tasks={incomplete} editId={editId} editData={editData} setEditData={setEditData}
        startEdit={t => { setEditId(t.id); setEditData({ title: t.title, progress: t.progress || 0, assigned_to: t.assigned_to || "" }); }}
        saveEdit={saveEdit} setEditId={setEditId} toggleComplete={toggleComplete} deleteTask={deleteTask} />

      <GoalList title={`Completed (${completed.length})`} tasks={completed} editId={editId} editData={editData} setEditData={setEditData}
        startEdit={t => { setEditId(t.id); setEditData({ title: t.title, progress: t.progress || 0, assigned_to: t.assigned_to || "" }); }}
        saveEdit={saveEdit} setEditId={setEditId} toggleComplete={toggleComplete} deleteTask={deleteTask} />
    </div>
  );
}

function GoalList({ title, tasks, editId, editData, setEditData, startEdit, saveEdit, setEditId, toggleComplete, deleteTask }) {
  if (tasks.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{title}</h3>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="frost-glass rounded-xl px-5 py-4 border border-border flex items-center gap-4">
            <button onClick={() => toggleComplete(task)} className="flex-shrink-0">
              {task.status === "Completed"
                ? <CheckCircle2 className="w-6 h-6 text-primary" />
                : <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />}
            </button>
            <div className="flex-1 min-w-0">
              {editId === task.id ? (
                <div className="flex gap-3 flex-wrap">
                  <Input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })}
                    className="h-8 bg-secondary border-border text-sm flex-1" />
                  <Input placeholder="Assigned to" value={editData.assigned_to} onChange={e => setEditData({ ...editData, assigned_to: e.target.value })}
                    className="h-8 bg-secondary border-border text-sm w-40" />
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-muted-foreground w-20">Progress: {editData.progress}%</span>
                    <input type="range" min={0} max={100} value={editData.progress}
                      onChange={e => setEditData({ ...editData, progress: parseInt(e.target.value) })}
                      className="flex-1 accent-primary" />
                  </div>
                </div>
              ) : (
                <div>
                  <p className={`font-medium text-sm ${task.status === "Completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {task.category} · {task.priority} priority {task.assigned_to ? `· ${task.assigned_to}` : ""} · {task.progress || 0}%
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {editId === task.id ? (
                <>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => saveEdit(task)}><Check className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
                </>
              ) : (
                <>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => startEdit(task)}><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteTask(task.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}