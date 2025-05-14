import React from 'react'
import { BellIcon, CircleUser, LogOut, Settings } from 'lucide-react'
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 border-b dark:text-white">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10">
                    <Image src="/la-pince-logo-color.png" alt="Logo de l'application La pince qui représente un crabe à lunettes" width={100} height={100} />
                </div>
                <h1 className="text-3xl font-medium">
                    Bienvenue, <span className="font-bold">Bob L'éponge 🧽</span> !
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex rounded-full bg-gray-100">
                    <button className="px-4 py-1.5 bg-white rounded-full text-sm font-medium shadow-sm cursor-pointer">Dashboard
                    </button>
                    <button className="px-4 py-1.5 text-sm font-medium cursor-pointer">Transactions</button>
                </div>
                <button className="relative">
                    <BellIcon className="w-6 h-6 text-gray-700" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-white cursor-pointer">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><CircleUser />Profile</DropdownMenuItem>
                            <DropdownMenuItem><Settings />Paramètres</DropdownMenuItem>
                            <DropdownMenuItem><LogOut />Déconnexion</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>



                </div>
            </div>
        </header>
    )
}

