import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button'
import { CategoryItem } from '@/components/category-item'

export interface Transaction {
    id: string;
    date: string;
    description: string;
    category: {
        name: string;
        color: string;
        background: string;
    };
    amount: number;
    isIncome?: boolean;
}

interface TransactionListProps {
    transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: TransactionListProps) => {
    return (
        <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className={"text-lg font-medium"}>Transactions récentes</CardTitle>
                <Button size={"sm"} className="rounded-full p-1 text-md  bg-primary text-white">
                    <PlusIcon className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="px-2">
                <div className="grid grid-cols-3 px-4 py-2 text-xs text-muted-foreground">
                    <div>TRANSACTION</div>
                    <div className="text-center">CATÉGORIE</div>
                    <div className="text-right">TOTAL</div>
                </div>

                <div className="space-y-2">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="grid grid-cols-3 items-center px-4 py-3">
                            <div>
                                <p className="text-xs text-muted-foreground">{transaction.date}</p>
                                <p className="font-medium">{transaction.description}</p>
                            </div>
                            <div className="flex justify-center">
                                <Badge variant="outline" className={cn(
                                    "px-2 py-1 text-xs font-normal w-30 sm:w-30 lg:w-30",
                                    transaction.category.background,
                                    transaction.category.color
                                )}>
                                    <CategoryItem category={transaction.category}/>
                                </Badge>
                            </div>
                            <div className={cn(
                                "text-right font-medium",
                                transaction.isIncome ? "text-green-600" : "text-red-500"
                            )}>
                                {transaction.isIncome ? "+" : "-"}
                                {Math.abs(transaction.amount).toLocaleString("fr-FR", { style: "currency", currency: "EUR"})}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;
