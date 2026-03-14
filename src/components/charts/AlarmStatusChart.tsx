"use client";

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { ChartCard } from "@/components/charts/ChartCard";

ChartJS.register(ArcElement, Tooltip, Legend);

type AlarmStatusChartProps = {
  active: number;
  acknowledged: number;
  resolved: number;
};

export function AlarmStatusChart({
  active,
  acknowledged,
  resolved,
}: AlarmStatusChartProps) {
  const data = {
    labels: ["Active", "Acknowledged", "Resolved"],
    datasets: [
      {
        data: [active, acknowledged, resolved],
        backgroundColor: ["#ef4444", "#3b82f6", "#10b981"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <ChartCard title="Alarms" subtitle="Status mix">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 10, usePointStyle: true },
            },
          },
        }}
      />
    </ChartCard>
  );
}
