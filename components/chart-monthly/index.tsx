"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
                                 data = [], // Initialiser avec un tableau vide par défaut, les valeurs statiques sont remplacées par les props
                                 totalRevenue = 0, // Initialiser avec 0 par défaut
                                 totalExpense = 0, // Initialiser avec 0 par défaut
                             }: MonthlyActivityProps) {

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
                <div className="bg-white p-2 border rounded shadow-sm text-xs dark:bg-gray-800">
                    <p className="font-medium mb-1">{label}</p>
                    <p className="text-[#F97316] flex justify-between"> {/* Couleur adaptée au graphique */}
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

    // --- Calcul dynamique du domaine de l'axe Y et des seuils (ticks) ---
    const allAmounts = data.flatMap(item => [item.revenue, item.expense]);
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

    // Pour s'assurer qu'il y a toujours un minimum de 100 pour la lisibilité si le max est très petit
    if (domainUpper < 100 && maxAmount > 0) {
        domainUpper = 100;
    } else if (domainUpper === 0 && maxAmount === 0) {
        domainUpper = 100;
    }


    // Génération de 3 ticks dynamiques : 0, milieu, et le maximum calculé
    const dynamicTicks = [0];
    if (domainUpper > 0) {
        dynamicTicks.push(domainUpper / 2);
        dynamicTicks.push(domainUpper);
    }
    // Pour éviter les doublons ou un seul tick si domainUpper est 0 ou petit
    const uniqueDynamicTicks = Array.from(new Set(dynamicTicks)).sort((a,b) => a - b);


    return (
        <Card className="flex flex-col mx-auto">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between py-3 px-4 space-y-0">
                <CardTitle className="text-xl font-medium">{title}</CardTitle>

            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                            barCategoryGap="10%"
                            barGap={4}
                        >
                            <CartesianGrid strokeDasharray="4 4" vertical={false} opacity={0.2} />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 16 }}

                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 16 }}
                                domain={[0, domainUpper]}
                                ticks={uniqueDynamicTicks}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Bar dataKey="revenue" fill="#F97316" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar dataKey="expense" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-6 mt-4 border-t pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#F97316] rounded-sm"></div>
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
