'use client'
import * as React from 'react'
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table'
import { CalendarIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { categories } from '@/lib/fake-props'
import { DateRange } from 'react-day-picker'
import { deleteTransaction, getTransactionsForUser } from '@/actions/transactions.actions'
import FormTransaction from '@/components/transaction-form/FormTransaction'
import { Transaction } from '@/types/transactions'
import { Sheet } from '@/components/ui/sheet'
import getColumns from './TableColumns'
import { toast } from 'sonner'

export default function DataTableDemo() {
    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'date', desc: true }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [selectedCategory, setSelectedCategory] = React.useState<string>('')
    const [transactions, setTransactions] = React.useState<Transaction[]>([])
    const [transactionToEdit, setTransactionToEdit] = React.useState<Transaction | null>(null)
    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
    const [totalCount, setTotalCount] = React.useState(0)

    const handleDeleteTransaction = async (id: string) => {
        const res = await deleteTransaction(id)
        if (res.success) {
            fetchTransactions()
            toast.success('Transaction supprimée')
        } else {
            toast.error('Erreur lors de la suppresion de la transaction')
        }
    }

    const handleRowClick = (transaction: Transaction) => {
        setTransactionToEdit(transaction)
        setIsFormOpen(true)
    }

    const columns = React.useMemo(() => getColumns(handleDeleteTransaction, handleRowClick), [])

    const table = useReactTable({
        data: transactions,
        columns,
        manualPagination: true,
        pageCount: Math.ceil(totalCount / pagination.pageSize),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            rowSelection,
            pagination,
        },
    })

    const handleAddClick = () => {
        setTransactionToEdit(null)
        setIsFormOpen(true)
    }

    const fetchTransactions = () => {
        getTransactionsForUser(pagination.pageSize, pagination.pageIndex).then(transactions => {
            if (transactions.success && transactions.data) {
                setTransactions(transactions.data.data)
                setTotalCount(transactions.data.total || transactions.data.data.length || 0)
            } else {
                setTransactions([])
                setTotalCount(0)
            }
        })
    }

    React.useEffect(() => {
        fetchTransactions()
    }, [pagination.pageIndex, pagination.pageSize])

    return (
        <div className="flex w-full justify-center p-6 md:p-10 flex-grow">
            <div className="w-full max-w-4/5">
                <h1 className="text-xl font-semibold tracking-tight">Mes transactions</h1>
                {/** HEADER */}
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
                                    <SelectItem key={ctg.name} value={ctg.name.toLowerCase()}>
                                        {ctg.name}
                                    </SelectItem>
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
                    <Sheet open={isFormOpen} onOpenChange={setIsFormOpen} modal={false}>
                        <Button size="sm" className="rounded-full p-1 text-md bg-primary text-white" onClick={handleAddClick}>
                            <PlusIcon className="h-5 w-5" />
                        </Button>

                        <FormTransaction
                            key={transactionToEdit?.id || 'new'}
                            open={isFormOpen}
                            onOpenChange={open => {
                                setIsFormOpen(open)
                            }}
                            onSuccess={() => {
                                fetchTransactions()
                                setIsFormOpen(false)
                            }}
                            transactionToEdit={transactionToEdit || undefined}
                        />
                    </Sheet>
                </div>

                {/** TABLE */}
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

                {/** PAGINATION */}
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
