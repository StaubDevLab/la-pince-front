"use client"

import { MoreVertical } from "lucide-react"
import { Cell, Pie, PieChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

interface BudgetCardProps {
    title: string
    period?: string
    spent: number
    total: number
    spentLabel?: string
    spentColor?: string
    remainingColor?: string
}

export function BudgetCard({
                              title = "Budget Logement",
                              period = "30 Jours",
                              spent = 180.12,
                              total = 450,
                              spentLabel = "Dépenses actuels",
                              spentColor = "#F97316",
                              remainingColor = "#F0F0F0",
                          }: BudgetCardProps) {
    const isOverBudget = spent > total
    const remaining = isOverBudget ? 0 : total - spent

    const chartData = isOverBudget
        ? [{ name: "dépensé", value: spent, fill: spentColor }]
        : [
            { name: "dépensé", value: spent, fill: spentColor },
            { name: "restant", value: remaining, fill: remainingColor },
        ]

    const chartConfig = {
        dépensé: {
            label: "Dépensé",
            color: spentColor,
        },
        restant: {
            label: "Restant",
            color: remainingColor,
        },
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col max-w-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{period}</span>
                    <button className="text-muted-foreground">
                        <MoreVertical className="h-5 w-5" />
                    </button>
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
              <span className={`text-2xl font-semibold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                {spent.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
              </span>
                            <span className="text-sm text-muted-foreground ml-2">/ {total}€</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
