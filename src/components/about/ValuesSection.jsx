import { motion } from "framer-motion";
import { Shield, Eye, Flame, Handshake } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";

const DEFAULT_PILLARS = [
  { title: "Preservation", desc: "Every glacier we protect is a victory for the planet's future water supply and climate stability." },
  { title: "Transparency", desc: "Every dollar, every decision, every mission report — open to our community. Always." },
  { title: "Urgency", desc: "The clock is ticking. We act with the speed and precision the crisis demands." },
  { title: "Unity", desc: "From scientists to students, we believe everyone has a role in the fight for our frozen frontiers." },
];

const ICONS = [Shield, Eye, Flame, Handshake];

export default function ValuesSection() {
  const [pillars, setPillars] = useState(DEFAULT_PILLARS);

  useEffect(() => {
    db.SiteContent.list().then(records => {
      const rec = records.find(r => r.key === "pillars");
      if (rec) { try { setPillars(JSON.parse(rec.value)); } catch {} }
    });
  }, []);

  return (
    <section className="py-24 md:py-36 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            What We Stand For
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Our Pillars
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((v, i) => {
            const Icon = ICONS[i] || Shield;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="frost-glass rounded-xl p-8 shimmer-border hover:glow-cyan transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-foreground font-semibold text-lg mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}