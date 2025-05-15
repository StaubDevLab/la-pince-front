"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MonthlyActivityProps {
    title?: string
    currentMonth?: string
    data?: Array<{
        month: string
        revenue: number
        expense: number
    }>
    totalRevenue?: number
    totalExpense?: number
}

export function ChartMonthly({
                              title = "Activité mensuelle des 6 derniers mois",
                              currentMonth = "Juin 2025",
                              data = [
                                  { month: "Janvier", revenue: 680, expense: 1200 },
                                  { month: "Février", revenue: 950, expense: 1350 },
                                  { month: "Mars", revenue: 1350, expense: 1200 },
                                  { month: "Avril", revenue: 1380, expense: 1250 },
                                  { month: "Mai", revenue: 1400, expense: 1230 },
                                  { month: "Juin", revenue: 1420, expense: 1220 },
                              ],
                              totalRevenue = 2015.16,
                              totalExpense = 3015.16,
                          }: MonthlyActivityProps) {
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)

    // Format currency
    const formatCurrency = (value: number) => {
        return value.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border rounded shadow-sm text-xs">
                    <p className="font-medium mb-1">{label}</p>
                    <p className="text-[#FF7A45] flex justify-between">
                        <span>Revenu:</span> <span className="ml-2">{formatCurrency(payload[0].value as number)}€</span>
                    </p>
                    <p className="text-[#8884d8] flex justify-between">
                        <span>Dépense:</span> <span className="ml-2">{formatCurrency(payload[1].value as number)}€</span>
                    </p>
                </div>
            )
        }
        return null
    }

    // Available months for the dropdown
    const months = ["Janvier 2025", "Février 2025", "Mars 2025", "Avril 2025", "Mai 2025", "Juin 2025"]

    return (
        <Card className="flex flex-col  mx-auto">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 space-y-0">
                <CardTitle className="text-xl font-medium">{title}</CardTitle>
                <Select value={selectedMonth} onValueChange={setSelectedMonth} >
                    <SelectTrigger className="h-10 w-auto min-w-[120px] text-lg border-gray-200 bg-gray-50">

                        <SelectValue>{selectedMonth}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((month) => (
                            <SelectItem key={month} value={month} className="text-lg">
                                {month}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} opacity={0.2} />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 16 }}
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 16 }}
                                domain={[0, 1500]}
                                ticks={[0, 500, 1000, 1500]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.1 }} />
                            <Bar dataKey="revenue" fill="#F97316" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar dataKey="expense" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-6 mt-4 border-t pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-sm"></div>
                        <div>
                            <div className="text-md text-muted-foreground">Revenu</div>
                            <div className="font-medium text-lg">{formatCurrency(totalRevenue)}€</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#8884d8] rounded-sm"></div>
                        <div>
                            <div className="text-md text-muted-foreground">Dépense</div>
                            <div className="font-medium text-lg">{formatCurrency(totalExpense)}€</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
