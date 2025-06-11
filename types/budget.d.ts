export interface BudgetFetched {
    id: string;
    userId: string;
    categoryId: string;
    totalAmount: number;
    actualAmount: number;
    recurringFrequency: number;
    recurringStartDate: string;
    lastResetDate: string;
    createdAt: string;
    updatedAt: string;
}
