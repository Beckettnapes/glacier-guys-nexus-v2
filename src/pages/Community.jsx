import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { motion } from "framer-motion";
import { Users, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MemberCard from "../components/community/MemberCard";

export default function Community() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const data = await db.Member.list();
      setMembers(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = members.filter((m) => {
    const matchesSearch = !search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.location?.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = groupFilter === "all" || m.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const activeCount = members.filter(m => m.status === "Active").length;
  const expeditionCount = members.filter(m => m.status === "On Expedition").length;

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
              The Cohort
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              Our Network
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl">
              Every member is a node in our global mission. Connect, collaborate, and conquer.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            <div className="frost-glass rounded-xl px-6 py-4">
              <p className="text-3xl font-black text-primary">{members.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total</p>
            </div>
            <div className="frost-glass rounded-xl px-6 py-4">
              <p className="text-3xl font-black text-emerald-400">{activeCount}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Active</p>
            </div>
            <div className="frost-glass rounded-xl px-6 py-4">
              <p className="text-3xl font-black text-primary">{expeditionCount}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">On Expedition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-card border-border">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Leader">Leader</SelectItem>
              <SelectItem value="Co-Leader">Co-Leader</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No members found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}