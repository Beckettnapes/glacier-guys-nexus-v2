import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";

const DEFAULT_MILESTONES = [
{ year: "2018", title: "The Beginning", desc: "Founded by a group of glaciologists and mountaineers in Anchorage, Alaska." },
{ year: "2019", title: "First Expedition", desc: "Documented the retreat of 12 glaciers in the Chugach Range." },
{ year: "2020", title: "Going Digital", desc: "Launched remote monitoring programs during global lockdowns." },
{ year: "2021", title: "100 Members", desc: "Expanded to chapters across North America and Scandinavia." },
{ year: "2022", title: "$50K Raised", desc: "Funded two major research grants for Arctic ice-core analysis." },
{ year: "2023", title: "Global Network", desc: "Partnered with indigenous communities for grassroots conservation." },
{ year: "2024", title: "The Surge", desc: "Deployed emergency response teams to record glacier calving events." }
];


export default function Timeline() {
  const scrollRef = useRef(null);
  const [milestones, setMilestones] = useState(DEFAULT_MILESTONES);

  useEffect(() => {
    db.SiteContent.list().then(records => {
      const rec = records.find(r => r.key === "timeline_items");
      if (rec) { try { setMilestones(JSON.parse(rec.value)); } catch {} }
    });
  }, []);

  return (
    <section className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12">
          
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Our Journey
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Core Sample
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Each layer tells a story of progress.
          </p>
        </motion.div>

        <div ref={scrollRef} className="overflow-x-auto pb-8 -mx-6 px-6 scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {milestones.map((m, i) =>
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-72 flex-shrink-0">
              
                <div className="frost-glass rounded-xl p-6 h-full shimmer-border hover:glow-cyan transition-all duration-500 group">
                  <span className="text-primary text-4xl font-black tracking-tighter">
                    {m.year}
                  </span>
                  <h3 className="text-foreground mt-4 mb-2 text-lg font-semibold normal-case">
                    {m.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}