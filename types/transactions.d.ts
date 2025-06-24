import { Category } from './categories'

export interface Transaction {
    date: Date
    id: string
    createdAt: Date
    updatedAt: Date
    amount: number
    userAccountId: string
    transactionType: number
    description: string | null
    categoryId: string
    isRecurring: boolean
    recurringFrequency: number | null
    recurringStartDate: Date | null 
    recurringEndDate: Date | null

    category: Category
}

// Type pour le PAYLOAD ENVOYÉ À L'API (après formatage du formulaire)
export interface ApiPayloadTransaction {
    amount: number
    transactionType: number
    description: string
    categoryId: string
    isRecurring: boolean
    recurringFrequency: number | null
    recurringStartDate?: string | null 
    recurringEndDate: string | null 
    date: string 
}

// Type pour les DONNÉES BRUTES DU FORMULAIRE (avant tout formatage pour l'API)
export interface FormTransactionInputs {
    amount: number
    transactionType: string
    description: string
    category: string
    isRecurring: boolean
    reccuringFrequency?: string
    recurringEndDate?: string | null 
    date: string 
}