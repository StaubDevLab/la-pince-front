'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { useForm, Controller } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { getCategoriesForForm } from '@/actions/categories.actions'
import { Category } from '@/types/categories'
import { Transaction, ApiPayloadTransaction, FormTransactionInputs } from '@/types/transactions'
import { createTransaction, updateTransaction, stopRecurringTransaction } from '@/actions/transactions.actions' // <-- Importez la nouvelle action
import { toast } from 'sonner'
import { revalidateUserTransactionsCache } from '@/actions/transactions.actions'
import { revalidateProfileCache } from '@/actions/profile.actions'
import { revalidateUserDashboardCache, revalidateUserBudgetsCache } from '@/actions/dashboard.actions'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import { CreateCategoryDialog } from '../category-dialog/CategoryDialog'
import { AlertCircleIcon, TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { ScrollArea } from '../ui/scroll-area'


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
            reccuringFrequency: 'monthly',
            recurringEndDate: null,
            date: new Date().toISOString().split('T')[0],
        },
    });

    const isRecurring = watch('isRecurring');

    // État local pour le bouton Stop, pour éviter la désactivation globale
    const [isStopping, setIsStopping] = useState(false);

    useEffect(() => {
        if (props.open && session?.accessToken) {
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
        } else if (!props.open) {
            setCategories([]);
        }
    }, [props.open, session?.accessToken]);

    useEffect(() => {
        if (!props.open) {
            reset({
                amount: 0,
                transactionType: '1',
                description: '',
                category: '',
                isRecurring: false,
                reccuringFrequency: 'monthly',
                recurringEndDate: null,
                date: new Date().toISOString().split('T')[0],
            });
            return;
        }

        if (props.transactionToEdit) {
            if (categories && categories.length > 0) {
                reset({
                    amount: props.transactionToEdit.amount,
                    transactionType: String(props.transactionToEdit.transactionType),
                    description: props.transactionToEdit.description ?? '',
                    category: props.transactionToEdit.categoryId,
                    isRecurring: props.transactionToEdit.isRecurring,
                    reccuringFrequency: props.transactionToEdit.recurringFrequency || 'monthly',
                    recurringEndDate: props.transactionToEdit.recurringEndDate ? new Date(props.transactionToEdit.recurringEndDate).toISOString().split('T')[0] : null,
                    date: props.transactionToEdit.date ? new Date(props.transactionToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                });
            }
        } else {
            reset({
                amount: 0,
                transactionType: '1',
                description: '',
                category: '',
                isRecurring: false,
                reccuringFrequency: 'monthly',
                recurringEndDate: null,
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [props.open, props.transactionToEdit, reset, categories]);


    const onSubmit = async (data: FormTransactionInputs) => {
        console.log("Données du formulaire brutes (data):", data);
        let result;
        if (props.transactionToEdit?.isRecurring && props.transactionToEdit?.recurringParentId !== null) {
            const apiPayload: ApiPayloadTransaction = {
                amount: Number(data.amount),
                transactionType: Number(data.transactionType),
                description: data.description?.trim() || '',
                categoryId: data.category,
                date: new Date(data.date).toISOString(),
            }
            result = await updateTransaction(props.transactionToEdit.id, apiPayload);
        } else if (props.transactionToEdit?.isRecurring && props.transactionToEdit?.recurringParentId === null) {
            const apiPayload: ApiPayloadTransaction = {
                amount: Number(data.amount),
                transactionType: Number(data.transactionType),
                description: data.description?.trim() || '',
                categoryId: data.category,
                isRecurring: data.isRecurring,
                recurringFrequency: data.isRecurring && data.reccuringFrequency ? data.reccuringFrequency : null,
                recurringStartDate: null,
                recurringEndDate: data.isRecurring && data.recurringEndDate ? new Date(data.recurringEndDate).toISOString() : null,
                date: new Date(data.date).toISOString(),
            }
            result = await updateTransaction(props.transactionToEdit.id, apiPayload);
        } else {
            const apiPayload: ApiPayloadTransaction = {
                amount: Number(data.amount),
                transactionType: Number(data.transactionType),
                description: data.description?.trim() || '',
                categoryId: data.category,
                date: new Date(data.date).toISOString(),
                isRecurring: data.isRecurring,
                recurringFrequency: data.isRecurring && data.reccuringFrequency ? data.reccuringFrequency : null,
                recurringStartDate: null,
                recurringEndDate: data.isRecurring && data.recurringEndDate ? new Date(data.recurringEndDate).toISOString() : null,
            
            }
            result = await createTransaction(apiPayload);
        }

        if (result.success) {
            props.onSuccess?.();
            revalidateUserDashboardCache();
            revalidateUserBudgetsCache();
            revalidateUserTransactionsCache();
            revalidateProfileCache();
            setUser((prev) => ({ ...prev, amount: result.data?.amount ?? prev.amount })); // Sécurité supplémentaire
            router.refresh();
            toast.success(props.transactionToEdit ? 'Transaction modifiée avec succès.' : 'Transaction créée avec succès.');

            if (!props.transactionToEdit) {
                reset();
            }
            props.onOpenChange?.(false);
        } else {
            console.error('Échec de l\'opération de transaction:', result.error);
            toast.error('Échec de l\'opération de transaction: ' + result.error);
        }
    };

    // Nouvelle fonction pour gérer l'arrêt de la récurrence
    const handleStopRecurring = async () => {
        if (!props.transactionToEdit?.id) {
            toast.error("Impossible d'arrêter la récurrence: ID de transaction manquant.");
            return;
        }

        setIsStopping(true); // Désactive le bouton pendant l'appel API
        try {
            const result = await stopRecurringTransaction(props.transactionToEdit.id);

            if (result.success) {
                toast.success('Récurrence arrêtée avec succès.');
                props.onSuccess?.(); // Rafraîchit les données dans le composant parent
                revalidateUserDashboardCache();
                revalidateUserBudgetsCache();
                revalidateUserTransactionsCache();
                revalidateProfileCache();
                router.refresh(); // Rafraîchit la page pour prendre en compte le changement
                props.onOpenChange?.(false); // Ferme la feuille
            } else {
                console.error('Échec de l\'arrêt de la récurrence:', result.error);
                toast.error('Échec de l\'arrêt de la récurrence: ' + result.error);
            }
        } catch (error) {
            console.error('Erreur inattendue lors de l\'arrêt de la récurrence:', error);
            toast.error('Une erreur inattendue est survenue.');
        } finally {
            setIsStopping(false); // Réactive le bouton
        }
    };


    return (
        <SheetContent className="w-full sm:w-[480px] h-[calc(100vh-10rem)]">
            <ScrollArea className="h-full w-full">
            <SheetHeader>
                <SheetTitle>{props.transactionToEdit ? 'Modifier la transaction' : 'Ajouter une transaction'}</SheetTitle>
                {props.transactionToEdit?.isRecurring && (
                    <>
                        <Alert variant="info">
                            <AlertCircleIcon />
                            <AlertTitle>Information</AlertTitle>
                            <AlertDescription>
                                Certains éléments ne peuvent pas être modifiés car la transaction fait partie d'une récurrence.
                            </AlertDescription>
                        </Alert>
                        {/* Bouton pour arrêter la récurrence */}
                        <Button
                            variant="destructive"
                            onClick={handleStopRecurring}
                            disabled={isStopping || isSubmitting}
                            className="mt-4"
                            aria-label="Arrêter la récurrence"
                        >
                            {isStopping ? 'Arrêt en cours...' : 'Arrêter la récurrence'}
                        </Button>
                    </>
                )}
            </SheetHeader>
            <form className="grid flex-1 auto-rows-min gap-6 px-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-3">
                    <Label>Type de transaction</Label>
                    <Controller
                        control={control}
                        name="transactionType"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} aria-label="Type de transaction" disabled={props.transactionToEdit?.isRecurring && props.transactionToEdit?.recurringParentId !== null}>
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
                    <div className="flex items-center gap-2">
                        <Controller
                            control={control}
                            name="category"

                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} aria-label="Catégorie" disabled={props.transactionToEdit?.isRecurring && props.transactionToEdit?.recurringParentId !== null}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez une catégorie" />
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
                                                Chargement des catégories...
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

                        {errors.category && <p className="text-sm text-red-500" >{errors.category.message}</p>}
                    </div>
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="date">Date de la transaction</Label>
                    <Input
                        id="date"
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...register('date', {
                            required: 'La date est requise',
                        })}
                        aria-label="Date de la transaction"
                    />
                    {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                </div>

                <div className="flex items-center space-x-2">
                    <Controller
                        name="isRecurring"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Switch id="recurring" checked={field.value} disabled={props.transactionToEdit?.isRecurring} onCheckedChange={field.onChange} aria-label="Récurrent ?" />
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
                                <Select onValueChange={field.onChange} value={field.value || 'monthly'} aria-label="Fréquence" disabled={props.transactionToEdit?.isRecurring}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Mensuelle..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                                        <SelectItem value="biweekly">Bihebdomadaire</SelectItem>
                                        <SelectItem value="monthly">Mensuelle</SelectItem>
                                        <SelectItem value="quarterly">Trimestrielle</SelectItem>
                                        <SelectItem value="yearly">Annuelle</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.reccuringFrequency && <p className="text-sm text-red-500">{errors.reccuringFrequency.message}</p>}
                    </div>
                )}

                {isRecurring && (
                    <div className="grid gap-3">
                        <Label htmlFor="recurringEndDate">Date de fin de récurrence</Label>
                        <Input
                            id="recurringEndDate"
                            type="date"
                            {...register('recurringEndDate', {
                                required: false,
                            })}
                            aria-label="Date de fin de récurrence"
                            disabled={props.transactionToEdit?.isRecurring}
                        />
                        {errors.recurringEndDate && <p className="text-sm text-red-500">{errors.recurringEndDate.message}</p>}
                    </div>
                )}

                <Button type="submit" disabled={isSubmitting || isStopping} aria-label="Enregistrer la transaction">
                    Enregistrer
                </Button>
            </form>
            </ScrollArea>
        </SheetContent>
    );
}

export default FormTransaction;