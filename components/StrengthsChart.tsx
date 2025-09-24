"use client";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function StrengthsChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid />
        <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar dataKey="value" stroke="#000" fill="#000" fillOpacity={0.15} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
