"use client";

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function StatCard({ label, value, prefix = '', suffix = '', duration = 2000 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const isNumeric = typeof value === 'number';

  useEffect(() => {
    if (!isNumeric) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeOutQuart * (value as number)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, isNumeric]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 text-center hover:shadow-lg transition-shadow">
        <div className="text-4xl font-bold text-amber-600 mb-2">
          {prefix}
          {isNumeric ? displayValue.toLocaleString() : value}
          {suffix}
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {label}
        </div>
      </Card>
    </motion.div>
  );
}
