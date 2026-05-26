import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import moment from "moment";

const CATEGORIES = ["Gear & Equipment", "Research Funding", "Transport & Logistics", "Education Programs", "Conservation Projects", "Emergency Relief"];

const empty = { donor_name: "", amount: "", category: "Research Funding", date: new Date().toISOString().split("T")[0], message: "", is_anonymous: false };

export default function AdminImpact() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newD, setNewD] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await db.Donation.list("-date");
    setDonations(data);
    setLoading(false);
  }

  async function addDonation() {
    if (!newD.amount || !newD.date) return;
    await db.Donation.create({ ...newD, amount: parseFloat(newD.amount) });
    setAdding(false);
    setNewD(empty);
    load();
  }

  async function saveDonation(id) {
    await db.Donation.update(id, { ...editData, amount: parseFloat(editData.amount) });
    setEditId(null);
    load();
  }

  async function deleteDonation(id) {
    if (!confirm("Delete this donation record?")) return;
    await db.Donation.delete(id);
    load();
  }

  const total = donations.reduce((s, d) => s + (d.amount || 0), 0);

  if (loading) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-32">
      {/* Summary */}
      <div className="flex gap-6">
        <div className="frost-glass rounded-xl px-6 py-4">
          <p className="text-3xl font-black text-primary">${total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Raised</p>
        </div>
        <div className="frost-glass rounded-xl px-6 py-4">
          <p className="text-3xl font-black text-foreground">{donations.length}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Donations</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setAdding(!adding)} className="bg-primary text-primary-foreground font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Donation
        </Button>
      </div>

      {adding && (
        <div className="frost-glass rounded-xl p-6 border border-primary/20 space-y-4">
          <h3 className="font-semibold text-foreground">New Donation Record</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Donor name (leave blank if anonymous)" value={newD.donor_name}
              onChange={e => setNewD({ ...newD, donor_name: e.target.value })} className="bg-secondary/50 border-border" />
            <Input type="number" placeholder="Amount ($)" value={newD.amount}
              onChange={e => setNewD({ ...newD, amount: e.target.value })} className="bg-secondary/50 border-border" />
            <Select value={newD.category} onValueChange={v => setNewD({ ...newD, category: v })}>
              <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={newD.date} onChange={e => setNewD({ ...newD, date: e.target.value })} className="bg-secondary/50 border-border" />
            <Input placeholder="Message (optional)" value={newD.message}
              onChange={e => setNewD({ ...newD, message: e.target.value })} className="bg-secondary/50 border-border sm:col-span-2" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={newD.is_anonymous} onChange={e => setNewD({ ...newD, is_anonymous: e.target.checked })} className="accent-primary" />
            Mark as anonymous
          </label>
          <div className="flex gap-2">
            <Button onClick={addDonation} size="sm" className="bg-primary text-primary-foreground">Save</Button>
            <Button onClick={() => setAdding(false)} size="sm" variant="ghost">Cancel</Button>
          </div>
        </div>
      )}

      <div className="frost-glass rounded-xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Donor</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-right px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-right px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id} className="border-b border-border/50 hover:bg-primary/[0.02] transition-colors">
                  <td className="px-5 py-3 text-foreground font-medium">
                    {editId === d.id ? (
                      <Input value={editData.donor_name || ""} onChange={e => setEditData({ ...editData, donor_name: e.target.value })}
                        className="h-8 bg-secondary border-border text-sm w-36" placeholder="Donor name" />
                    ) : (d.is_anonymous ? "Anonymous" : d.donor_name || "Anonymous")}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {editId === d.id ? (
                      <Select value={editData.category} onValueChange={v => setEditData({ ...editData, category: v })}>
                        <SelectTrigger className="h-8 w-44 bg-secondary border-border text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : d.category}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-primary font-semibold">
                    {editId === d.id ? (
                      <Input type="number" value={editData.amount} onChange={e => setEditData({ ...editData, amount: e.target.value })}
                        className="h-8 bg-secondary border-border text-sm w-28 ml-auto" />
                    ) : `$${(d.amount || 0).toLocaleString()}`}
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground">
                    {editId === d.id ? (
                      <Input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })}
                        className="h-8 bg-secondary border-border text-sm w-36 ml-auto" />
                    ) : (d.date ? moment(d.date).format("MMM D, YYYY") : "—")}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {editId === d.id ? (
                        <>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => saveDonation(d.id)}><Check className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => { setEditId(d.id); setEditData({ donor_name: d.donor_name || "", amount: d.amount, category: d.category, date: d.date }); }}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteDonation(d.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {donations.length === 0 && <p className="text-muted-foreground text-center py-8">No donations recorded yet.</p>}
        </div>
      </div>
    </div>
  );
}