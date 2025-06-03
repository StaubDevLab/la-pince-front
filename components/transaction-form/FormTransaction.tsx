import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CalendarIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { useForm, Controller } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import {  getCategoriesForForm } from '@/actions/categories.actions'
import { Category } from '@/types/categories'
import { Transaction } from '@/types/transactions'
import { createTransaction } from '@/actions/transactions.actions'
import { toast } from "sonner"


const FormTransaction = () => {
    const { data: session } = useSession()
    const [categories, setCategories] = useState<Partial<Category>[]|undefined>([])
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const {
        handleSubmit,
        control,
        register,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Transaction>({
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



    const onSubmit = async (data: Transaction) => {
        console.log("Données du formulaire avant envoi à l'action serveur:", data);

        const result = await createTransaction(data);

        if (result.success) {
            console.log("Transaction créée avec succès:", result.message);
            reset();
            toast.success("Transaction créée avec succès.");

            await new Promise(resolve => setTimeout(resolve, 100));
            setIsSheetOpen(false);

        } else {
            console.error("Échec de la création de la transaction:", result.error);
            toast.error("Échec de la création de la transaction: " + result.error);
        }
    }

    useEffect(() => {
        if (session?.accessToken) {

            getCategoriesForForm().then((data) => {
                if (data.success && data.data) {
                    setCategories(data.data)
                } else {
                    console.error("Échec de la récupération des catégories :", data.error);
                    setCategories([]);
                }
            })
        }
    }, [session?.accessToken])

    return (
        <Sheet  open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button size="sm" className="rounded-full p-1 text-md bg-primary text-white" >
                    <PlusIcon className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[480px]">
                <SheetHeader>
                    <SheetTitle>Ajouter une transaction</SheetTitle>
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
                                min: {
                                    value: 0.01,
                                    message: 'Le montant doit être supérieur à 0',
                                },
                                validate: value => (typeof value === 'number' && !isNaN(value)) || 'Le montant doit être un nombre valide',
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
                                        {categories && categories.length > 0 ? categories.map(ctg => (
                                            <SelectItem key={ctg.id} value={ctg.id as string}>
                                                {ctg.name}
                                            </SelectItem>
                                        )) : <SelectItem value="loading" disabled>Chargement...</SelectItem>}
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
        </Sheet>
    )
}

export default FormTransaction
