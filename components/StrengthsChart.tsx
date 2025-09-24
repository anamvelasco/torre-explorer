// components/StrengthsChart.tsx
"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

type Item = { name: string; value: number };
export default function StrengthsChart({ data }: { data: Item[] }) {
  const safe = (data || []).map((d) => ({
    name: d?.name ?? "",
    value: Number(d?.value ?? 0),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={safe}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <Radar dataKey="value" fillOpacity={0.4} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}
