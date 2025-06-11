'use client'
import { BudgetCard } from "@/components/budget-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import {BudgetForm} from "@/components/budget-form";
import { useState } from "react";

export function BudgetCarousel({budgetCardProps} :  {budgetCardProps:{title: string,period: string,spent: number,total: number,
spentLabel:string,
spentColor: string,
remainingColor: string,}[]}) {
    const [open, setOpen] = useState(false)
  
    return (
        <div className="lg:col-span-4 md:col-span-2 col-span-1">
            <Sheet open={open} onOpenChange={setOpen}>
               
                <SheetTrigger asChild>
                    <Button className="w-fit mb-4"><Plus />Ajouter un budget</Button>
                </SheetTrigger>
              
                    
                    <SheetContent className="w-full sm:w-[480px] p-4" >
                    <SheetHeader>
                        <SheetTitle>Ajouter un budget</SheetTitle>
                        <SheetDescription>
                            Ajoutez un nouveau budget pour suivre vos dépenses.
                        </SheetDescription>
                    </SheetHeader>
                        <BudgetForm  open={open}
                        onOpenChange={open => {
                            setOpen(open)
                        }}/>
                        
                    </SheetContent>
                
            </Sheet>
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
