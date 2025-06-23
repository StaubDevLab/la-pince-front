import { CategoryItem } from '@/components/category-item'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatRelativeDate } from '@/lib/utils'
import { Transaction } from '@/types/transactions'
import { ColumnDef } from '@tanstack/react-table'
import { CalendarIcon, DeleteIcon, EuroIcon, Eye, LayersIcon, NotebookTextIcon, Trash } from 'lucide-react'

const getColumns = (onDelete: (id: string) => void, onRowClick: (transaction: Transaction) => void): ColumnDef<Transaction>[] => [
    {
        accessorKey: 'description',
        header: ({ column }) => {
            return (
                // On tri par ordre alphabétique
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    <NotebookTextIcon />
                    <span>Transaction</span>
                </Button>
            )
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue('description')}</div>,
    },
    {
        accessorKey: 'category',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    <LayersIcon />
                    <span>Categorie</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            const category = row.getValue('category') as {
                name: string
                color: string
                icon?: string
            }

            return (
                <Badge style={{ backgroundColor: category.color }} className="font-medium capitalize">
                    <CategoryItem category={{ name: category.name, iconSize: 14 }} />
                </Badge>
            )
        },
        sortingFn: (rowA, rowB, columnId) => {
            // On tri par ordre alphabétique
            const a = rowA.getValue(columnId) as { name: string }
            const b = rowB.getValue(columnId) as { name: string }

            return a.name.localeCompare(b.name)
        },
        filterFn: (row, columnId, filterValue) => {
            // On return uniquement la catégorie sélectionner dans le Select
            const category = row.getValue(columnId) as { name: string }
            if (!filterValue) return true
            return category.name.toLowerCase().includes(filterValue.toLowerCase())
        },
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    <EuroIcon />
                    <span>Montant</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'))
            const isPositive = amount > 0
            return (
                <div className={`font-medium ${isPositive ? 'text-green-500' : ''}`}>
                    {isPositive && '+'}
                    {row.getValue('amount')} €
                </div>
            )
        },
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    <CalendarIcon />
                    <span>Date</span>
                </Button>
            )
        },
        cell: ({ row }) => {
            const rawDate = row.getValue('date')
            const relativeDate = formatRelativeDate(rawDate as string)

            return (
                <div className="font-medium">
                    <Badge variant={'secondary'}>{relativeDate}</Badge>
                </div>
            )
        },
        sortingFn: (rowA, rowB, columnId) => {
            // On tri de la plus récente à la plus ancienne ou inversement
            const dateA = new Date(rowA.getValue(columnId))
            const dateB = new Date(rowB.getValue(columnId))

            return dateA.getTime() - dateB.getTime()
        },
        filterFn: (row, columnId, filterValue) => {
            // On tri en fonction du range date
            const rowDate = new Date(row.getValue(columnId))
            const { from, to } = filterValue || {}

            if (from && to) {
                return rowDate >= from && rowDate <= to
            }
            if (from) {
                return rowDate >= from
            }
            if (to) {
                return rowDate <= to
            }
            return true
        },
    },
    {
        id: 'action',
        header: () => <span>Action</span>,
        cell: ({ row }) => {
            const transaction = row.original
            return (
                <div style={{display: 'flex', justifyContent: 'center', gap: 5}}>
                    <Button
                        variant='outline'
                        size="sm"
                        className="rounded-full p-1 text-md bg-primary text-white"
                        onClick={(e) => onRowClick(transaction)}>
                            <Eye />
                    </Button>
                    <Dialog>
                            <DialogTrigger asChild>
                            <Button
                                variant='outline'
                                size="sm"
                                className="rounded-full p-1 text-md bg-primary text-white"
                                onClick={(e) => e.stopPropagation()}>
                                    <Trash />
                            </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Attention</DialogTitle>
                                <DialogDescription>
                                Etes-vous sur de vouloir supprimer cette transaction ?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                <Button variant="outline" onClick={(e) => e.stopPropagation()}>Annuler</Button>
                                </DialogClose>
                                <Button type="submit" onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(transaction.id)
                                }}>Confirmer</Button>
                            </DialogFooter>
                            </DialogContent>
                    </Dialog>
                </div>
            )
        },
    },
]

export default getColumns
