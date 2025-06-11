import { BudgetCard } from "@/components/budget-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

export function BudgetCarousel({budgetCardProps} :  {budgetCardProps:{title: string,period: string,spent: number,total: number,
spentLabel:string,
spentColor: string,
remainingColor: string,}[]}) {
  
    return (
        <div className="lg:col-span-4 md:col-span-2 col-span-1">
            <div className="flex flex-col gap-4">
                {budgetCardProps.length > 0 ? (
                    <Carousel className="w-full relative overflow-visible mx-auto">
                        <CarouselContent>
                            {budgetCardProps.map((props, index) => (
                                <CarouselItem key={index} className="md:basis-1/2">
                                    <div>
                                        <BudgetCard {...props} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute top-1/2 left-2 md:left-4 lg:left-6 -translate-y-1/2 z-20" />
                        <CarouselNext className="absolute top-1/2 right-2 md:right-4 lg:right-6 -translate-y-1/2 z-20" />
                    </Carousel>
                ) : (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <p className="text-muted-foreground">Aucun budget défini pour le moment</p>
                    </div>
                )}
            </div>
        </div>
    )
}
