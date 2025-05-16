import React from 'react'
import { BudgetCard } from '@/components/budget-card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ExpensesByCategoriesChart } from '@/components/expenses-by-categories-chart'
import { budgetCardProps, expensesByCategoriesChartProps, monthlyProps, weeklyProps, transactions } from '@/lib/fake-props'
import { ChartMonthly } from '@/components/chart-monthly'
import { ChartWeekly } from '@/components/chart-weekly'
import RecentTransactions from '@/components/recent-transactions'

export default function Dashboard() {
    return (
<main className="min-h-screen bg-background p-6 font-inter md:p-8 ">


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-8">

                {/* Budget Cards avec Carousel */}
                <div className="lg:col-span-4 md:col-span-2 col-span-1">
                    <Carousel className="w-full max-w-full p-4 relative overflow-visible mx-auto">
                        <CarouselContent className={"mx-auto"}>
                            {budgetCardProps.map((props, index) => (
                                <CarouselItem key={index} className="md:basis-1/2">
                                    <div className="mx-auto">
                                        <BudgetCard {...props} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute top-1/2 left-2 md:left-4 lg:left-6 -translate-y-1/2 z-20" />

                        <CarouselNext className="absolute top-1/2 right-2 md:right-4 lg:right-6 -translate-y-1/2 z-20" />


                    </Carousel>
                </div>

                {/* Transactions Récentes à droite sur desktop */}
                <div className="lg:col-span-2 md:col-span-2 col-span-1 row-span-2">
                    <RecentTransactions transactions={transactions} />
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

