"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface SavingsEstimatorProps {
  estimatorConfig: {
    baseValue: number;
    classYearMultipliers: {
      freshman: number;
      sophomore: number;
      junior: number;
      senior: number;
    };
    housingBonus: number;
    insuranceBonus: number;
  };
}

export function SavingsEstimator({ estimatorConfig }: SavingsEstimatorProps) {
  const [classYear, setClassYear] = useState<string>('');
  const [housing, setHousing] = useState<string>('');
  const [insurance, setInsurance] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculateSavings = () => {
    if (!classYear || !housing || !insurance) return;

    let total = estimatorConfig.baseValue;

    total *= estimatorConfig.classYearMultipliers[classYear as keyof typeof estimatorConfig.classYearMultipliers];

    if (housing === 'on-campus') {
      total += estimatorConfig.housingBonus;
    }

    if (insurance === 'no') {
      total += estimatorConfig.insuranceBonus;
    }

    setResult(Math.round(total));
  };

  const isComplete = classYear && housing && insurance;

  return (
    <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-amber-600" />
        <h3 className="text-2xl font-bold">Estimate Your Savings</h3>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block">Class Year</Label>
          <RadioGroup value={classYear} onValueChange={setClassYear}>
            <div className="grid grid-cols-2 gap-3">
              {['freshman', 'sophomore', 'junior', 'senior'].map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <RadioGroupItem value={year} id={year} />
                  <Label htmlFor={year} className="capitalize cursor-pointer">
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">Housing</Label>
          <RadioGroup value={housing} onValueChange={setHousing}>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="on-campus" id="on-campus" />
                <Label htmlFor="on-campus" className="cursor-pointer">On Campus</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="off-campus" id="off-campus" />
                <Label htmlFor="off-campus" className="cursor-pointer">Off Campus</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">Do you have health insurance?</Label>
          <RadioGroup value={insurance} onValueChange={setInsurance}>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="insurance-yes" />
                <Label htmlFor="insurance-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="insurance-no" />
                <Label htmlFor="insurance-no" className="cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={calculateSavings}
          disabled={!isComplete}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-6 text-lg"
        >
          Calculate My Savings
        </Button>

        <AnimatePresence>
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border-2 border-amber-400"
            >
              <p className="text-sm text-muted-foreground mb-2">You could save up to</p>
              <p className="text-5xl font-bold text-amber-600 mb-2">
                ${result.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">per year with UCF resources</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
