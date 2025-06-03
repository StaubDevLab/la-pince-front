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
import { DateRange } from 'react-day-picker'
import { useForm, Controller } from 'react-hook-form'
import { useSession } from 'next-auth/react'

export interface Transaction {
    transactionType: string
    amount: number
    description?: string
    category: string
    isRecurring: boolean
    reccuringFrequency?: string | null
    dateRange?: DateRange
    date: Date
}

const FormTransaction = () => {
    const { data: session } = useSession()
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const {
        handleSubmit,
        control,
        register,
        watch,
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

    const getCategories = async () => {
        try {
            const res = await fetch('https://api.la-pince.tech/v1/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            })

            if (!res.ok) {
                const { message } = await res.json()
                console.error('Erreur API :', message)
                return null
            }

            const data = await res.json()
            return data
        } catch (e) {
            console.error('Erreur réseau ou autre :', e)
            return null
        }
    }

    const onSubmit = async (data: Transaction) => {
        console.log(data)
        const payload = {
            amount: Number(data.amount),
            transactionType: Number(data.transactionType),
            description: data.description?.trim() || '',
            categoryId: data.category,
            isReccuring: data.isRecurring,
            reccuringFrequency: data.isRecurring ? Number(data.reccuringFrequency) : null,
            reccuringStartDate: data.isRecurring && data.dateRange?.from ? data.dateRange.from.toISOString() : null,
            reccuringEndDate: data.isRecurring && data.dateRange?.to ? data.dateRange.to.toISOString() : null,
            date: new Date().toISOString(),
        }
        try {
            const res = await fetch('https://api.la-pince.tech/v1/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const { message } = await res.json()
                console.error(message)
            }
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        if (session?.accessToken) {
            getCategories().then(setCategories)
        }
    }, [session?.accessToken])

    return (
        <Sheet modal={false}>
            <SheetTrigger asChild>
                <Button size="sm" className="rounded-full p-1 text-md bg-primary text-white">
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
                            type="number"
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
                                        {categories.map(ctg => (
                                            <SelectItem key={ctg.id} value={ctg.id}>
                                                {ctg.name}
                                            </SelectItem>
                                        ))}
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
