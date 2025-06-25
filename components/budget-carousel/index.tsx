"use client"

import { BudgetCard } from "@/components/budget-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { BudgetForm } from "@/components/budget-form";
import { useState, useEffect } from "react";

type BudgetCardFullProps = {
  id: string;
  title: string;
  period: string;
  spent: number;
  total: number;
  spentLabel: string;
  spentColor: string;
  remainingColor: string;
  categoryId: string;
  recurringFrequency: string;
  recurringStartDate: string;
};

export function BudgetCarousel({
  budgetCardProps,
}: {
  budgetCardProps: BudgetCardFullProps[];
}) {
  const [open, setOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<
      (BudgetCardFullProps & { totalAmount: number }) | null
  >(null);

  useEffect(() => {
      if (!open && editingBudget !== null) {
          setEditingBudget(null);
      }
  }, [open, editingBudget]); 

  return (
      <div className="lg:col-span-4 md:col-span-2 col-span-1">
          <Sheet open={open} onOpenChange={setOpen}>
              <Button
                  size='sm'
                  className="w-fit mb-4 rounded-full"
                  onClick={() => {
                      setEditingBudget(null); 
                      setOpen(true);
                  }}
                  aria-label="Ajouter un budget"
              >
                  <Plus />
                  Budget
              </Button>

              {open && (
                  <SheetContent className="w-full sm:w-[480px] p-4">
                      <SheetHeader>
                          <SheetTitle>
                              {editingBudget ? "Modifier un budget" : "Ajouter un budget"}
                          </SheetTitle>
                          <SheetDescription>
                              {editingBudget
                                  ? "Modifiez les informations de votre budget."
                                  : "Ajoutez un nouveau budget pour suivre vos dépenses."}
                          </SheetDescription>
                      </SheetHeader>

                      <BudgetForm
                          open={open}
                          onOpenChange={setOpen}
                          initialData={
                              editingBudget
                                  ? {
                                      id: editingBudget.id,
                                      categoryId: editingBudget.categoryId,
                                      totalAmount: editingBudget.total,
                                      recurringFrequency: editingBudget.recurringFrequency,
                                      recurringStartDate: editingBudget.recurringStartDate,
                                  }
                                  : undefined
                          }
                      />
                  </SheetContent>
              )}
          </Sheet>

          <div className="flex flex-col gap-4">
              {budgetCardProps.length > 0 ? (
                  <Carousel className="w-full relative overflow-visible mx-auto">
                      <CarouselContent>
                          {budgetCardProps.map((props, index) => (
                              <CarouselItem key={index} className="md:basis-1/2">
                                  <div>
                                      <BudgetCard
                                          {...props}
                                          budgetId={props.id}
                                          onEditOpen={() => {
                                              setEditingBudget({ ...props, totalAmount: props.total });
                                              setOpen(true);
                                          }}
                                      />
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
  );
}