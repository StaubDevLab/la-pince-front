'use client'
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@/types/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCategoriesForForm } from '@/actions/categories.actions';
import { toast } from 'sonner';
import { createBudget, updateBudget } from '@/actions/budget.actions';
import { revalidateUserDashboardCache, revalidateUserBudgetsCache } from '@/actions/dashboard.actions';
import { budgetSchema } from '@/types/budget-schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type BudgetFormInputs = z.infer<typeof budgetSchema>;

export function BudgetForm({
  onOpenChange,
  initialData,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Partial<BudgetFormInputs> & { id?: string };
}) {
  const [categories, setCategories] = useState<Partial<Category>[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BudgetFormInputs>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      totalAmount: 0,
      recurringFrequency: '30', 
      categoryId: '',
      recurringStartDate: new Date().toISOString().split('T')[0],
    },
  });

  
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategoriesForForm();
      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        console.error('Échec de la récupération des catégories :', data.error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []); 

 
  useEffect(() => {
    if (initialData) {
      
      if (initialData.categoryId && categories.length === 0) {
       
      
        return;
      }

      reset({
        totalAmount: initialData.totalAmount ?? 0,
       
        recurringFrequency: initialData.recurringFrequency ? String(initialData.recurringFrequency) : '30',
        categoryId: initialData.categoryId ?? '',
        recurringStartDate:
          initialData.recurringStartDate ?? new Date().toISOString().split('T')[0],
      });
    } else {
      
      reset({
        totalAmount: 0,
        recurringFrequency: '30',
        categoryId: '',
        recurringStartDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, reset, categories]); 

  const onSubmit = async (data: BudgetFormInputs) => {
    const payload = {
      categoryId: data.categoryId,
      totalAmount: Number(data.totalAmount),
      recurringFrequency: Number(data.recurringFrequency),
      recurringStartDate: new Date(data.recurringStartDate).toISOString(),
    };


    const response = initialData?.id
      ? await updateBudget(initialData.id, payload)
      : await createBudget(payload);

    if (response.success) {
      toast.success(
        initialData?.id ? 'Budget mis à jour avec succès' : 'Budget créé avec succès'
      );
      revalidateUserDashboardCache();
      revalidateUserBudgetsCache();
      reset();
      onOpenChange?.(false);
    } else {
      toast.error(
        initialData?.id ? 'Erreur lors de la mise à jour du budget' : 'Erreur lors de la création du budget'
      );
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {/* Catégorie */}
      <div className="flex flex-col gap-2">
        <Label>Catégorie</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                className="w-full"
                disabled={!!initialData?.id}
              >
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((ctg) => (
                    <SelectItem key={ctg.id} value={ctg.id as string}>
                      {ctg.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading" disabled>
                    Chargement des catégories...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <p className="text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      {/* ... (Montant) ... */}
      <div className="flex flex-col gap-2">
        <Label>Montant du budget</Label>
        <Input
          type="number"
          min={0}
          {...register('totalAmount', {
            required: 'Le montant est requis',
            valueAsNumber: true,
          })}
        />
        {errors.totalAmount && (
          <p className="text-red-500">{errors.totalAmount.message}</p>
        )}
      </div>

      {/* Fréquence */}
      <div className="flex flex-col gap-2">
        <Label>Fréquence</Label>
        <Controller
          control={control}
          name="recurringFrequency"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mensuelle..." />
              </SelectTrigger>
              <SelectContent>
                {/* Assurez-vous que les valeurs sont des chaînes */}
                <SelectItem value="1">Quotidien</SelectItem>
                <SelectItem value="7">Hebdomadaire</SelectItem>
                <SelectItem value="30">Mensuelle</SelectItem>
                <SelectItem value="90">Trimestrielle</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.recurringFrequency && (
          <p className="text-red-500">{errors.recurringFrequency.message}</p>
        )}
      </div>

         {/* Date de début */}
         <div className="flex flex-col gap-2">
        <Label>Date de début</Label>
        <Input type="date" {...register('recurringStartDate')} max={new Date().toISOString().split('T')[0]}/>
        {errors.recurringStartDate && (
          <p className="text-red-500">{errors.recurringStartDate.message}</p>
        )}
      </div>

      <Button type="submit">
        {initialData?.id ? 'Mettre à jour le budget' : 'Créer le budget'}
      </Button>
    </form>
  );
}