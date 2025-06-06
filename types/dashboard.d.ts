interface DailyAmount {
    date: string; // Format ISO string (ex: "2025-06-01T00:00:00.000Z")
    amount: number;
}

interface HebdoData {
    total: number;
    perDay: DailyAmount[];
}

interface MonthlyData {
    month: string; // Format "YYYY-MM" (ex: "2025-01")
    income: number;
    expense: number;
}

interface Last6MonthsData {
    totalIncome: number;
    totalExpense: number;
    byMonth: MonthlyData[];
}

interface CategoryTotal {
    categoryId: string;
    total: number;
}

interface ByCategoriesData {
    totalByCategory: CategoryTotal[];
    startDate: string; // Format ISO string
    endDate: string; // Format ISO string
}

// Interface principale pour toutes les données du tableau de bord
export interface DashboardData {
    hebdo: HebdoData;
    last6Months: Last6MonthsData;
    byCategories: ByCategoriesData;
}
