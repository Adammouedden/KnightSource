"use client";

import { CategoryCard } from '@/components/CategoryCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { motion } from 'framer-motion';
import { Scale, GraduationCap, Heart, Plane, Dumbbell } from 'lucide-react';

const categories = [
  {
    title: 'Legal',
    description: 'Free legal services, consultations, and assistance for UCF students.',
    href: '/legal',
    icon: Scale,
  },
  {
    title: 'Academics',
    description: 'Academic support services, tutoring, and educational resources.',
    href: '/academics',
    icon: GraduationCap,
  },
  {
    title: 'Healthcare',
    description: 'Take advantage of UCF health services and save on medical care.',
    href: '/healthcare',
    icon: Heart,
  },
  {
    title: 'Conferences',
    description: 'Travel grants and funding for academic conferences and professional development.',
    href: '/conferences',
    icon: Plane,
  },
  {
    title: 'Recreation',
    description: 'Fitness, wellness, and recreational facilities included with your tuition.',
    href: '/recreation',
    icon: Dumbbell,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden px-4">
      <Header />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Explore UCF Resources
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Browse five categories of benefits available to you as a UCF student.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CategoryCard {...category} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
