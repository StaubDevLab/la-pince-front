"use client"

import { useState } from "react"
import type React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {  CalendarIcon} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from 'react-day-picker'

interface CategoryData {
    name: string
    value: number
    fill: string
    icon: React.ReactNode
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
        percentage: Math.round((category.value / total) * 100),
    }))

    // Create chart config dynamically from categories
    const chartConfig = categoriesFormat.reduce((config, category) => {
        return {
            ...config,
            [category.name]: {
                label: category.name,
                color: category.fill,
                value: category.value,
            },
        }
    }, {}) as ChartConfig

    // Format the date range for display
    const formatDateRange = () => {
        if (date.from && date.to) {
            return `${format(date.from, "d MMM", { locale: fr })} - ${format(date.to, "d MMM", { locale: fr })}`
        }
        return "Sélectionner"
    }

    // Custom tooltip formatter
    const tooltipFormatter = (value: number, name: string) => {
        const category = categoriesFormat.find((c) => c.name === name)
        return [`${value}€ (${category?.percentage}%)`, name]
    }

    return (
        <Card className="flex flex-col  mx-auto">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between py-3 px-4 space-y-0">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="lg" className="h-10 px-2 text-sm md:text-lg">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatDateRange()}
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
                </Popover>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2 h-[220px] md:h-[350px]">
                        <ChartContainer config={chartConfig} className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <ChartTooltip formatter={tooltipFormatter} content={<ChartTooltipContent />} />
                                    <Pie
                                        data={categories}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="40%"
                                        outerRadius="70%"
                                    >
                                        {categories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full md:w-1/2">
                        {categoriesFormat.map((category, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                {category.icon}
                                <span className="text-md">{category.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
