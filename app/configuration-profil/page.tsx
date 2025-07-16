"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import LoadingSpinner from "@/components/loading-spinner"
import { completeProfileSetup } from "@/actions/profile.actions"
import type { ProfileSetupFormData } from "@/types/profile-setup"

const CURRENCIES = [
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "USD", label: "Dollar US ($)", symbol: "$" },
  { value: "GBP", label: "Livre Sterling (£)", symbol: "£" },
  { value: "JPY", label: "Yen Japonais (¥)", symbol: "¥" },
  { value: "AUD", label: "Dollar Australien (A$)", symbol: "A$" },
  { value: "CAD", label: "Dollar Canadien (C$)", symbol: "C$" },
  { value: "CHF", label: "Franc Suisse (CHF)", symbol: "CHF" },
  { value: "CNY", label: "Yuan Chinois (¥)", symbol: "¥" },
  { value: "SEK", label: "Couronne Suédoise (kr)", symbol: "kr" },
  { value: "NZD", label: "Dollar Néo-Zélandais (NZ$)", symbol: "NZ$" },
] as const

const LOCALES = [
  { value: "fr-FR", label: "Français" },
  { value: "en-US", label: "English" },
  { value: "es-ES", label: "Español" },
  { value: "de-DE", label: "Deutsch" },
  { value: "it-IT", label: "Italiano" },
] as const

export default function ConfigurationProfil() {
  const { data: session, update, status } = useSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<ProfileSetupFormData>({
    accountName: session?.user?.accountName || "Mon compte principal",
    currency: (session?.user?.currency as ProfileSetupFormData["currency"]) || "EUR",
    locale: (session?.user?.locale as ProfileSetupFormData["locale"]) || "fr-FR",
    totalAmount: session?.user?.amount || 0,
  })

  // Rediriger si ce n'est pas le premier login
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Vérification du profil..." />
      </div>
    )
  }

  if (session && !session.user?.firstLogin) {
    router.push("/dashboard")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Redirection vers le tableau de bord..." />
      </div>
    )
  }

  if (!session) {
    router.push("/connexion")
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const result = await completeProfileSetup(formData)

        if (!result.success) {
          toast.error(result.error || "Erreur lors de la configuration du profil")
          return
        }

        // Mettre à jour la session pour marquer firstLogin comme false
        // Success message already handled by toast.success
        await update({
          ...session,
          user: {
            ...session?.user,
            firstLogin: false,
            accountName: formData.accountName,
            currency: formData.currency,
            locale: formData.locale,
            amount: formData.totalAmount,
          },
        })

        toast.success("Profil configuré avec succès !")
        router.push("/dashboard")
      } catch (error) {
        console.error("Erreur:", error)
        toast.error("Erreur lors de la configuration du profil")
      }
  }

  const handleInputChange = (field: keyof ProfileSetupFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedCurrency = CURRENCIES.find((c) => c.value === formData.currency)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Configuration de votre profil</CardTitle>
          <CardDescription>Bienvenue ! Configurez votre compte pour commencer à utiliser La Pince.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accountName">Nom du compte</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => handleInputChange("accountName", e.target.value)}
                placeholder="Mon compte principal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value as ProfileSetupFormData["currency"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value} disabled={currency.value!="EUR"}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locale">Langue</Label>
              <Select
                value={formData.locale}
                onValueChange={(value) => handleInputChange("locale", value as ProfileSetupFormData["locale"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCALES.map((locale) => (
                    <SelectItem key={locale.value} value={locale.value} disabled={locale.value!="fr-FR"}>
                      {locale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">Montant initial {selectedCurrency && `(${selectedCurrency.symbol})`}</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.totalAmount}
                onChange={(e) => handleInputChange("totalAmount", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
              <p className="text-sm text-gray-500">Montant de départ de votre compte (peut être modifié plus tard)</p>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Configuration en cours..." : "Terminer la configuration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
