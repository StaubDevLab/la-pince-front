import React from 'react';
import { auth } from '@/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Server Actions
import { getTransactionsForUser } from '@/actions/transactions.actions';
import { getDashboardData, getBudgetsForUser } from '@/actions/dashboard.actions'
import { getCategories } from '@/actions/categories.actions'

// Client Components
import { BudgetCard } from '@/components/budget-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ExpensesByCategoriesChart } from '@/components/expenses-by-categories-chart';
import { ChartMonthly } from '@/components/chart-monthly';
import { ChartWeekly } from '@/components/chart-weekly';
import RecentTransactions from '@/components/recent-transactions';

import { DashboardToaster } from '@/components/dashboard-toaster';

import { Transaction } from '@/types/transactions'
import { CategoryItem } from '@/components/category-item'
import { Category } from '@/types/categories'
import { toast } from 'sonner'
import { DashboardData } from '@/types/dashboard'
import { BudgetFetched } from '@/types/budget'


export default async function Dashboard() {
    const session = await auth();
    if (!session) return <div>Non authentifié</div>;

    // --- Récupération des données via les Server Actions ---
    const [transactionsResult, dashboardResult, categoriesResult, budgetsResult] = await Promise.all([
        getTransactionsForUser(8, 0),
        getDashboardData(),
        getCategories(),
        getBudgetsForUser()
    ]);
    const getCategoryIconComponent = (categoryName: string, fillColor: string): React.ReactNode => {
        return (
            <div className="p-1 rounded-md" style={{ backgroundColor: fillColor }}>
                <CategoryItem category={{ name: categoryName, iconSize: 24, displayName: false }} />
            </div>
        );
    };
    const transactions: Transaction[] = transactionsResult.success && transactionsResult.data ? transactionsResult.data.data : [];
    const dashboardData: DashboardData | null | undefined = dashboardResult.success ? dashboardResult.data : null;
    const dashboardErrorMessage: string | null = dashboardResult.success ? null : (dashboardResult.error || 'Erreur inconnue lors du chargement des données du tableau de bord.');
    const budgets: BudgetFetched[] = budgetsResult.success && budgetsResult.data ? budgetsResult.data : [];
    const categoriesMap = new Map<string, { name: string, fill: string, icon: React.ReactNode }>();
    if (categoriesResult.success && categoriesResult.data) {

        categoriesResult.data.forEach((cat: Category) => {
            if (cat.id && cat.name && cat.color && cat.icon) {
                const categoryFillColor: string = cat.color;
                const categoryIconName: string = cat.icon;


                const categoryIconComponent = getCategoryIconComponent(categoryIconName, categoryFillColor);

                categoriesMap.set(cat.id, {
                    name: cat.name,
                    fill: categoryFillColor,
                    icon: categoryIconComponent
                });
            } else {
                console.warn(`Catégorie incomplète trouvée et ignorée: ${cat.id || 'N/A'}`);
            }
        });
    } else {
        toast.error('Erreur lors du chargement des catégories. Veuillez réessayer plus tard.');
    }

    // --- Préparation des données pour les composants clients ---

    //1. Données pour les cartes de budget
    const budgetCardProps = budgets.map(budget => {
        const periodText = budget.reccuringFrequency === 30 ? '30 Jours' : `${budget.reccuringFrequency} Jours`; // Adapter le texte de la période

        const spentPercentage = budget.totalAmount > 0 ? (budget.actualAmount / budget.totalAmount) * 100 : 0;
        let spentColor = '#F97316';
        if (spentPercentage >= 100) {
            spentColor = '#EF4444';
        }


        return {
            title: `Budget ${categoriesMap.get(budget.categoryId)|| 'Inconnu'}`,
            period: periodText,
            spent: budget.actualAmount,
            total: budget.totalAmount,
            spentLabel: 'Dépenses actuelles',
            spentColor: spentColor,
            remainingColor: '#E5E7EB',
        };
    });

    // 2. Données pour ChartMonthly
    const monthlyProps = dashboardData?.last6Months ? {
        title: 'Activité mensuelle des 6 derniers mois',
        // Prend le dernier mois disponible dans les données (le plus récent)
        currentMonth: dashboardData.last6Months.byMonth.length > 0
            ? format(new Date(dashboardData.last6Months.byMonth[dashboardData.last6Months.byMonth.length - 1].month + '-01'), 'MMMM yyyy', { locale: fr })
            : format(new Date(), 'MMMM yyyy', { locale: fr }),
        data: dashboardData.last6Months.byMonth.map(item => ({
            month: format(new Date(item.month + '-01'), 'MMMM', { locale: fr }),
            revenue: item.income,
            expense: item.expense,
        })),
        totalRevenue: dashboardData.last6Months.totalIncome,
        totalExpense: dashboardData.last6Months.totalExpense,
    } : {
        title: 'Activité mensuelle des 6 derniers mois',
        currentMonth: format(new Date(), 'MMMM yyyy', { locale: fr }),
        data: [],
        totalRevenue: 0,
        totalExpense: 0,
    };

    // 3. Données pour ChartWeekly
    const dayNames = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
    const weeklyProps = dashboardData?.hebdo ? {
        title: 'Activité hebdomadaire',
        total: dashboardData.hebdo.total,
        data: dashboardData.hebdo.perDay.map(item => {
            const date = new Date(item.date);
            const dayIndex = date.getDay();
            return {
                day: dayNames[dayIndex],
                value: item.amount,
                dayIndex: dayIndex,
            };
        }).sort((a, b) => (a.dayIndex === 0 ? 7 : a.dayIndex) - (b.dayIndex === 0 ? 7 : b.dayIndex)), // Tri pour commencer par Lundi
        currentDayIndex: new Date().getDay(),
    } : {
        title: 'Activité journalière',
        total: 0,
        data: [],
        currentDayIndex: new Date().getDay(),
    };

    // 4. Données pour graphique des dépenses par catégories

    const expensesByCategoriesChartProps = dashboardData?.byCategories ? {
        title: "Dépenses par catégorie",
        categories: dashboardData.byCategories.totalByCategory.map(item => {
            const categoryInfo  = categoriesMap.get(item.categoryId);
            return {
                name: categoryInfo?.name || 'Catégorie inconnue',
                value: item.total,
                fill: categoryInfo?.fill || '#CCCCCC',
                icon: categoryInfo?.icon || null
            };
        }),
        initialDateRange: {
            from: dashboardData.byCategories.startDate ? new Date(dashboardData.byCategories.startDate) : new Date(),
            to: dashboardData.byCategories.endDate ? new Date(dashboardData.byCategories.endDate) : new Date()
        }
    } : {
        title: "Dépenses par catégorie",
        categories: [],
        initialDateRange: { from: new Date(), to: new Date() }
    };



    return (
        <main className="flex-grow bg-background p-6 font-inter md:p-8 ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-8">
                {/* Budget Cards avec Carousel */}
                <div className="lg:col-span-4 md:col-span-2 col-span-1">
                    <Carousel className="max-w-full relative overflow-visible mx-auto">
                        <CarouselContent >
                            {budgetCardProps.map((props, index) => (
                                <CarouselItem key={index} className="md:basis-1/2">
                                    <div>
                                        <BudgetCard {...props} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute top-1/2 left-2 md:left-4 lg:left-6 -translate-y-1/2 z-20" />
                        <CarouselNext className="absolute top-1/2 right-2 md:right-4 lg:right-6 -translate-y-1/2 z-20" />
                    </Carousel>
                </div>

                {/* Transactions Récentes à droite sur desktop */}
                <div className="lg:col-span-2 md:col-span-2 col-span-1 row-span-2">
                    <RecentTransactions transactions={transactions} />
                </div>

                {/* Dépenses par catégorie */}
                <div className="lg:col-span-4 md:col-span-2 col-span-1">
                    <ExpensesByCategoriesChart {...expensesByCategoriesChartProps} />
                </div>

                {/* Graphique mensuel */}
                <div className="lg:col-span-4 md:col-span-2 col-span-1">
                    <ChartMonthly {...monthlyProps} />
                </div>

                {/* Graphique hebdomadaire */}
                <div className="lg:col-span-2 md:col-span-2 col-span-1">
                    <ChartWeekly {...weeklyProps} />
                </div>
            </div>
            <DashboardToaster message={dashboardErrorMessage || "Données du dashboard chargées avec succès"} success={dashboardResult.success} />

        </main>
    );
}
