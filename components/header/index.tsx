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

export default function Header() {
    return (
        <header className="flex items-center justify-between p-3 md:p-4 border-b dark:text-white">
            {/* Logo et titre - responsive */}
            <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                    <Image
                        src="/la-pince-logo-color.png"
                        alt="Logo de l'application La pince qui représente un crabe à lunettes"
                        width={100}
                        height={100}
                    />
                </div>
                <div>
                    <h1 className="hidden sm:block md:text-2xl lg:text-3xl font-medium">
                        Bienvenue, <span className="font-bold">Bob L'éponge 🧽</span> !
                    </h1>
                    {/* Version mobile du titre */}
                    <h1 className="text-lg sm:hidden font-medium">
                        Bonjour, <span className="font-bold">Bob</span> !
                    </h1>
                </div>
            </div>

            {/* Navigation et actions - responsive */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Navigation sur desktop */}
                <div className="hidden md:flex rounded-full bg-gray-100">
                    <button className="px-4 py-1.5 bg-white rounded-full text-sm font-medium shadow-sm cursor-pointer">
                        Dashboard
                    </button>
                    <button className="px-4 py-1.5 text-sm font-medium cursor-pointer">Transactions</button>
                </div>


                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className=" p-2 bg-white shadow-xl">
                        <div className="flex flex-col gap-4 mt-8">
                            <button className="px-4 py-2 bg-white rounded-md text-sm font-medium shadow-sm cursor-pointer border">
                                Dashboard
                            </button>
                            <button className="px-4 py-2 text-sm font-medium cursor-pointer border rounded-md">Transactions</button>
                        </div>
                    </SheetContent>
                </Sheet>


                <button className="relative h-8 w-8 flex items-center justify-center">
                    <BellIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>


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
