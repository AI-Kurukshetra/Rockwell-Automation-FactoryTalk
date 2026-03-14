"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { ChartCard } from "@/components/charts/ChartCard";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type EquipmentStatusChartProps = {
  online: number;
  maintenance: number;
  offline: number;
};

export function EquipmentStatusChart({
  online,
  maintenance,
  offline,
}: EquipmentStatusChartProps) {
  const data = {
    labels: ["Online", "Maintenance", "Offline"],
    datasets: [
      {
        label: "Assets",
        data: [online, maintenance, offline],
        backgroundColor: ["#10b981", "#f59e0b", "#64748b"],
        borderRadius: 8,
        barThickness: 22,
      },
    ],
  };

  return (
    <ChartCard title="Equipment" subtitle="Status distribution">
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { display: false },
            },
            y: {
              grid: { color: "rgba(148,163,184,0.2)" },
              ticks: { precision: 0 },
            },
          },
        }}
      />
    </ChartCard>
  );
}
