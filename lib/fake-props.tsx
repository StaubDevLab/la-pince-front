import { Apple, Bike, Bus, HeartPulse, House, Tv } from 'lucide-react'
import type React from 'react'

export const categories = [
    {
        name: 'Logement',
        value: 450,
        fill: '#F97316',
        icon: (
            <div className="bg-[#FF7A45] text-white p-1 rounded-md">
                <House />
            </div>
        ),
    },
    {
        name: 'Alimentation',
        value: 250,
        fill: '#8884d8',
        icon: (
            <div className="bg-[#8884d8] text-white p-1 rounded-md">
                <Apple />
            </div>
        ),
    },
    {
        name: 'Loisirs',
        value: 120,
        fill: '#FF5C8D',
        icon: (
            <div className="bg-[#FF5C8D] text-white p-1 rounded-md">
                <Bike />
            </div>
        ),
    },
    {
        name: 'Abonnements',
        value: 180,
        fill: '#82E0AA',
        icon: (
            <div className="bg-[#82E0AA] text-white p-1 rounded-md">
                <Tv />
            </div>
        ),
    },
    {
        name: 'Transports',
        value: 130,
        fill: '#9B59B6',
        icon: (
            <div className="bg-[#9B59B6] text-white p-1 rounded-md">
                <Bus />
            </div>
        ),
    },
    {
        name: 'Santé',
        value: 120,
        fill: '#F7DC6F',
        icon: (
            <div className="bg-[#F7DC6F] text-white p-1 rounded-md">
                <HeartPulse />
            </div>
        ),
    },
]
export const expensesByCategoriesChartProps = {
    title: 'Dépenses par catégorie',
    categories: categories,
    initialDateRange: {
        from: new Date(2025, 4, 2), to: new Date(2025, 4, 18),
    },
}

export const monthlyProps = {
    title: 'Activité mensuelle des 6 derniers mois',
    currentMonth: 'Juin 2025',
    data: [
        { month: 'Janvier', revenue: 680, expense: 1200 },
        { month: 'Février', revenue: 950, expense: 1350 },
        { month: 'Mars', revenue: 1350, expense: 1200 },
        { month: 'Avril', revenue: 1380, expense: 1250 },
        { month: 'Mai', revenue: 1400, expense: 1230 },
        { month: 'Juin', revenue: 1420, expense: 1220 },
    ],
    totalRevenue: 2015.16,
    totalExpense: 3015.16,
}

export const budgetCardProps = [{
    title: 'Budget Courses',
    period: '30 Jours',
    spent: 180.12,
    total: 450,
    spentLabel: 'Dépenses actuels',
    spentColor: '#F97316',
    remainingColor: '#F0F0F0',
},
    {
        title: 'Budget Logement',
        period: '30 Jours',
        spent: 555.12,
        total: 450,
        spentLabel: 'Dépenses actuels',
        spentColor: '#F97316',
        remainingColor: '#F0F0F0',
    },
    {
        title: 'Budget Abonnements',
        period: '30 Jours',
        spent: 35.12,
        total: 50,
        spentLabel: 'Dépenses actuels',
        spentColor: '#F97316',
        remainingColor: '#F0F0F0',
    }]

export const weeklyProps = {
    title: 'Activité journalière',
    total: 150.12,
    data: [
        { day: 'LUN', value: 80, dayIndex: 1 },
        { day: 'MAR', value: 65, dayIndex: 2 },
        { day: 'MER', value: 40, dayIndex: 3 },
        { day: 'JEU', value: 30, dayIndex: 4 },
        { day: 'VEN', value: 70, dayIndex: 5 },
        { day: 'SAM', value: 100, dayIndex: 6 },
        { day: 'DIM', value: 25, dayIndex: 0 },    ],
    currentDayIndex: new Date().getDay(),
}
