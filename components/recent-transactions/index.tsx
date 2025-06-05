'use client'
import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CategoryItem } from '@/components/category-item'
import FormTransaction from '../transaction-form/FormTransaction'
import { Transaction } from '@/types/transactions'
import { PlusIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { SheetContent, SheetTrigger, Sheet } from '../ui/sheet'

const RecentTransactions = ({ transactions }: { transactions: Transaction[] }) => {
    const [open, setOpen] = React.useState(false)
    return (
        <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className={'text-lg font-medium'}>Transactions récentes</CardTitle>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button size="sm" className="rounded-full p-1 text-md bg-primary text-white">
                            <PlusIcon className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <FormTransaction onSuccess={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
            </CardHeader>
            <CardContent className="px-2">
                <div className="grid grid-cols-3 px-4 py-2 text-xs text-muted-foreground">
                    <div>TRANSACTION</div>
                    <div className="text-center">CATÉGORIE</div>
                    <div className="text-right">TOTAL</div>
                </div>

                <div className="space-y-2">
                    {transactions.map(transaction => (
                        <div key={transaction.id} className="grid grid-cols-3 items-center px-4 py-3">
                            <div>
                                <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
                                <p className="font-medium">{transaction.description}</p>
                            </div>
                            <div className={`flex justify-center `}>
                                <Badge style={{ backgroundColor: transaction.category.color }} className="font-medium capitalize">
                                    <CategoryItem category={{ name: transaction.category.name, iconSize: 14 }} />
                                </Badge>
                            </div>
                            <div className={cn('text-right font-medium', transaction.transactionsType === 'Revenu' ? 'text-green-600' : 'text-red-500')}>
                                {transaction.transactionsType === 'Revenu' ? '+' : '-'}
                                {Math.abs(transaction.amount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default RecentTransactions
