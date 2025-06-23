"use client"

import { Edit, MoreVertical, Plus, Sheet, Trash } from "lucide-react"
import { Cell, Pie, PieChart } from "recharts"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { deleteBudget  } from "@/actions/budget.actions"
import { revalidateUserDashboardCache,revalidateUserBudgetsCache } from "@/actions/dashboard.actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { BudgetForm } from "../budget-form"

interface BudgetCardProps {
  title: string
  period?: string
  spent: number
  total: number
  spentLabel?: string
  spentColor?: string
  remainingColor?: string
  budgetId?: string
  onEditOpen?: () => void

}

export function BudgetCard({
  title = "Budget Logement",
  period = "30 Jours",
  spent = 180.12,
  total = 450,
  spentLabel = "Dépenses actuels",
  spentColor = "#F97316",
  remainingColor = "#F0F0F0",
  budgetId = "",
  onEditOpen
  
}: BudgetCardProps) {
  const isOverBudget = spent > total
  const remaining = isOverBudget ? 0 : total - spent
    
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const onOpenChange = (value: boolean) => setOpen(value)
    const router = useRouter()

  const chartData = isOverBudget
    ? [{ name: "dépensé", value: spent, fill: spentColor }]
    : [
        { name: "dépensé", value: spent, fill: spentColor },
        { name: "restant", value: remaining, fill: remainingColor },
      ]

  const chartConfig = {
    expensed: {
      label: "Dépensé",
      color: spentColor,
    },
    restant: {
      label: "Restant",
      color: remainingColor,
    },
  } satisfies ChartConfig

  const handleDelete = async() => {
    await deleteBudget(budgetId)
     revalidateUserDashboardCache()
     revalidateUserBudgetsCache()
    setOpen(false)
    toast.success('Budget supprimé avec succès.')

    router.refresh()
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{period}</span>

          <DropdownMenu >
  <DropdownMenuTrigger>
    <MoreVertical className="h-5 w-5" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
  <DropdownMenuItem
  onSelect={(e) => {
    e.preventDefault()
    onEditOpen?.() 
  }}
>
  <Edit className="mr-2 h-4 w-4" />
  Modifier
</DropdownMenuItem>

    {/* Dialog pour la suppression  */}
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le budget ?</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Voulez-vous vraiment supprimer ce budget ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="default" onClick={handleDelete}>
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </DropdownMenuContent>
</DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center">
          <ChartContainer config={chartConfig} className="w-24 h-24 mr-4">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={36}
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div>
            <div className="text-sm text-muted-foreground mb-1">{spentLabel}</div>
            <div className="flex items-baseline">
              <span
                className={`text-2xl font-semibold ${
                  isOverBudget ? "text-red-600" : "text-green-600"
                }`}
              >
                {spent.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                €
              </span>
              <span className="text-sm text-muted-foreground ml-2">/ {total}€</span>
            </div>
          </div>
        </div>
      </CardContent>
      
    </Card>
  )
}
