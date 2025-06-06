import { DateRange } from 'react-day-picker'
import { Category } from './categories'

export interface Transaction {
    date: Date
    id: string
    createdAt: Date
    updatedAt: Date
    amount: number
    userAccountId: string
    transactionsType: number
    description: string | null
    categoryId: string
    isReccuring: boolean
    reccuringFrequency: number | null
    reccuringStartDate: Date | null
    reccuringEndDate: Date | null

    category: Category
}

export interface TransactionPayloadBeforeFormat {
    amount: number
    transactionType: string // sera converti en number
    description: string
    category: string // sera converti en categoryId
    isRecurring: boolean
    reccuringFrequency?: string // sera converti en number | null
    dateRange?: {
        from: Date
        to?: Date
    }
}
