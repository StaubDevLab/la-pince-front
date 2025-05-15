import React from 'react'
import { BudgetCard } from '@/components/budget-card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import {ExpensesByCategoriesChart} from "@/components/expenses-by-categories-chart";
import {budgetCardProps, categories, expensesByCategoriesChartProps, monthlyProps} from "@/lib/fake-props";
import {ChartMonthly} from "@/components/chart-monthly";
export default function Dashboard() {
    return (
        <>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
                <div className="col-span-4 lg:col-span-2 p-2 ">

                    <Carousel


                        className="w-full"
                    >
                        <CarouselContent>
                            {budgetCardProps.map((props, index) => (
                                <CarouselItem key={index} className="md:basis-1/2">
                                    <div className="p-1">
                                        <BudgetCard {...props} />
                                    </div>
                                </CarouselItem>
                            ))}

                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                </div>
                <div className="p-2 col-span-4 lg:col-span-2">
                    <ExpensesByCategoriesChart {...expensesByCategoriesChartProps}/>
                </div>
                <div className="p-2 col-span-4 lg:col-span-2">
                    <ChartMonthly {...monthlyProps} />
                </div>
            </div>


        </>
    )
}

