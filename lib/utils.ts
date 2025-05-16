import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatRelativeDate(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return 'Il y a quelques secondes'

    const minutes = Math.floor(diff / 60)
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`

    const days = Math.floor(hours / 24)
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`

    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`

    const months = Math.floor(days / 30)
    if (months < 1) return `Il y a ${days} jour${days > 1 ? 's' : ''}`

    if (months < 12) return `Il y a ${months} mois`

    const years = Math.floor(days / 365)
    return `Il y a ${years} an${years > 1 ? 's' : ''}`
}
