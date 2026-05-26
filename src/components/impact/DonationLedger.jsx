import { motion } from "framer-motion";
import moment from "moment";

const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_LABELS = ["Gold", "Silver", "Bronze"];
const MEDAL_STYLES = [
  "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  "border-slate-400/40 bg-slate-400/10 text-slate-300",
  "border-amber-700/40 bg-amber-700/10 text-amber-600",
];

export default function DonationLedger({ donations }) {
  // Group by category
  const byCategory = {};
  donations.forEach((d) => {
    if (!byCategory[d.category]) byCategory[d.category] = 0;
    byCategory[d.category] += d.amount || 0;
  });

  const totalRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Top 3 donors by amount
  const topDonors = [...donations]
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Top Donors */}
      {topDonors.length > 0 && (
        <div>
          <h3 className="text-foreground font-semibold text-lg mb-4">Top Donors</h3>
          <div className="flex flex-col gap-3">
            {topDonors.map((d, i) => (
              <div key={d.id} className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${MEDAL_STYLES[i]}`}>
                <span className="text-2xl">{MEDALS[i]}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">
                    {d.is_anonymous ? "Anonymous" : (d.donor_name || "Anonymous")}
                  </p>
                  <p className="text-xs text-muted-foreground">{MEDAL_LABELS[i]} Donor</p>
                </div>
                <p className="font-black font-mono text-lg">${(d.amount || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allocation breakdown */}
      <div>
        <h3 className="text-foreground font-semibold text-lg mb-6">Recent Contributions</h3>
        <div className="frost-glass rounded-xl overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">Donor</th>
                  <th className="text-left px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">Category</th>
                  <th className="text-right px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">Amount</th>
                  <th className="text-right px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 20).map((d, i) => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-primary/[0.03] transition-colors">
                    <td className="px-5 py-3 text-foreground font-medium">
                      {d.is_anonymous ? "Anonymous" : (d.donor_name || "Anonymous")}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{d.category}</td>
                    <td className="px-5 py-3 text-right font-mono text-primary font-semibold">
                      ${(d.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {d.date ? moment(d.date).format("MMM D, YYYY") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {donations.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No donations recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}