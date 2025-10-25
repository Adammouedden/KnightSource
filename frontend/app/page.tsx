"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/StatCard';
import { SavingsEstimator } from '@/components/SavingsEstimator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/content/stats.json')
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col px-4">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white dark:from-gray-950 dark:to-background py-20 md:py-32">
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                Unlock Every{' '}
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  UCF Benefit
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                See all the resources available to you and how much you're leaving on the table.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8">
                  <Link href="/home">
                    Explore Resources
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8">
                  <a href="#savings-estimator">Calculate My Savings</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-16 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-3xl" />
              <div className="relative bg-card border-2 border-amber-200 dark:border-amber-800 rounded-3xl p-8 shadow-2xl">
                <svg
                  className="w-full h-64"
                  viewBox="0 0 800 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="100" cy="100" r="60" fill="currentColor" className="text-amber-500/20" />
                  <circle cx="300" cy="80" r="40" fill="currentColor" className="text-amber-600/30" />
                  <circle cx="500" cy="120" r="50" fill="currentColor" className="text-orange-500/20" />
                  <circle cx="700" cy="90" r="45" fill="currentColor" className="text-amber-500/25" />
                  <path
                    d="M 100 140 Q 200 60, 300 120 T 500 70 T 700 135"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-amber-600"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </section>

        {stats && (
          <section className="py-20 bg-background" id="stats">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold mb-4">The Numbers Speak</h2>
                <p className="text-xl text-muted-foreground">
                  Real value for UCF students
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <StatCard
                  label="Total Resources"
                  value={stats.totalResources}
                  suffix="+"
                />
                <StatCard
                  label="Avg. Savings per Student"
                  value={stats.avgSavingsPerStudent}
                  prefix="$"
                />
                <StatCard
                  label="Resource Categories"
                  value={stats.topCategories}
                />
                <StatCard
                  label="Time to First Win"
                  value={stats.timeToFirstWin}
                />
              </div>

              <div id="savings-estimator" className="max-w-2xl mx-auto">
                <SavingsEstimator estimatorConfig={stats.savingsEstimator} />
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-muted/50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground">
                Three simple steps to start saving
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Browse Resources',
                  description: 'Explore five categories of UCF benefits organized for easy discovery.',
                },
                {
                  step: '2',
                  title: 'Learn the Details',
                  description: 'See exactly what each resource offers, how to access it, and its financial value.',
                },
                {
                  step: '3',
                  title: 'Start Saving',
                  description: 'Take action on resources that matter to you and maximize your UCF experience.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

         <section className="py-20 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Trusted On Campus</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Built by students, for students
              </p>
              <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
                <div className="px-6 py-3 bg-muted rounded-lg font-semibold">UCF</div>
                <div className="px-6 py-3 bg-muted rounded-lg font-semibold">Student Resources</div>
                <div className="px-6 py-3 bg-muted rounded-lg font-semibold">Campus Life</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center mt-16"
            >
              <h3 className="text-3xl font-bold mb-6">Ready to unlock your benefits?</h3>
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-12">
                <Link href="/home">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
