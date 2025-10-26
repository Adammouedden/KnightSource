"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data - in a real application, this would come from your database
const mockData = {
  userGrowth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [30, 45, 57, 75, 92, 108],
        fill: false,
        borderColor: 'rgb(217, 119, 6)',
        tension: 0.1,
      },
    ],
  },
  resourceUsage: {
    labels: ['Legal', 'Academics', 'Healthcare', 'Conferences', 'Recreation'],
    datasets: [
      {
        label: 'Resource Access Count',
        data: [254, 378, 192, 145, 223],
        backgroundColor: [
          'rgba(217, 119, 6, 0.6)',
          'rgba(202, 138, 4, 0.6)',
          'rgba(234, 88, 12, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(245, 158, 11, 0.6)',
        ],
      },
    ],
    
  },
  userDistribution: {
    labels: ['Students', 'Faculty', 'Staff', 'Alumni'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgba(217, 119, 6, 0.6)',
          'rgba(234, 88, 12, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(245, 158, 11, 0.6)',
        ],
      },
    ],
  },
  
};
// Example budget + expenditure data
const budgets = [
  { category: 'Legal',      budget: 651445, spent: 603348.97 },
  { category: 'Academics',  budget: 1838427, spent: 1484684.87 },
  { category: 'Healthcare', budget: 8300000, spent: 4000000},
  { category: 'Conferences',budget: 510000, spent: 488174.19},
  { category: 'Recreation', budget: 6573670, spent: 5220458.20 },
];

const resourceLabels = budgets.map(b => b.category);
const totalBudgetData = budgets.map(b => b.budget);
const remainingData   = budgets.map(b => Math.max(b.budget - b.spent, 0));
// helper
const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

const resourceUsageOverlay = {
  labels: resourceLabels,
  datasets: [
    {
      label: 'Total Budget',
      data: totalBudgetData,
      backgroundColor: 'rgba(194, 154, 43, 0.3)', // gray base bar
      borderRadius: 8,
      barThickness: 36,
      order: 1,
      borderSkipped: false,
    },
    {
      label: 'Remaining',
      data: remainingData,
      backgroundColor: 'rgba(217,119,6,0.9)', // UCF gold color
      borderRadius: 8,
      barThickness: 36,
      order: 2,
      borderSkipped: false,
    },
  ],
};

const resourceUsageOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    tooltip: {
      callbacks: {
        title: (items: any[]) => items[0]?.label ?? '',
        afterLabel: (ctx: any) => {
          const i = ctx.dataIndex;
          const b = budgets[i];
          const remaining = Math.max(b.budget - b.spent, 0);
          const lines = [
            `Budget: $${b.budget.toLocaleString()}`,
            `Spent: $${b.spent.toLocaleString()}`,
            `Remaining: $${remaining.toLocaleString()}`,
          ];
          return lines;
        },
        label: () => '',
      },
    },
  },
  
  scales: {
  x: {
    grid: { display: false },
    ticks: {
      // show: "Category (Remaining)"
      callback: (_value: any, index: number) => {
        const label = resourceLabels[index];
        const rem = remainingData[index];
        return [`${label}`, `(${fmt(rem)})`];
      },
      maxRotation: 0, // keep labels horizontal
      autoSkip: false
    },
  },
  y: {
    beginAtZero: false,
    min: 0,
    ticks: { callback: (v: any) => `$${Number(v).toLocaleString()}` },
  },
}
,
};

export default function VisualizationsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container px-4">
        <Header />
      <h1 className="text-3xl font-bold mb-8">Data Visualizations</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Line 
              data={mockData.userGrowth}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2024-2025 Budget vs Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={resourceUsageOverlay} options={resourceUsageOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}