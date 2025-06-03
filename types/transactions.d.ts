import { DateRange } from 'react-day-picker'

export interface Transaction {
    transactionType: string
    amount: number
    description?: string
    category: string
    isRecurring: boolean
    reccuringFrequency?: string | null
    dateRange?: DateRange
    date: Date
}


export interface TransactionPayload {
    amount: number;
    transactionType: number;
    description: string;
    categoryId: string;
    isReccuring: boolean;
    reccuringFrequency: number | null;
    reccuringStartDate: string | null;
    reccuringEndDate: string | null;
    date: string;
}
