import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

export default function Notifications() {
    const notifications = [
        {
            title: 'Nouvelle saisie ajoutée',
            description: 'Dépense "Courses Carrefour" ajoutée pour 48,90€.',
            time: 'Il y a 5 minutes',
            read: false,
            type: 'info',
        },
        {
            title: 'Prélèvement imminent',
            description: 'Abonnement Spotify prévu demain.',
            time: 'Il y a 1 heure',
            read: false,
            type: 'warning',
        },
        {
            title: 'Dépassement de budget',
            description: 'Catégorie "Restaurants" a dépassé de 32€.',
            time: 'Il y a 3 heures',
            read: true,
            type: 'danger',
        },
        {
            title: 'Rappel de saisie',
            description: 'Vous n’avez pas saisi vos dépenses depuis 3 jours.',
            time: 'Hier',
            read: true,
            type: 'warning',
        },
        {
            title: 'Virement reçu',
            description: 'Salaire du mois de mai reçu (2000€).',
            time: 'Il y a 2 jours',
            read: true,
            type: 'info',
        },
    ]

    const typeStyles: Record<string, { bg: string; border: string; text: string }> = {
        info: {
            bg: 'bg-[rgba(14,165,233,0.1)]',
            border: 'border-sky-500',
            text: 'text-sky-500',
        },
        warning: {
            bg: 'bg-[rgba(245,158,11,0.1)]',
            border: 'border-amber-500',
            text: 'text-amber-500',
        },
        danger: {
            bg: 'bg-[rgba(244,63,94,0.1)]',
            border: 'border-rose-500',
            text: 'text-rose-500',
        },
    }

    return (
        <div className="flex items-center justify-center w-full">
            <main className="max-w-4xl w-full p-6 space-y-6">
                {!notifications.length && (
                    <h1 className="text-center font-semibold text-5xl">Aucune notifications</h1>
                )}
                {notifications.length > 0 && (
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
                        <div className="flex items-center space-x-2">
                            {notifications && (
                                <>
                                    <Label
                                        htmlFor="show-unread"
                                        className="text-sm text-muted-foreground"
                                    >
                                        Non lues seulement
                                    </Label>

                                    <Switch id="show-unread" />
                                </>
                            )}
                        </div>
                    </div>
                )}

                {notifications.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {notifications.map((notif, index) => {
                            const style = typeStyles[notif.type]

                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-3 border ${style.border} rounded-lg p-3 ${style.bg}`}
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`text-sm font-medium ${style.text}`}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-xs text-muted-foreground">
                                                {notif.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-snug">
                                            {notif.description}
                                        </p>
                                    </div>

                                    {!notif.read && (
                                        <span className="mt-1 w-2 h-2 rounded-full bg-red-500" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
                {notifications.length > 0 && (
                    <Pagination className="mt-15">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </main>
        </div>
    )
}
