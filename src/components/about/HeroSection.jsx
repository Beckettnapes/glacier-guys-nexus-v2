import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";

export default function HeroSection() {
  const [content, setContent] = useState({});

  useEffect(() => {
    db.SiteContent.list().then(records => {
      const map = {};
      records.forEach(r => { map[r.key] = r.value; });
      setContent(map);
    });
  }, []);

  const tagline = content.hero_tagline || "Sentinels of the North";
  const subtitle = content.hero_subtitle || "A local non-profit organization with global reach, dedicated to the preservation and restoration of our glaciers";

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/hero-image.jpg"
          alt="Dramatic aerial view of massive glacial ice shelf meeting dark arctic ocean"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}>
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-6">
            {tagline}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            <span className="text-foreground">GLACIER</span>
            <br />
            <span className="text-primary">GUYS</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-primary/60 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}