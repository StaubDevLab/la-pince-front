'use client'
import * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table'
import { CalendarIcon, PlusCircleIcon, EuroIcon, LayersIcon, NotebookTextIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { categories } from '@/lib/fake-props'
import { data as fakeData } from '@/lib/fake-transactions'
import { formatRelativeDate } from '@/lib/utils'
import { CategoryItem } from '@/components/category-item'
import { DateRange } from 'react-day-picker'

const data = fakeData.data

type Transaction = {
    amount: number
    date: string
    category: {
        name: string
        color: string
        icon: string
    }
}

export const columns: ColumnDef<Transaction>[] = [
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
]

export default function DataTableDemo() {
    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'date', desc: true }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [selectedCategory, setSelectedCategory] = React.useState<string>('')
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-4/5">
                <h1 className="text-xl font-semibold tracking-tight">Mes transactions</h1>
                <div className="flex flex-col gap-4 items-start justify-between py-4 md:flex-row md:items-center">
                    <div className="flex flex-col gap-2 w-full md:flex-row md:items-center">
                        <Input
                            value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
                            onChange={event => table.getColumn('description')?.setFilterValue(event.target.value)}
                            placeholder="Netflix..."
                            className="w-full md:w-[220px]"
                        />
                        <Select
                            onValueChange={value => {
                                if (value === 'all') {
                                    setSelectedCategory('')
                                    table.getColumn('category')?.setFilterValue(undefined)
                                } else {
                                    setSelectedCategory(value)
                                    table.getColumn('category')?.setFilterValue(value)
                                }
                            }}
                            value={selectedCategory}
                        >
                            <SelectTrigger className="w-full md:w-[220px]">
                                <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                {categories.map(ctg => (
                                    <SelectItem value={ctg.name.toLowerCase()}>{ctg.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button id="date" variant={'outline'} className="w-full md:w-[280px] justify-start text-left font-normal">
                                    <CalendarIcon />
                                    <span className="ml-2">
                                        {dateRange?.from && !dateRange?.to
                                            ? `A partir du ${dateRange.from.toLocaleDateString()}`
                                            : dateRange?.from && dateRange?.to
                                              ? `Du ${dateRange.from.toLocaleDateString()} au ${dateRange.to.toLocaleDateString()}`
                                              : 'Trier par date'}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={range => {
                                        if (range) {
                                            setDateRange(range)
                                            table.getColumn('date')?.setFilterValue(range ?? undefined)
                                        }
                                    }}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                        {dateRange?.from || dateRange?.to ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setDateRange(undefined)
                                    table.getColumn('date')?.setFilterValue(undefined)
                                }}
                                className="w-full md:w-auto"
                            >
                                Réinitialiser
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>

                    <Button className="flex items-center gap-2 w-full md:w-auto">
                        <PlusCircleIcon className="h-4 w-4" />
                        <span>Ajouter une transaction</span>
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <TableHead key={header.id} className="text-center">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id} className="text-center">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />
                        </PaginationItem>

                        {Array.from({ length: table.getPageCount() }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink href="#" isActive={table.getState().pagination.pageIndex === i} onClick={() => table.setPageIndex(i)}>
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}
