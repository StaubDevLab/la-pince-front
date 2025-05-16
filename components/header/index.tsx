"use client"
import { BellIcon, CircleUser, LogOut, Menu, Settings } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SwitchTheme } from '@/components/switch-theme'
import Link from "next/link"
import { usePathname } from 'next/navigation'

export default function Header({name}: {name: string}) {
    const pathname = usePathname()
    return (
        <header className="flex items-center justify-between p-3 md:p-4 border-b dark:text-white">

            <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                    <Image
                        src="/la-pince-logo.png"
                        alt="Logo de l'application La pince qui représente un crabe à lunettes"
                        width={100}
                        height={100}
                    />
                </div>
                <div>
                    <h1 className="hidden sm:block md:text-2xl lg:text-3xl font-medium">
                        Bienvenue, <span className="font-bold">{name}</span> !
                    </h1>

                    <h1 className="text-lg sm:hidden font-medium">
                        Bonjour, <span className="font-bold">Bob</span> !
                    </h1>
                </div>
            </div>


            <div className="flex items-center gap-2 md:gap-4">

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Navigation en style icône */}
                    <div className="hidden md:flex items-center rounded-full bg-muted  p-1">
                        <Link href="/dashboard">
                            <Button
                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer
            ${pathname === '/dashboard'
                                    ? 'bg-primary text-white shadow-sm '
                                    : 'bg-input/30 text-muted-foreground hover:text-white hover:bg-input/50'}
          `}
                            >
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/transactions">
                            <Button
                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer
            ${pathname === '/transactions'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-input/30 text-muted-foreground hover:text-white hover:bg-input/50'}
          `}
                            >
                                Transactions
                            </Button>
                        </Link>
                    </div>
                </div>


                <Sheet>
                    <SheetTrigger asChild className="md:hidden">

                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className=" p-2 bg-white shadow-xl dark:bg-gray-800">
                        <div className="flex flex-col gap-4 mt-8">
                            <button
                                className="px-4 py-2 bg-white rounded-md text-sm font-medium shadow-sm cursor-pointer border dark:text-white dark:bg-gray-800">
                                Dashboard
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium cursor-pointer border rounded-md">Transactions
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>

                <Link href="/notifications">
                <Button variant="outline" size="icon" className={"relative cursor-pointer"}>
                    <BellIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                </Link>
                <SwitchTheme />

                <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 md:h-9 md:w-9">
                        <Avatar className="h-8 w-8 md:h-9 md:w-9">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <CircleUser className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Paramètres</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Déconnexion</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
