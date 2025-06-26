"use client"

import { useState } from "react"
import type React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from 'react-day-picker'
import { CategoryItem } from "@/components/category-item"
import { Badge } from "@/components/ui/badge"

interface CategoryData {
    name: string
    value: number
    fill: string
    icon?: string
    percentage?: number
}

interface ActivityChartProps {
    title?: string
    initialDateRange?: {
        from: Date
        to: Date
    }
    categories: CategoryData[]
}

export function ExpensesByCategoriesChart({title, categories, initialDateRange}: ActivityChartProps) {
    const [date, setDate] = useState<DateRange>(initialDateRange as DateRange)

    // Calculate total and percentages
    const total = categories.reduce((sum, category) => sum + category.value, 0)
    const categoriesFormat = categories.map((category) => ({
        ...category,
        percentage: total > 0 ? Math.round((category.value / total) * 100) : 0, // Handle total being 0 to avoid NaN
    }))

    // Format the date range for display
    const formatDateRange = () => {
        if (date.from && date.to) {
            return `${format(date.from, "d MMM", { locale: fr })} - ${format(date.to, "d MMM", { locale: fr })}`
        }
        return "Sélectionner"
    }

    // Format currency function (re-defined here for CustomTooltip)
    const formatCurrency = (value: number) => {
        return value.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    // Custom tooltip component, similar to ChartMonthly
    const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            const dataEntry = payload[0].payload as CategoryData;

            return (
                <div className="bg-white p-2 border rounded shadow-sm text-xs dark:bg-gray-800">
                    <p className="font-medium text-lg mb-1" style={{ color: dataEntry.fill }}>{dataEntry.name}</p>
                    <p className="flex justify-between">
                        <span>Montant:</span> <span className="ml-2 font-semibold">{formatCurrency(dataEntry.value)}€</span>
                    </p>
                    {dataEntry.percentage !== undefined && (
                        <p className="flex justify-between">
                            <span>Pourcentage:</span> <span className="ml-2">{dataEntry.percentage}%</span>
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="flex flex-col mx-auto">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between py-3 px-4 space-y-0">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
                {/*<Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="px-2 text-sm md:text-lg">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            <small>{formatDateRange()}</small> 
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="end">
                        <Calendar
                            mode="range"
                            selected={date}
                            onSelect={(range) => range && setDate(range)}
                            locale={fr}
                        />
                    </PopoverContent>
                </Popover>*/}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2 h-[220px] md:h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>

                                <Tooltip content={<CustomTooltip />} />
                                <Pie
                                    data={categoriesFormat}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="40%"
                                    outerRadius="70%"
                                >
                                    {categoriesFormat.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full md:w-1/2">
                        {categoriesFormat.map((category, index) => (
                            
                            <div key={index} className="flex items-center gap-1.5">
                                <Badge className="flex items-center gap-1.5" style={{ backgroundColor: category.fill }}>
                                    <CategoryItem category={{ name: category.name, displayName: true, iconSize: 20 }} iconName={category.icon as string} />
                                </Badge>
                                {category.percentage !== undefined && (
                                    <span className="text-sm text-white">({category.percentage}%)</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
