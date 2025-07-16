export interface ProfileSetupData {
    accountName?: string
    currency?: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD"
    locale?: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT"
    totalAmount?: number
  }
  
  export interface ProfileSetupFormData {
    accountName: string
    currency: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD"
    locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT"
    totalAmount: number
  }
  