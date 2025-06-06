export interface BudgetFetched {
    id: string;
    userId: string;
    categoryId: string;
    totalAmount: number;
    actualAmount: number;
    reccuringFrequency: number;
    reccuringStartDate: string;
    lastResetDate: string;
    createdAt: string;
    updatedAt: string;
}
