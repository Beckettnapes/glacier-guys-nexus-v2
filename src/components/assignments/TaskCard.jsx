import { motion } from "framer-motion";
import { Clock, User, Target } from "lucide-react";
import moment from "moment";

const priorityStyles = {
  "Critical": "text-accent border-accent/30 bg-accent/10",
  "High": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "Medium": "text-primary border-primary/30 bg-primary/10",
  "Low": "text-muted-foreground border-muted/50 bg-muted/10",
};

const categoryIcons = {
  "Research": "🔬",
  "Outreach": "📡",
  "Fundraising": "💰",
  "Field Work": "🏔️",
  "Education": "📚",
  "Advocacy": "📢",
};

export default function TaskCard({ task, index }) {
  const progress = task.progress || 0;
  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="frost-glass rounded-xl p-6 shimmer-border hover:glow-cyan transition-all duration-500 group"
    >
      <div className="flex items-start gap-5">
        {/* Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg className="w-[72px] h-[72px] -rotate-90" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="32" fill="none" stroke="hsl(210 15% 18%)" strokeWidth="3" />
            <circle
              cx="36" cy="36" r="32" fill="none"
              stroke="hsl(185 100% 50%)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-foreground">{progress}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{categoryIcons[task.category] || "📋"}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${priorityStyles[task.priority] || priorityStyles["Medium"]}`}>
              {task.priority || "Medium"}
            </span>
          </div>
          <h3 className="text-foreground font-semibold text-base leading-snug mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {task.due_date && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {moment(task.due_date).format("MMM D")}
              </span>
            )}
            {task.assigned_to && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {task.assigned_to}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {task.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}