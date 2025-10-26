"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Info } from "lucide-react";

type Role = "individual" | "rso" | "";

type CategoryType = "fixed" | "range" | "byRole";

interface CategoryConfig {
  id:
    | "legal"
    | "healthcare"
    | "crt"
    | "academics"
    | "recreation"
    | "discounts";
  label: string;
  emoji?: string;
  type: CategoryType;
  /** for type: fixed */
  value?: number;
  /** for type: range */
  min?: number;
  max?: number;
  /** for type: byRole (CRT) */
  byRole?: {
    individual: number;
    rso: number;
  };
  /** optional deep link to your resource page */
  href?: string;
}

interface EstimatorConfig {
  categories: CategoryConfig[];
}

interface SavingsEstimatorProps {
  estimatorConfig: EstimatorConfig;
}

function formatUSD(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function SavingsEstimator({ estimatorConfig }: SavingsEstimatorProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [role, setRole] = useState<Role>(""); // required when CRT selected
  const [result, setResult] = useState<{
    min: number;
    max: number;
    mid: number;
    breakdown: { id: string; label: string; min: number; max: number }[];
  } | null>(null);

  const categories = estimatorConfig.categories;

  // Derived state: which categories are selected
  const selectedCategories = useMemo(
    () => categories.filter((c) => selected[c.id]),
    [selected, categories]
  );

  const requiresRole = selectedCategories.some((c) => c.id === "crt");
  const canCalculate =
    selectedCategories.length > 0 && (!requiresRole || role !== "");

  const handleToggle = (id: string, checked: boolean | string) => {
    setSelected((prev) => ({ ...prev, [id]: Boolean(checked) }));
  };

  const calculate = () => {
    if (!canCalculate) return;

    let totalMin = 0;
    let totalMax = 0;
    const breakdown: { id: string; label: string; min: number; max: number }[] =
      [];

    for (const c of selectedCategories) {
      let cMin = 0;
      let cMax = 0;

      if (c.type === "fixed" && typeof c.value === "number") {
        cMin = c.value;
        cMax = c.value;
      } else if (c.type === "range" && typeof c.min === "number" && typeof c.max === "number") {
        cMin = c.min;
        cMax = c.max;
      } else if (c.type === "byRole" && c.byRole) {
        // If CRT is selected, role must be chosen; already enforced by canCalculate
        cMin = cMax = role === "rso" ? c.byRole.rso : c.byRole.individual;
      }

      totalMin += cMin;
      totalMax += cMax;
      breakdown.push({ id: c.id, label: c.label, min: cMin, max: cMax });
    }

    const mid = Math.round((totalMin + totalMax) / 2);
    setResult({
      min: Math.round(totalMin),
      max: Math.round(totalMax),
      mid,
      breakdown,
    });
  };

  const reset = () => {
    setSelected({});
    setRole("");
    setResult(null);
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-amber-600" />
        <h3 className="text-2xl font-bold">Estimate Your Student Benefits</h3>
      </div>

      <div className="space-y-8">
        {/* Category selection */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Which types of resources are you interested in?
          </Label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 rounded-xl border bg-card/50 p-3 cursor-pointer hover:bg-card transition"
              >
                <Checkbox
                  checked={!!selected[c.id]}
                  onCheckedChange={(v) => handleToggle(c.id, v)}
                  id={`cat-${c.id}`}
                />
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    <span aria-hidden>{c.emoji ?? "•"}</span>
                    {c.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {c.type === "fixed" && typeof c.value === "number" && (
                      <span>{formatUSD(c.value)} potential value</span>
                    )}
                    {c.type === "range" &&
                      typeof c.min === "number" &&
                      typeof c.max === "number" && (
                        <span>
                          {formatUSD(c.min)}–{formatUSD(c.max)} potential value
                        </span>
                      )}
                    {c.type === "byRole" && c.byRole && (
                      <span>
                        {formatUSD(c.byRole.individual)} (Individual) /{" "}
                        {formatUSD(c.byRole.rso)} (RSO)
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Role selection (only needed if CRT picked) */}
        <div aria-live="polite">
          <div className="flex items-center gap-2 mb-3">
            <Label className="text-base font-semibold block">
              Are you an individual student or representing an RSO?
            </Label>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>

          <RadioGroup
            value={role}
            onValueChange={(v) => setRole(v as Role)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <label className="flex items-center gap-2 rounded-xl border bg-card/50 p-3 cursor-pointer hover:bg-card transition">
              <RadioGroupItem value="individual" id="role-individual" />
              <span>Individual</span>
            </label>
            <label className="flex items-center gap-2 rounded-xl border bg-card/50 p-3 cursor-pointer hover:bg-card transition">
              <RadioGroupItem value="rso" id="role-rso" />
              <span>RSO / organization</span>
            </label>
          </RadioGroup>

          {requiresRole && role === "" && (
            <p className="text-xs text-amber-700 mt-2">
              Selecting **Travel (CRT)** requires choosing Individual or RSO.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={calculate}
            disabled={!canCalculate}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-6 text-lg"
          >
            Calculate My Savings
          </Button>
          <Button variant="outline" onClick={reset} className="py-6">
            Reset
          </Button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-gray-950 rounded-2xl p-6 border-2 border-amber-400"
            >
              <p className="text-sm text-muted-foreground mb-2">
                You could save approximately
              </p>
              <p className="text-5xl font-bold text-amber-600 mb-1">
                {formatUSD(result.mid)}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Estimated range: {formatUSD(result.min)}–{formatUSD(result.max)}{" "}
                this year with UCF programs
              </p>

              <div className="text-left">
                <h4 className="font-semibold mb-2">Breakdown</h4>
                <ul className="space-y-1 text-sm">
                  {result.breakdown.map((b) => (
                    <li key={b.id} className="flex justify-between">
                      <span>{b.label}</span>
                      <span>
                        {b.min === b.max
                          ? formatUSD(b.min)
                          : `${formatUSD(b.min)}–${formatUSD(b.max)}`}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  Estimates reflect typical values from UCF programs on your
                  site (e.g., Legal consults, CRT limits, RWC access, Ticket
                  Center discounts). Actual savings depend on usage and
                  eligibility.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
