import React from 'react'
import Header from '@/components/header'
import { BudgetCard } from '@/components/budget-card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'


export default function Dashboard() {
    return (
        <div className={"min-h-screen bg-background p-12 font-inter"}>
            <Header/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
                <div className="col-span-4 lg:col-span-2 p-2 ">

                    <Carousel


                        className="w-full"
                    >
                        <CarouselContent>
                            <CarouselItem className="md:basis-1/2">
                                <div className="p-1">
                                    <BudgetCard title={"Budget logement"} spent={615.12} total={500} />
                                </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2">
                                <div className="p-1">
                                    <BudgetCard title={"Budget logement"} spent={615.12} total={500} />
                                </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 ">
                                <div className="p-1">
                                    <BudgetCard title={"Budget logement"} spent={615.12} total={500} />
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>


            </div>

        </div>
    )
}

