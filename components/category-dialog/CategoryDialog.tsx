'use client'

import React, { useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { HexColorPicker } from "react-colorful"
import { Badge } from '../ui/badge'
import * as Lucide from 'lucide-react'
import { toast } from 'sonner'
import { CategoryItem } from '../category-item'
import { createCategory, revalidateCategoriesCache } from '@/actions/categories.actions'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { getLucideIcons } from '@/lib/utils'

const iconsArray = getLucideIcons()

export const CreateCategoryDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const iconListRef = useRef<HTMLDivElement>(null)
  const [visibleIconsCount, setVisibleIconsCount] = useState(50)
  const [open, setOpen] = useState(false)
  const [openSelectIcon, setOpenSelectIcon] = useState(false)
  const [searchIcon, setSearchIcon] = useState('')

  const [form, setForm] = useState({ name: '', color: '#bb11cc', icon: 'TreePine' })

  const filteredIcons = iconsArray.filter(icon =>
    icon.name.toLowerCase().includes(searchIcon.toLowerCase())
  )
  console.log(filteredIcons)

  const handleScroll = () => {
    const list = iconListRef.current
    if (!list) return
    const { scrollTop, scrollHeight, clientHeight } = list
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleIconsCount(prev => Math.min(prev + 50, iconsArray.length))
    }
  }

  const handleCreate = async () => {
    const result = await createCategory(form)
    if (result.success) {
      toast.success('Catégorie créée')
      await revalidateCategoriesCache()
      onSuccess?.()
      setOpen(false)
    } else {
      toast.error('Erreur lors de la création')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button size="icon" className="rounded-full p-1 text-md bg-primary text-white">
          <Lucide.PlusIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="mb-2">Création d&apos;une catégorie</DialogTitle>
          <DialogDescription>Remplissez les champs ci-dessous pour ajouter une nouvelle catégorie.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Équitation..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Icône</Label>
              <Popover open={openSelectIcon} onOpenChange={setOpenSelectIcon} modal={false}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {form.icon || 'Sélectionner une icône'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher une icône..."
                      className="h-9"
                      value={searchIcon}
                      onValueChange={(val) => {
                        setSearchIcon(val)
                        setVisibleIconsCount(val ? filteredIcons.length : 50)
                      }}
                    />
                    <CommandList onScroll={handleScroll} ref={iconListRef} className="max-h-[300px] overflow-auto">
                      <CommandEmpty>Aucune icône trouvée.</CommandEmpty>
                      <CommandGroup>
                        {(searchIcon ? filteredIcons : iconsArray.slice(0, visibleIconsCount)).map(icon => {
                          const Icon = icon.component
                          return (
                            <CommandItem key={icon.name} value={icon.name} onSelect={() => {
                              setForm({ ...form, icon: icon.name })
                              setOpenSelectIcon(false)
                            }}>
                              <div className="flex items-center justify-between w-full">
                                <span>{icon.name}</span>
                                <Icon className="ml-2 w-4 h-4" />
                              </div>
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 mt-2 items-start">
            <div className="grid gap-2">
              <Label>Couleur</Label>
              <HexColorPicker color={form.color} onChange={(color) => setForm({ ...form, color })} />
            </div>
            <div className="flex flex-col gap-2 h-full">
              <Label>Prévisualisation</Label>
              <div className="rounded-2xl border bg-gradient-to-br from-[#111] to-[#1a1a1a] shadow p-6 flex items-center justify-center">
                <Badge style={{ backgroundColor: form.color }} className="text-white py-2 w-full justify-center">
                  <CategoryItem category={{ name: form.name || 'Catégorie' }} iconName={form.icon} />
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleCreate}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
