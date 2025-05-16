import React from 'react'
import { BudgetCard } from '@/components/budget-card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ExpensesByCategoriesChart } from '@/components/expenses-by-categories-chart'
import { budgetCardProps, expensesByCategoriesChartProps, monthlyProps, weeklyProps } from '@/lib/fake-props'
import { ChartMonthly } from '@/components/chart-monthly'
import { ChartWeekly } from '@/components/chart-weekly'

export default function Dashboard() {
    return (
        <main className={"min-h-screen bg-background p-12 font-inter"}>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-8">

                <div className="lg:col-span-4 md:col-span-2 col-span-1">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {budgetCardProps.map((props, index) => (
                                <CarouselItem key={index} className="md:basis-1/2">
                                    <div className="p-1">
                                        <BudgetCard {...props} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

                {/* Dépenses par catégorie */}
                <div className="lg:col-span-4 md:col-span-2 col-span-1">
                    <ExpensesByCategoriesChart {...expensesByCategoriesChartProps} />
                </div>

                {/* Graphique mensuel */}
                <div className="lg:col-span-4 md:col-span-2 col-span-1">
                    <ChartMonthly {...monthlyProps} />
                </div>

                {/* Graphique hebdomadaire */}
                <div className="lg:col-span-2 md:col-span-2 col-span-1">
                    <ChartWeekly {...weeklyProps} />
                </div>


            </div>
        </main>
    )
}

