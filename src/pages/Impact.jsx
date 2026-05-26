import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { motion } from "framer-motion";
import ImpactStats from "../components/impact/ImpactStats";
import GlacierProjection from "../components/impact/GlacierProjection";
import DonationLedger from "../components/impact/DonationLedger";
import DonateWidget from "../components/impact/DonateWidget";

export default function Impact() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.Donation.list("-date");
      setDonations(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              The Core
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              Impact & Donations
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl">
              Complete transparency. Every dollar tracked, every mission funded.
            </p>
          </motion.div>

          {/* Stats */}
          {!loading && (
            <div className="mt-10">
              <ImpactStats donations={donations} />
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-48">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-12">
              <GlacierProjection />
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 min-w-0">
                  <DonationLedger donations={donations} />
                </div>
                <div className="w-full">
                  <DonateWidget />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}