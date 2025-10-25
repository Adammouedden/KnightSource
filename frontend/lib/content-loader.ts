import { promises as fs } from 'fs';
import path from 'path';

export interface Subcategory {
  name: string;
  description_md: string;
  phone: string;
  location: String;
  financial_value_md: string;
  exceptions_md: string;
  steps_md: string;
}

export interface CategoryData {
  title: string;
  description: string;
  subcategories: Subcategory[];
}

export interface StatsData {
  totalResources: number;
  avgSavingsPerStudent: number;
  topCategories: number;
  timeToFirstWin: string;
  savingsEstimator: {
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

export async function loadCategoryData(category: string): Promise<CategoryData> {
  const filePath = path.join(process.cwd(), 'content', 'categories', `${category}.json`);
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function loadStatsData(): Promise<StatsData> {
  const filePath = path.join(process.cwd(), 'content', 'stats.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export const categories = [
  { slug: 'legal', name: 'Legal', icon: 'Scale' },
  { slug: 'academics', name: 'Academics', icon: 'GraduationCap' },
  { slug: 'healthcare', name: 'Healthcare', icon: 'Heart' },
  { slug: 'conferences', name: 'Conferences', icon: 'Plane' },
  { slug: 'recreation', name: 'Recreation', icon: 'Dumbbell' }
];
