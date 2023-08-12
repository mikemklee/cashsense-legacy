export interface ExpenseByCategory {
  category: string;
  total: number;
  color?: string;
}

export type ExpensesByCategoryMap = Record<string, ExpenseByCategory>;