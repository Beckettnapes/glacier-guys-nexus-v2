import { motion } from "framer-motion";

const statusColors = {
  Active: "bg-emerald-500",
  "On Expedition": "bg-primary",
  Inactive: "bg-muted-foreground",
};

export default function MemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="frost-glass rounded-xl overflow-hidden shimmer-border hover:glow-cyan transition-all duration-500 group"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-primary">
                  {member.name?.charAt(0)}
                </span>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${statusColors[member.status] || "bg-muted-foreground"}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground font-semibold text-base truncate">{member.name}</h3>
            <p className="text-primary text-xs font-medium tracking-wide uppercase mt-0.5">
              {member.role}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {member.group}
            </p>
          </div>
        </div>
        {member.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {member.specialties.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}