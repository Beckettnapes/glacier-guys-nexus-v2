import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Save, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_PILLARS = [
  { title: "Preservation", desc: "Every glacier we protect is a victory for the planet's future water supply and climate stability." },
  { title: "Transparency", desc: "Every dollar, every decision, every mission report — open to our community. Always." },
  { title: "Urgency", desc: "The clock is ticking. We act with the speed and precision the crisis demands." },
  { title: "Unity", desc: "From scientists to students, we believe everyone has a role in the fight for our frozen frontiers." },
];

export default function AdminPillars() {
  const [pillars, setPillars] = useState(DEFAULT_PILLARS);
  const [recordId, setRecordId] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const records = await db.SiteContent.list();
    const rec = records.find(r => r.key === "pillars");
    if (rec) {
      setRecordId(rec.id);
      try { setPillars(JSON.parse(rec.value)); } catch {}
    }
  }

  async function savePillars(updated) {
    setSaving(true);
    const val = JSON.stringify(updated);
    if (recordId) {
      await db.SiteContent.update(recordId, { key: "pillars", value: val });
    } else {
      const rec = await db.SiteContent.create({ key: "pillars", value: val });
      setRecordId(rec.id);
    }
    setPillars(updated);
    setSaving(false);
  }

  return (
    <div className="frost-glass rounded-xl p-6 border border-border space-y-4">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Pillars / Values</h3>
      {pillars.map((pillar, idx) => (
        <div key={idx} className="flex items-start gap-4 px-4 py-3 rounded-lg border border-border/50 hover:bg-secondary/20 transition-colors">
          {editIdx === idx ? (
            <div className="flex-1 space-y-2">
              <Input
                value={editItem.title}
                onChange={e => setEditItem(p => ({ ...p, title: e.target.value }))}
                className="h-8 bg-secondary border-border text-sm"
                placeholder="Title"
              />
              <textarea
                rows={2}
                value={editItem.desc}
                onChange={e => setEditItem(p => ({ ...p, desc: e.target.value }))}
                className="w-full rounded-md bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="Description"
              />
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-semibold text-sm">{pillar.title}</p>
              <p className="text-muted-foreground text-xs mt-1">{pillar.desc}</p>
            </div>
          )}
          <div className="flex items-center gap-1 flex-shrink-0">
            {editIdx === idx ? (
              <>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" disabled={saving} onClick={async () => {
                  const updated = pillars.map((p, i) => i === idx ? editItem : p);
                  await savePillars(updated);
                  setEditIdx(null);
                }}><Check className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setEditIdx(null)}><X className="w-4 h-4" /></Button>
              </>
            ) : (
              <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => { setEditIdx(idx); setEditItem({ ...pillar }); }}><Edit2 className="w-3.5 h-3.5" /></Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}