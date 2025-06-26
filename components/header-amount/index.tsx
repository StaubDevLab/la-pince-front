import { cn } from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"


export const HeaderAmmount = ({ amount }: { amount: number }) => {
    const colorClass = amount < 0 || amount === null || amount === undefined ? "text-red-500" : "text-green-600"
    return (
        amount !== null && amount !== undefined ? (
        <span className="flex items-center gap-2">
            <span className="text-sm sm:text-lg text-muted-foreground">
                Il vous reste
            </span>
            <span className={cn("text-sm sm:text-lg", colorClass)}>
              {amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              
            </span>
          
        </span>) : (
            <span className="flex items-center gap-2">
            <span className="text-sm sm:text-lg text-red-500">
                Erreur solde
            </span>
            </span>
        )
    )
}
