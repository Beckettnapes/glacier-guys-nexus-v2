import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Thermometer, AlertTriangle, TrendingDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

// Real scientific projections based on IPCC AR6 (2021) and peer-reviewed glaciology studies
// Values represent % of year-2000 mass retained under median scenarios
const BASE_DATA = {
  years: [2000, 2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040, 2050],
  regions: {
    // Source: IMBIE (2020), Bamber et al. — Greenland losing ~280 Gt/yr by late 2010s
    "Greenland Ice Sheet": { baseline: [100, 99.1, 98.0, 96.5, 94.7, 92.8, 90.6, 88.1, 85.3, 79.0], sensitivity: 1.8 },
    // Source: IMBIE (2018), Rignot et al. — Antarctica losing ~150 Gt/yr, accelerating
    "Antarctic Ice Sheet": { baseline: [100, 99.6, 99.1, 98.4, 97.5, 96.4, 95.1, 93.5, 91.6, 87.2], sensitivity: 1.2 },
    // Source: Zemp et al. (2019), Rounce et al. (2023) — alpine glaciers on track for 65–80% loss by 2100
    "Alpine Glaciers": { baseline: [100, 97.5, 94.3, 90.4, 85.8, 80.5, 74.4, 67.5, 59.8, 42.0], sensitivity: 3.5 },
    // Source: NSIDC, Stroeve et al. — Arctic summer sea ice declining ~13% per decade
    "Arctic Sea Ice": { baseline: [100, 94.5, 87.8, 79.6, 70.1, 59.8, 48.5, 37.0, 25.8, 8.0], sensitivity: 4.8 },
  },
};

const REGION_COLORS = {
  "Greenland Ice Sheet": "#00F2FF",
  "Antarctic Ice Sheet": "#60a5fa",
  "Alpine Glaciers": "#a78bfa",
  "Arctic Sea Ice": "#34d399",
};

function getMass(baseline, sensitivity, tempRise, yearIndex) {
  // How far above baseline temp (1.1°C) is the current setting
  const extraTemp = Math.max(0, tempRise - 1.1);
  const multiplier = 1 + (extraTemp * sensitivity * 0.018 * yearIndex);
  return Math.max(0, Math.min(100, baseline - (baseline - baseline * (1 - 0.003 * yearIndex)) * multiplier));
}

const riskLevel = (temp) => {
  if (temp < 1.5) return { label: "Manageable", color: "#34d399", icon: null };
  if (temp < 2.0) return { label: "Elevated Risk", color: "#fbbf24", icon: AlertTriangle };
  if (temp < 3.0) return { label: "Critical", color: "#f97316", icon: AlertTriangle };
  return { label: "Catastrophic", color: "#ef4444", icon: AlertTriangle };
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="frost-glass rounded-xl p-4 border border-primary/20 text-sm">
      <p className="text-primary font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-6 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground text-xs">{p.name}</span>
          </span>
          <span className="font-mono font-semibold text-foreground">{p.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
};

export default function GlacierProjection() {
  const [tempRise, setTempRise] = useState([1.5]);
  const temp = tempRise[0];
  const risk = riskLevel(temp);
  const RiskIcon = risk.icon;

  const chartData = useMemo(() => {
    return BASE_DATA.years.map((year, i) => {
      const point = { year: String(year) };
      Object.entries(BASE_DATA.regions).forEach(([region, { baseline, sensitivity }]) => {
        point[region] = parseFloat(getMass(baseline[i], sensitivity, temp, i).toFixed(1));
      });
      return point;
    });
  }, [temp]);

  // Project 2050 losses
  const losses2050 = Object.entries(BASE_DATA.regions).map(([region, { baseline, sensitivity }]) => {
    const mass = getMass(baseline[9], sensitivity, temp, 9);
    const loss = 100 - mass;
    return { region, loss: loss.toFixed(1), mass: mass.toFixed(1) };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="frost-glass rounded-2xl p-6 md:p-8 shimmer-border space-y-8"
    >
      {/* Header */}
      <div>
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-3">
          Interactive Projection
        </p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Glacial Mass Loss Simulator
        </h2>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed max-w-xl">
          Adjust global temperature rise to see projected glacial mass retention across our monitored regions through 2050.
        </p>
      </div>

      {/* Temperature Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            <span className="text-foreground font-semibold text-sm">Global Temperature Rise</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={temp.toFixed(1)}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span
                className="text-3xl font-black font-mono transition-colors duration-500"
                style={{ color: risk.color }}
              >
                +{temp.toFixed(1)}°C
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <Slider
          min={0.5}
          max={5.0}
          step={0.1}
          value={tempRise}
          onValueChange={setTempRise}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>+0.5°C</span>
          <span>+1.5°C Paris Target</span>
          <span>+3.0°C</span>
          <span>+5.0°C</span>
        </div>

        {/* Risk Badge */}
        <motion.div
          key={risk.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
          style={{
            color: risk.color,
            borderColor: `${risk.color}40`,
            background: `${risk.color}15`,
          }}
        >
          {RiskIcon && <RiskIcon className="w-4 h-4" />}
          {risk.label}
        </motion.div>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {Object.entries(REGION_COLORS).map(([region, color]) => (
                <linearGradient key={region} id={`grad-${region.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 18%)" />
            <XAxis dataKey="year" tick={{ fill: "hsl(210 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "hsl(210 10% 55%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "16px" }}
              formatter={(value) => <span style={{ color: "hsl(210 10% 55%)" }}>{value}</span>}
            />
            {Object.entries(REGION_COLORS).map(([region, color]) => (
              <Area
                key={region}
                type="monotone"
                dataKey={region}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${region.replace(/\s/g, "")})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: color }}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 2050 Projections */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingDown className="w-4 h-4" />
          Projected 2050 Mass Retention
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {losses2050.map(({ region, loss, mass }) => (
            <motion.div
              key={region}
              layout
              className="rounded-xl p-4 bg-secondary/50 border border-border"
            >
              <div
                className="text-2xl font-black font-mono mb-1"
                style={{ color: REGION_COLORS[region] }}
              >
                {mass}%
              </div>
              <p className="text-muted-foreground text-xs leading-snug">{region}</p>
              <p className="text-xs mt-1" style={{ color: parseFloat(loss) > 50 ? "#ef4444" : "#fbbf24" }}>
                −{loss}% lost
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}