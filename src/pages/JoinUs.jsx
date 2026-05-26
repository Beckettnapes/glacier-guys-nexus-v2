import { useState } from "react";
import { db } from "@/api/supabaseClient";
import { motion } from "framer-motion";
import { CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const SKILLS = [
  "Social Media Management", "Photography", "Public Speaking", "Event Planning",
  "Fundraising", "Research", "Writing & Communications", "Graphic Design",
  "Videography", "Field / Outdoor Skills", "Education & Outreach", "Data Analysis",
];

const TIMES = [
  "Weekday Mornings", "Weekday Afternoons", "Weekday Evenings",
  "Weekend Mornings", "Weekend Afternoons", "Weekend Evenings", "Flexible / Anytime",
];

export default function JoinUs() {
  const [form, setForm]     = useState({ name: "", email: "", bio: "", location: "" });
  const [skills, setSkills] = useState([]);
  const [times, setTimes]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState("");

  const toggleItem = (list, setList, item) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    setLoading(true);
    setError("");
    try {
      await db.Member.create({
        ...form,
        specialties:     skills,
        preferred_times: times,
        status:          "Pending",
        joined_date:     new Date().toISOString().split("T")[0],
      });
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="frost-glass rounded-2xl p-12 text-center max-w-md shimmer-border"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">You're on the list!</h2>
          <p className="text-muted-foreground mb-8">
            Thanks for signing up, <span className="text-foreground font-semibold">{form.name}</span>. Our team will review your application and be in touch soon.
          </p>
          <Link to="/"><Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">Back to Home</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4">Join the Team</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Become a Glacier Guy</h1>
          <p className="text-muted-foreground text-lg mb-10">Fill out the form below and our team will review your application.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="frost-glass rounded-2xl p-8 shimmer-border space-y-8"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Info</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                <Input placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-secondary/50 border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-secondary/50 border-border" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Location</label>
              <Input placeholder="City, State / Country" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="bg-secondary/50 border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Short Bio</label>
              <textarea
                placeholder="Tell us a bit about yourself and why you want to join..."
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full rounded-md bg-secondary/50 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Skills</h3>
            <p className="text-xs text-muted-foreground">Select all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(skill => (
                <button key={skill} type="button" onClick={() => toggleItem(skills, setSkills, skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${skills.includes(skill) ? "bg-primary/20 border-primary/40 text-primary" : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"}`}>
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Preferred Times</h3>
            <p className="text-xs text-muted-foreground">When are you generally available?</p>
            <div className="flex flex-wrap gap-2">
              {TIMES.map(time => (
                <button key={time} type="button" onClick={() => toggleItem(times, setTimes, time)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${times.includes(time) ? "bg-primary/20 border-primary/40 text-primary" : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"}`}>
                  {time}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={loading} size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
            {loading ? "Submitting..." : (<><UserPlus className="w-4 h-4 mr-2" />Submit Application</>)}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
