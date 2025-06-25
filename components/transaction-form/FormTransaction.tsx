'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import * as Lucide from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { useForm, Controller } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { getCategoriesForForm } from '@/actions/categories.actions'
import { Category } from '@/types/categories'
import { Transaction, ApiPayloadTransaction, FormTransactionInputs } from '@/types/transactions'
import { createTransaction, updateTransaction } from '@/actions/transactions.actions'
import { toast } from 'sonner'
import { revalidateUserTransactionsCache } from '@/actions/transactions.actions'
import { revalidateProfileCache } from '@/actions/profile.actions'
import { revalidateUserDashboardCache, revalidateUserBudgetsCache } from '@/actions/dashboard.actions'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import { CreateCategoryDialog } from '../category-dialog/CategoryDialog'


const FormTransaction: React.FC<{ open?: boolean; onOpenChange?: (open: boolean) => void; transactionToEdit?: Transaction; onSuccess?: () => void }> = props => {
    const { data: session } = useSession()
    const router = useRouter()
    const { setUser } = useUser()
    const [isMounted, setIsMounted] = useState(false)
    const [categories, setCategories] = useState<Partial<Category>[] | undefined>([])


const FormTransaction: React.FC<{
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    transactionToEdit?: Transaction;
    onSuccess?: () => void;
}> = props => {
    const { data: session } = useSession();
    const [categories, setCategories] = useState<Partial<Category>[] | undefined>([]);
    const router = useRouter();
    const { setUser } = useUser();

    const {
        handleSubmit,
        control,
        register,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormTransactionInputs>({
        defaultValues: {
            amount: 0,
            transactionType: '1',
            description: '',
            category: '',
            isRecurring: false,
            reccuringFrequency: '30',
            recurringEndDate: null, 
            date: new Date().toISOString().split('T')[0],
        },

    })
    const isRecurring = watch('isRecurring')

    const onSubmit = async (data: TransactionPayloadBeforeFormat) => {


        const apiPayload: ApiPayloadTransaction = {
            amount: Number(data.amount),
            transactionType: Number(data.transactionType),
            description: data.description?.trim() || '',
            categoryId: data.category,
            isRecurring: data.isRecurring,

            recurringFrequency: data.isRecurring ? Number(data.reccuringFrequency) : null,
            recurringStartDate: data.isRecurring && data.dateRange?.from ? new Date(data.dateRange.from).toISOString() : null,
            recurringEndDate: data.isRecurring && data.dateRange?.to ? new Date(data.dateRange.to).toISOString() : null,
            date: new Date().toISOString(),
        }
        const result = props.transactionToEdit ? await updateTransaction(props.transactionToEdit.id, data) : await createTransaction(payload)

        if (result.success) {
            props.onSuccess?.()
            revalidateUserDashboardCache()
            revalidateUserBudgetsCache()
            revalidateUserTransactionsCache()
            revalidateProfileCache()
            setUser((prev) => ({ ...prev, amount: result.data?.amount || prev.amount }))
            router.refresh()
            toast.success(props.transactionToEdit ? 'Transaction modifiée avec succès.' : 'Transaction créée avec succès.')

            if (!props.transactionToEdit) {
                reset()
            }
            props.onOpenChange?.(false)
        } else {
            result = await createTransaction(apiPayload);
        }


    useEffect(() => {
        if (!session?.accessToken || !props.open) return

        getCategoriesForForm().then(data => {
            if (data.success && data.data) {
                setCategories(data.data)
            } else {
                setCategories([])

            }
            props.onOpenChange?.(false);
        } else {

            reset()

        }
    };

    return (
        <SheetContent className="w-full sm:w-[480px]">
            <SheetHeader>
                <SheetTitle>{props.transactionToEdit ? 'Modifier la transaction' : 'Ajouter une transaction'}</SheetTitle>
            </SheetHeader>
            <form className="grid flex-1 auto-rows-min gap-6 px-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-3">
                    <Label>Type de transaction</Label>
                    <Controller
                        control={control}
                        name="transactionType"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} aria-label="Type de transaction">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Revenu</SelectItem>
                                    <SelectItem value="2">Dépense</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.transactionType && <p className="text-sm text-red-500">{errors.transactionType.message}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="amount">Montant</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="Entrez le montant"
                        {...register('amount', {
                            required: 'Le montant est requis',
                            valueAsNumber: true,
                        })}
                        aria-label="Montant"
                    />
                    {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Burking king..." {...register('description')} aria-label="Description" />
                    {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>


               
                    <div className="grid gap-3">
                        <Label>Catégorie</Label>

                <div className="grid gap-3">
                    <Label>Catégorie</Label>
                    <div className='flex gap-3'>

                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (

                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
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

                        <CreateCategoryDialog
                            onSuccess={async () => {
                                const updated = await getCategoriesForForm()
                                if (updated.success && updated.data) {
                                setCategories(updated.data)
                                }
                            }}
                        />
                    </div>
                </div>


                <div className="flex items-center space-x-2">
                    <Controller
                        name="isRecurring"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Switch id="recurring" checked={field.value} onCheckedChange={field.onChange} aria-label="Récurrent ?" />
                                <Label htmlFor="recurring">Récurrent ?</Label>
                            </>
                        )}
                    />
                </div>

                {isRecurring && (
                    <div className="grid gap-3">
                        <Label>Fréquence</Label>
                        <Controller
                            control={control}
                            name="reccuringFrequency"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || '30'} aria-label="Fréquence">
                                    <SelectTrigger>
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
                        {errors.reccuringFrequency && <p className="text-sm text-red-500">{errors.reccuringFrequency.message}</p>}
                    </div>
                )}

                {isRecurring && (

                    <Controller
                        control={control}
                        name="dateRange"
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="lg" className="h-10 px-2 text-sm md:text-lg w-full justify-start">
                                        <Lucide.CalendarIcon className="h-4 w-4 mr-2" />
                                        {field.value?.from ? `${field.value.from.toLocaleDateString()} - ${field.value.to?.toLocaleDateString()}` : 'Choisir une période'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-4" align="end">
                                    <Calendar mode="range" numberOfMonths={2} selected={field.value} onSelect={field.onChange} defaultMonth={new Date()} />
                                </PopoverContent>
                            </Popover>
                        )}
                    />

                )}

               
                   
             

                <Button type="submit" disabled={isSubmitting} aria-label="Enregistrer la transaction">
                    Enregistrer
                </Button>
            </form>
        </SheetContent>
    );
}

export default FormTransaction;