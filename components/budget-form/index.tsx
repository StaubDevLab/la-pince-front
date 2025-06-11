'use client';
import {useEffect, useState} from 'react'
import { z } from 'zod';
import { useForm,Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Category} from '@/types/categories'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCategoriesForForm } from '@/actions/categories.actions';
import { toast } from 'sonner';
import { createBudget } from '@/actions/budget.actions';
import { revalidateUserDashboardCache, revalidateUserBudgetsCache } from '@/actions/dashboard.actions';
import { budgetSchema } from '@/types/budget-schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BudgetFormInputs = z.infer<typeof budgetSchema>;

export function BudgetForm({open, onOpenChange}: {open: boolean; onOpenChange?: (open: boolean) => void}) {
    const [categories, setCategories] = useState<Partial<Category>[] | undefined>([])
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BudgetFormInputs>({
    resolver: zodResolver(budgetSchema),
  });
  useEffect(()=>{
    getCategoriesForForm().then(data => {
        if (data.success && data.data) {
            setCategories(data.data)
        } else {
            console.error('Échec de la récupération des catégories :', data.error)
            setCategories([])
        }
    })
  },[])

  

  const onSubmit = async (data: BudgetFormInputs) => {
    console.log("Données du formulaire avant envoi à l'action serveur:", data)
    const payload = {
      categoryId: data.categoryId,
      totalAmount: Number(data.totalAmount),
      reccuringFrequency: Number(data.reccuringFrequency),
      reccuringStartDate: new Date(data.reccuringStartDate).toISOString(),
    }
    const response = await createBudget(payload);
    if (response.success) {
      toast.success('Budget créé avec succès');
      revalidateUserDashboardCache()
      revalidateUserBudgetsCache()
      reset()
      onOpenChange?.(false)
    } else {
      toast.error('Erreur lors de la création du budget');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full ">
        <div className="flex flex-col gap-2">
        <Label>Catégorie</Label>
                           <Controller
                               control={control}
                               name="categoryId"
                               render={({ field }) => (
                                   <Select onValueChange={field.onChange} value={field.value} >
                                       <SelectTrigger className="w-full">
                                           <SelectValue placeholder="Catégorie" />
                                       </SelectTrigger>
                                       <SelectContent>
                                           {categories && categories.length > 0 ? (
                                               categories.map(ctg => (
                                                   <SelectItem key={ctg.id} value={ctg.id as string}>
                                                       {ctg.name}
                                                   </SelectItem>
                                               ))
                                           ) : (
                                               <SelectItem value="loading" disabled>
                                                   Chargement...
                                               </SelectItem>
                                           )}
                                       </SelectContent>
                                   </Select>
                               )}
                           />
                           {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}
        </div>
       
<div className="flex flex-col gap-2">
      <Label>
        Montant du budget
        </Label>
        <Input type="number"  {...register('totalAmount', {
                            required: 'Le montant est requis',
                            valueAsNumber: true,
                        })} />
        {errors.totalAmount && <p className="text-red-500">{errors.totalAmount.message}</p>}
      
</div>

<div className="flex flex-col gap-2">   
      <Label>Fréquence</Label>
                              <Controller
                                  control={control}
                                  name="reccuringFrequency"
                                  render={({ field }) => (
                                      <Select onValueChange={field.onChange} value={field.value || '30'}>
                                          <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Mensuelle..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                              <SelectItem value="1">Quotidien</SelectItem>
                                              <SelectItem value="7">Hebdomadaire</SelectItem>
                                              <SelectItem value="30">Mensuelle</SelectItem>
                                              <SelectItem value="90">Trimestrielle</SelectItem>
                                          </SelectContent>
                                      </Select>
                                  )}
                              />
                              {errors.reccuringFrequency && <p className="text-red-500">{errors.reccuringFrequency.message}</p>}
</div>

<div className="flex flex-col gap-2">   
      <Label>
        Date de début
        </Label>
        <Input type="date" {...register('reccuringStartDate')} value={new Date().toISOString().split('T')[0]}/>
        {errors.reccuringStartDate && <p className="text-red-500">{errors.reccuringStartDate.message}</p>}
      
</div>

      <Button type="submit">Créer le budget</Button>
    </form>
  );

}
 