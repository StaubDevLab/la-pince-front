"use client"


import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, CartesianGrid } from "recharts" // Ajout de CartesianGrid
import type { TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DailyActivityProps {
    title: string
    total: number
    data: Array<{
        day: string
        value: number
        dayIndex: number
    }>

}

export function ChartWeekly({title, total, data}: DailyActivityProps) {



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

    // --- Calcul dynamique du domaine de l'axe Y et des seuils (ticks) ---
    const allAmounts = data.map(item => item.value);
    const maxAmount = allAmounts.length > 0 ? Math.max(...allAmounts) : 0;

    let domainUpper: number;
    if (maxAmount === 0) {
        domainUpper = 100; // Domaine par défaut si aucune donnée ou toutes les données sont à zéro
    } else if (maxAmount <= 100) {
        domainUpper = Math.ceil(maxAmount / 25) * 25; // Arrondir au multiple de 25 supérieur
    } else if (maxAmount <= 500) {
        domainUpper = Math.ceil(maxAmount / 50) * 50; // Arrondir au multiple de 50 supérieur
    } else if (maxAmount <= 1000) {
        domainUpper = Math.ceil(maxAmount / 100) * 100; // Arrondir au multiple de 100 supérieur
    } else if (maxAmount <= 5000) {
        domainUpper = Math.ceil(maxAmount / 500) * 500; // Arrondir au multiple de 500 supérieur
    } else {
        domainUpper = Math.ceil(maxAmount / 1000) * 1000; // Arrondir au multiple de 1000 supérieur
    }

    // S'assurer qu'il y a toujours un minimum de 100 pour la lisibilité si le max est très petit
    if (domainUpper < 100 && maxAmount > 0) {
        domainUpper = 100;
    } else if (domainUpper === 0 && maxAmount === 0) {
        domainUpper = 100; // Pour les cas où maxAmount est 0
    }

    // Génération de 3 ticks dynamiques : 0, milieu, et le maximum calculé
    const dynamicTicks = [0];
    if (domainUpper > 0) {
        dynamicTicks.push(domainUpper / 2);
        dynamicTicks.push(domainUpper);
    }
    const uniqueDynamicTicks = Array.from(new Set(dynamicTicks)).sort((a,b) => a - b);


    return (
        <Card className="flex flex-col mx-auto h-full">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 space-y-0 ">
                <div>
                    <CardTitle className="text-lg font-medium">{title}</CardTitle>
                    <p className="text-2xl font-semibold mt-1">{formatCurrency(total)}€</p>
                </div>


            </CardHeader>
            <CardContent className="p-4 pt-6 pb-2 relative">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>

                            <CartesianGrid strokeDasharray="4 4" vertical={false} opacity={0.2} />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                interval={0}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                domain={[0, domainUpper]}
                                ticks={uniqueDynamicTicks}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Bar
                                dataKey="value"
                                radius={[4, 4, 4, 4]}
                                barSize={30}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={"#F97316" }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
