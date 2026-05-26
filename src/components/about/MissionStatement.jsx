import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";

export default function MissionStatement() {
  const [content, setContent] = useState({});

  useEffect(() => {
    db.SiteContent.list().then(records => {
      const map = {};
      records.forEach(r => { map[r.key] = r.value; });
      setContent(map);
    });
  }, []);

  const heading = content.mission_heading || "Defending the frozen frontiers that sustain our planet";
  const body1 = content.mission_body_1 || "";
  const body2 = content.mission_body_2 || "";

  return (
    <section className="py-24 md:py-36 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-12">
          
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Our Mission
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {heading.split(" sustain our planet")[0]}
              {heading.includes("sustain our planet") && <span className="text-primary"> sustain our planet</span>}
            </h2>
          </div>

          {(body1 || body2) && (
            <div className="grid md:grid-cols-2 gap-8">
              {body1 && <p className="text-muted-foreground text-lg leading-relaxed">{body1}</p>}
              {body2 && <p className="text-muted-foreground text-lg leading-relaxed">{body2}</p>}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}