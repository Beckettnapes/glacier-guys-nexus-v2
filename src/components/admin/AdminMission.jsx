import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Save, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULTS = {
  hero_tagline: "Sentinels of the North",
  hero_subtitle: "A local non-profit organization with global reach, dedicated to the preservation and restoration of our glaciers",
  mission_heading: "Defending the frozen frontiers that sustain our planet",
  mission_body_1: "",
  mission_body_2: "",
};

const DEFAULT_TIMELINE = [
  { year: "2018", title: "The Beginning", desc: "Founded by a group of glaciologists and mountaineers in Anchorage, Alaska." },
  { year: "2019", title: "First Expedition", desc: "Documented the retreat of 12 glaciers in the Chugach Range." },
  { year: "2020", title: "Going Digital", desc: "Launched remote monitoring programs during global lockdowns." },
  { year: "2021", title: "100 Members", desc: "Expanded to chapters across North America and Scandinavia." },
  { year: "2022", title: "$50K Raised", desc: "Funded two major research grants for Arctic ice-core analysis." },
  { year: "2023", title: "Global Network", desc: "Partnered with indigenous communities for grassroots conservation." },
  { year: "2024", title: "The Surge", desc: "Deployed emergency response teams to record glacier calving events." },
];

async function getOrCreate(records, key, defaultValue) {
  const existing = records.find(r => r.key === key);
  if (existing) return existing;
  return await db.SiteContent.create({ key, value: defaultValue });
}

export default function AdminMission() {
  const [records, setRecords] = useState({});
  const [recordIds, setRecordIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [timelineRecordId, setTimelineRecordId] = useState(null);
  const [editTimelineIdx, setEditTimelineIdx] = useState(null);
  const [editTimelineItem, setEditTimelineItem] = useState({});
  const [addingTimeline, setAddingTimeline] = useState(false);
  const [newTimelineItem, setNewTimelineItem] = useState({ year: "", title: "", desc: "" });

  useEffect(() => { load(); }, []);

  async function load() {
    const all = await db.SiteContent.list();
    const ids = {};
    const vals = {};
    for (const key of Object.keys(DEFAULTS)) {
      const rec = all.find(r => r.key === key);
      if (rec) {
        ids[key] = rec.id;
        vals[key] = rec.value;
      } else {
        vals[key] = DEFAULTS[key];
      }
    }
    setRecords(vals);
    setRecordIds(ids);

    const timelineRec = all.find(r => r.key === "timeline_items");
    if (timelineRec) {
      setTimelineRecordId(timelineRec.id);
      try { setTimeline(JSON.parse(timelineRec.value)); } catch { setTimeline(DEFAULT_TIMELINE); }
    } else {
      setTimeline(DEFAULT_TIMELINE);
    }
    setLoading(false);
  }

  async function saveField(key) {
    setSaving(s => ({ ...s, [key]: true }));
    if (recordIds[key]) {
      await db.SiteContent.update(recordIds[key], { key, value: records[key] });
    } else {
      const rec = await db.SiteContent.create({ key, value: records[key] });
      setRecordIds(ids => ({ ...ids, [key]: rec.id }));
    }
    setSaving(s => ({ ...s, [key]: false }));
  }

  async function saveTimeline(newTimeline) {
    const jsonVal = JSON.stringify(newTimeline);
    if (timelineRecordId) {
      await db.SiteContent.update(timelineRecordId, { key: "timeline_items", value: jsonVal });
    } else {
      const rec = await db.SiteContent.create({ key: "timeline_items", value: jsonVal });
      setTimelineRecordId(rec.id);
    }
    setTimeline(newTimeline);
  }

  function TextField({ label, fieldKey, multiline }) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {multiline ? (
          <textarea
            rows={4}
            value={records[fieldKey] || ""}
            onChange={e => setRecords(r => ({ ...r, [fieldKey]: e.target.value }))}
            className="w-full rounded-md bg-secondary/50 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        ) : (
          <Input
            value={records[fieldKey] || ""}
            onChange={e => setRecords(r => ({ ...r, [fieldKey]: e.target.value }))}
            className="bg-secondary/50 border-border"
          />
        )}
        <Button size="sm" onClick={() => saveField(fieldKey)} disabled={saving[fieldKey]} className="bg-primary text-primary-foreground">
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {saving[fieldKey] ? "Saving..." : "Save"}
        </Button>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-12 pb-32">

      {/* Hero Section */}
      <section className="frost-glass rounded-xl p-6 border border-border space-y-6">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Hero Section</h3>
        <TextField label="Tagline (above the title)" fieldKey="hero_tagline" />
        <TextField label="Subtitle / Description" fieldKey="hero_subtitle" multiline />
      </section>

      {/* Mission Statement */}
      <section className="frost-glass rounded-xl p-6 border border-border space-y-6">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Mission Statement</h3>
        <TextField label="Heading" fieldKey="mission_heading" />
        <TextField label="Body — Left Column" fieldKey="mission_body_1" multiline />
        <TextField label="Body — Right Column" fieldKey="mission_body_2" multiline />
      </section>

      {/* Timeline */}
      <section className="frost-glass rounded-xl p-6 border border-border space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Timeline / Core Sample</h3>
          <Button size="sm" onClick={() => setAddingTimeline(true)} className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-1.5" /> Add Milestone
          </Button>
        </div>

        {addingTimeline && (
          <div className="frost-glass rounded-lg p-4 border border-primary/20 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Year (e.g. 2025)" value={newTimelineItem.year} onChange={e => setNewTimelineItem(n => ({ ...n, year: e.target.value }))} className="bg-secondary/50 border-border" />
              <Input placeholder="Title" value={newTimelineItem.title} onChange={e => setNewTimelineItem(n => ({ ...n, title: e.target.value }))} className="bg-secondary/50 border-border" />
              <textarea placeholder="Description" rows={2} value={newTimelineItem.desc} onChange={e => setNewTimelineItem(n => ({ ...n, desc: e.target.value }))}
                className="sm:col-span-2 w-full rounded-md bg-secondary/50 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => {
                if (!newTimelineItem.year || !newTimelineItem.title) return;
                const updated = [...timeline, newTimelineItem];
                saveTimeline(updated);
                setAddingTimeline(false);
                setNewTimelineItem({ year: "", title: "", desc: "" });
              }}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setAddingTimeline(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 px-4 py-3 rounded-lg border border-border/50 hover:bg-secondary/20 transition-colors">
              {editTimelineIdx === idx ? (
                <div className="flex-1 space-y-2">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <Input value={editTimelineItem.year} onChange={e => setEditTimelineItem(i => ({ ...i, year: e.target.value }))} className="h-8 bg-secondary border-border text-sm" placeholder="Year" />
                    <Input value={editTimelineItem.title} onChange={e => setEditTimelineItem(i => ({ ...i, title: e.target.value }))} className="h-8 bg-secondary border-border text-sm" placeholder="Title" />
                  </div>
                  <textarea rows={2} value={editTimelineItem.desc} onChange={e => setEditTimelineItem(i => ({ ...i, desc: e.target.value }))}
                    className="w-full rounded-md bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <span className="text-primary font-bold text-sm mr-3">{item.year}</span>
                  <span className="text-foreground font-medium text-sm">{item.title}</span>
                  <p className="text-muted-foreground text-xs mt-1">{item.desc}</p>
                </div>
              )}
              <div className="flex items-center gap-1 flex-shrink-0">
                {editTimelineIdx === idx ? (
                  <>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => {
                      const updated = timeline.map((t, i) => i === idx ? editTimelineItem : t);
                      saveTimeline(updated);
                      setEditTimelineIdx(null);
                    }}><Check className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setEditTimelineIdx(null)}><X className="w-4 h-4" /></Button>
                  </>
                ) : (
                  <>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => { setEditTimelineIdx(idx); setEditTimelineItem({ ...item }); }}><Edit2 className="w-3.5 h-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => {
                      if (!confirm("Delete this milestone?")) return;
                      saveTimeline(timeline.filter((_, i) => i !== idx));
                    }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}