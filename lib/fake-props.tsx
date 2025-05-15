import { Apple, Bike, Bus, HeartPulse, House, Tv } from 'lucide-react'
import type React from 'react'

export const categories =  [
    {
        name: "Logement",
        value: 450,
        fill: "#FF7A45",
        icon: (
            <div className="bg-[#FF7A45] text-white p-1 rounded-md">
                <House />
                </div>
        ),
    },
    {
        name: "Alimentation",
        value: 250,
        fill: "#8884d8",
        icon: (
            <div className="bg-[#8884d8] text-white p-1 rounded-md">
                <Apple />
                </div>
        ),
    },
    {
        name: "Loisirs",
        value: 120,
        fill: "#FF5C8D",
        icon: (
            <div className="bg-[#FF5C8D] text-white p-1 rounded-md">
                <Bike />
                </div>
        ),
    },
    {
        name: "Abonnements",
        value: 180,
        fill: "#82E0AA",
        icon: (
            <div className="bg-[#82E0AA] text-white p-1 rounded-md">
                <Tv />
                </div>
        ),
    },
    {
        name: "Transports",
        value: 130,
        fill: "#9B59B6",
        icon: (
            <div className="bg-[#9B59B6] text-white p-1 rounded-md">
                <Bus />
                </div>
        ),
    },
    {
        name: "Santé",
        value: 120,
        fill: "#F7DC6F",
        icon: (
            <div className="bg-[#F7DC6F] text-white p-1 rounded-md">
                <HeartPulse />
                </div>
        ),
    },
]
