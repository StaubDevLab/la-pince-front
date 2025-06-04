import { DateRange } from 'react-day-picker'
import { Category } from './categories'

export interface Transaction {
    id: string
    transactionType: string
    amount: number
    description?: string | undefined
    category: Category
    isRecurring: boolean
    reccuringFrequency?: string | null
    dateRange?: DateRange
    date: string
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
