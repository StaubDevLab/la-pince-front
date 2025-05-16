"use client"

import { Settings } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, type TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DailyActivityProps {
    title: string
    total: number
    data: Array<{
        day: string
        value: number
        dayIndex: number
    }>
    currentDayIndex?: number
}

export function ChartWeekly({title,total,data,currentDayIndex}: DailyActivityProps) {

    const formatCurrency = (value: number) => {
        return value.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }


    const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border rounded shadow-sm text-xs dark:bg-gray-800">
                    <p className="font-medium">{formatCurrency(payload[0].value as number)}€</p>
                </div>
            )
        }
        return null
    }

    return (
        <Card className="flex flex-col  mx-auto">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 space-y-0 border-b border-dashed border-gray-200">
                <div>
                    <CardTitle className="text-lg font-medium">{title}</CardTitle>
                    <p className="text-2xl font-semibold mt-1">{formatCurrency(total)}€</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                </Button>
            </CardHeader>
            <CardContent className="p-4 pt-6 pb-2 relative">
                <div className="absolute top-2 right-4 text-xs text-muted-foreground">MAX</div>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Bar
                                dataKey="value"
                                radius={[4, 4, 4, 4]}
                                barSize={30}
                                fill="#F97316"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-2 px-4">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className={`text-xs ${item.dayIndex === currentDayIndex ? "font-medium text-[#F97316]" : "text-muted-foreground"}`}
                        >
                            {item.day}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

