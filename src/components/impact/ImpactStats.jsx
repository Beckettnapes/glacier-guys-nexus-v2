import { motion } from "framer-motion";

export default function ImpactStats({ donations }) {
  const totalRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalDonors = new Set(donations.filter(d => !d.is_anonymous).map(d => d.donor_name)).size;

  return (
    <div className="flex flex-wrap gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="frost-glass rounded-xl px-8 py-6 glow-cyan"
      >
        <p className="text-4xl md:text-5xl font-black text-primary">
          ${totalRaised.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2">Total Raised</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="frost-glass rounded-xl px-8 py-6"
      >
        <p className="text-4xl md:text-5xl font-black text-foreground">
          {donations.length}
        </p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2">Donations</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="frost-glass rounded-xl px-8 py-6"
      >
        <p className="text-4xl md:text-5xl font-black text-foreground">
          {totalDonors}
        </p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2">Unique Donors</p>
      </motion.div>
    </div>
  );
}