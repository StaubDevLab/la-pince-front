export interface BudgetFetched {
    id: string;
    userId: string;
    categoryId: string;
    totalAmount: number;
    actualAmount: number;
    recurringFrequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
    recurringStartDate: string;
    lastResetDate: string;
    createdAt: string;
    updatedAt: string;
}


export type BudgetFormType = {
    categoryId:string
    totalAmount: number
    recurringFrequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly"
    recurringStartDate: string

}