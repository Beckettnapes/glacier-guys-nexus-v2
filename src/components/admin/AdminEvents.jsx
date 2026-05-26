import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import moment from "moment";

const TYPES = ["Meeting", "Expedition", "Fundraiser", "Training", "Outreach", "Other"];
const empty = { title: "", date: "", time: "", description: "", location: "", type: "Meeting" };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newEvent, setNewEvent] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await db.Event.list("date");
    setEvents(data);
    setLoading(false);
  }

  async function addEvent() {
    if (!newEvent.title || !newEvent.date) return;
    await db.Event.create(newEvent);
    setAdding(false);
    setNewEvent(empty);
    load();
  }

  async function saveEdit(id) {
    await db.Event.update(id, editData);
    setEditId(null);
    load();
  }

  async function deleteEvent(id) {
    if (!confirm("Delete this event?")) return;
    await db.Event.delete(id);
    load();
  }

  if (loading) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setAdding(!adding)} className="bg-primary text-primary-foreground font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </Button>
      </div>

      {adding && (
        <div className="frost-glass rounded-xl p-6 border border-primary/20 space-y-4">
          <h3 className="font-semibold text-foreground">New Event</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Event title *" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="bg-secondary/50 border-border" />
            <Select value={newEvent.type} onValueChange={v => setNewEvent({ ...newEvent, type: v })}>
              <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="bg-secondary/50 border-border" />
            <Input placeholder="Time (e.g. 6:00 PM)" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} className="bg-secondary/50 border-border" />
            <Input placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} className="bg-secondary/50 border-border" />
            <Input placeholder="Description (optional)" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="bg-secondary/50 border-border" />
          </div>
          <div className="flex gap-2">
            <Button onClick={addEvent} size="sm" className="bg-primary text-primary-foreground">Save Event</Button>
            <Button onClick={() => setAdding(false)} size="sm" variant="ghost">Cancel</Button>
          </div>
        </div>
      )}

      <div className="frost-glass rounded-xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted-foreground py-10">No events yet. Add one above.</td></tr>
              )}
              {events.map(ev => (
                <tr key={ev.id} className="border-b border-border/50 hover:bg-primary/[0.02] transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">
                    {editId === ev.id ? <Input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className="h-8 bg-secondary border-border text-sm w-40" /> : ev.title}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {editId === ev.id ? (
                      <Select value={editData.type} onValueChange={v => setEditData({ ...editData, type: v })}>
                        <SelectTrigger className="h-8 w-36 bg-secondary border-border text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : ev.type}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {editId === ev.id ? <Input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} className="h-8 bg-secondary border-border text-sm w-36" /> : (ev.date ? moment(ev.date).format("MMM D, YYYY") : "—")}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {editId === ev.id ? <Input value={editData.time || ""} onChange={e => setEditData({ ...editData, time: e.target.value })} className="h-8 bg-secondary border-border text-sm w-28" placeholder="6:00 PM" /> : (ev.time || "—")}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {editId === ev.id ? <Input value={editData.location || ""} onChange={e => setEditData({ ...editData, location: e.target.value })} className="h-8 bg-secondary border-border text-sm w-36" placeholder="Location" /> : (ev.location || "—")}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {editId === ev.id ? (
                        <>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => saveEdit(ev.id)}><Check className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => { setEditId(ev.id); setEditData({ title: ev.title, type: ev.type, date: ev.date, time: ev.time || "", location: ev.location || "", description: ev.description || "" }); }}><Edit2 className="w-3.5 h-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteEvent(ev.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}