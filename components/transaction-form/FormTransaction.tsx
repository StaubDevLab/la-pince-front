'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { useForm, Controller } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { getCategoriesForForm } from '@/actions/categories.actions'
import { Category } from '@/types/categories'
import { Transaction, TransactionPayloadBeforeFormat } from '@/types/transactions'
import { createTransaction } from '@/actions/transactions.actions'
import { updateTransaction } from '@/actions/transactions.actions'
import { toast } from 'sonner'
import { revalidateUserTransactionsCache } from '@/actions/transactions.actions'
import { revalidateProfileCache } from '@/actions/profile.actions'
import { revalidateUserDashboardCache, revalidateUserBudgetsCache } from '@/actions/dashboard.actions'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'

const FormTransaction: React.FC<{ open?: boolean; onOpenChange?: (open: boolean) => void; transactionToEdit?: Transaction; onSuccess?: () => void }> = props => {
    const { data: session } = useSession()
    const [categories, setCategories] = useState<Partial<Category>[] | undefined>([])
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()
    const { setUser } = useUser()

    const { 
        handleSubmit,
        control,
        register,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TransactionPayloadBeforeFormat>({
        defaultValues: {
            transactionType: '1',
            amount: 0,
            description: '',
            category: '',
            isRecurring: false,
            reccuringFrequency: undefined,
            dateRange: undefined,
        },
    })

    const isRecurring = watch('isRecurring')

    const onSubmit = async (data: TransactionPayloadBeforeFormat) => {
        console.log("Données du formulaire avant envoi à l'action serveur:", data)

        const payload = {
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

        console.log("Données du formulaire avant envoi à l'action serveur:", payload)

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
                reset() // On réinitialise uniquement pour une création
            }
            props.onOpenChange?.(false)
        } else {
            console.error('Échec de la création de la transaction:', result.error)
            toast.error('Échec de la création de la transaction: ' + result.error)
        }
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!session?.accessToken || !props.open) return
        console.log(props.open)

        getCategoriesForForm().then(data => {
            if (data.success && data.data) {
                setCategories(data.data)
            } else {
                console.error('Échec de la récupération des catégories :', data.error)
                setCategories([])
            }
        })

        // Ce bloc ne doit s'exécuter que si on OUVRE la modale pour la première fois
        if (props.open && props.transactionToEdit) {
            reset({
                amount: props.transactionToEdit.amount,
                transactionType: '1',
                description: props.transactionToEdit.description ?? '',
                category: props.transactionToEdit.category.id,
                isRecurring: props.transactionToEdit.isReccuring,
                reccuringFrequency: props.transactionToEdit.reccuringFrequency?.toString(),
                dateRange:
                    props.transactionToEdit.isReccuring && props.transactionToEdit.reccuringStartDate
                        ? {
                              from: new Date(props.transactionToEdit.reccuringStartDate),
                              to: props.transactionToEdit.reccuringEndDate ? new Date(props.transactionToEdit.reccuringEndDate) : undefined,
                          }
                        : undefined,
            })
        } else {
            reset() // vide le formulaire en cas de création
        }
    }, [session?.accessToken, props.open, isMounted])

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
                            <Select onValueChange={field.onChange} value={field.value}>
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
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="amount">Montant</Label>
                    <Input
                        id="amount"
                        type="float"
                        placeholder="Entrez le montant"
                        {...register('amount', {
                            required: 'Le montant est requis',
                            valueAsNumber: true,
                        })}
                    />
                    {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Burking king..." {...register('description')} />
                </div>

                <div className="grid gap-3">
                    <Label>Catégorie</Label>
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
                </div>

                <div className="flex items-center space-x-2">
                    <Controller
                        name="isRecurring"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Switch id="recurring" checked={field.value} onCheckedChange={field.onChange} />
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
                                <Select onValueChange={field.onChange} value={field.value || ''}>
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
                                        <CalendarIcon className="h-4 w-4 mr-2" />
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

                <Button type="submit" disabled={isSubmitting}>
                    Enregistrer
                </Button>
            </form>
        </SheetContent>
    )
}

export default FormTransaction
