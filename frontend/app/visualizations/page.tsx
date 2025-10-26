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
            <CardTitle>Resource Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar 
              data={mockData.resourceUsage}
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-1/2">
              <Doughnut 
                data={mockData.userDistribution}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}