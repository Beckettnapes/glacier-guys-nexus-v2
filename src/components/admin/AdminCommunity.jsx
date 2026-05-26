import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Trash2, Edit2, Check, X, UserCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GROUPS   = ["Leader", "Co-Leader", "Member"];
const STATUSES = ["Active", "On Expedition", "Inactive", "Pending"];

const statusColors = {
  "Active":        "text-emerald-400",
  "On Expedition": "text-primary",
  "Inactive":      "text-muted-foreground",
  "Pending":       "text-amber-400",
};

export default function AdminCommunity() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId]   = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await db.Member.list("-created_at");
    setMembers(data);
    setLoading(false);
  }

  function startEdit(member) {
    setEditId(member.id);
    setEditData({ role: member.role || "", group: member.group || "Member", status: member.status || "Pending" });
  }

  async function saveEdit(member) {
    await db.Member.update(member.id, { role: editData.role, group: editData.group, status: editData.status });
    setEditId(null);
    load();
  }

  async function deleteMember(id) {
    if (!confirm("Remove this member?")) return;
    await db.Member.delete(id);
    load();
  }

  if (loading) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  const pending = members.filter(m => m.status === "Pending");
  const active  = members.filter(m => m.status !== "Pending");

  return (
    <div className="space-y-10">
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Pending Applications ({pending.length})
          </h3>
          <MemberTable members={pending} editId={editId} editData={editData} setEditData={setEditData} startEdit={startEdit} saveEdit={saveEdit} deleteMember={deleteMember} setEditId={setEditId} />
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <UserCheck className="w-4 h-4" /> All Members ({active.length})
        </h3>
        <MemberTable members={active} editId={editId} editData={editData} setEditData={setEditData} startEdit={startEdit} saveEdit={saveEdit} deleteMember={deleteMember} setEditId={setEditId} />
      </div>
    </div>
  );
}

function MemberTable({ members, editId, editData, setEditData, startEdit, saveEdit, deleteMember, setEditId }) {
  if (members.length === 0) return <p className="text-muted-foreground text-sm py-6 text-center">None.</p>;

  return (
    <div className="frost-glass rounded-xl overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Skills</th>
              <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Times</th>
              <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Position</th>
              <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-primary/[0.02] transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{m.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{m.email}</td>
                <td className="px-5 py-3 text-muted-foreground text-xs max-w-[160px]">
                  {m.specialties?.join(", ") || "—"}
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs max-w-[140px]">
                  {m.preferred_times?.join(", ") || "—"}
                </td>
                <td className="px-5 py-3">
                  {editId === m.id ? (
                    <Input value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })} className="h-8 w-36 bg-secondary border-border text-xs" placeholder="e.g. President" />
                  ) : (
                    <span className="text-foreground">{m.role || "—"}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {editId === m.id ? (
                    <Select value={editData.group} onValueChange={v => setEditData({ ...editData, group: v })}>
                      <SelectTrigger className="h-8 w-32 bg-secondary border-border text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : (
                    <span className="text-muted-foreground text-xs">{m.group || "—"}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {editId === m.id ? (
                    <Select value={editData.status} onValueChange={v => setEditData({ ...editData, status: v })}>
                      <SelectTrigger className="h-8 w-32 bg-secondary border-border text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : (
                    <span className={`text-xs font-medium ${statusColors[m.status] || "text-muted-foreground"}`}>{m.status || "—"}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {editId === m.id ? (
                      <>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => saveEdit(m)}><Check className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
                      </>
                    ) : (
                      <>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => startEdit(m)}><Edit2 className="w-3.5 h-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteMember(m.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
  );
}
