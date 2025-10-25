"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function CategoryCard({ title, description, href, icon: Icon }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href}>
        <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow cursor-pointer group">
          <div className="relative h-48 bg-gradient-to-br from-amber-500/20 to-amber-600/30 flex items-center justify-center">
            <Icon className="w-24 h-24 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-600 transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
