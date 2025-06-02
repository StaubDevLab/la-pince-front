"use client"

import { useState } from "react"
import { Edit, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    //TODO: Récupérer les données du profil
    const [profileData, setProfileData] = useState({
        name: "John DOE",
        email: "john.doe@hello.fr",
        phone: "01 23 45 67 89",
        accountName: "Mon compte personnel",
    })

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    })

    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    })

    const handleProfileChange = (field: string, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }))

        if (field === "newPassword") {
            validatePassword(value)
        }
    }

    const validatePassword = (password: string) => {
        setPasswordRequirements({
            minLength: password.length >= 12,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        })
    }

    // Logique pour sauvegarder le profil
    //TODO: Appel API pour sauvegarder le profil
    const handleSaveProfile = () => {
        setIsEditing(false)
        console.log("Profil sauvegardé:", profileData)
    }

    //Pour sauvegarder le mot de passe
    //TODO: Appel API pour sauvegarder le mot de passe
    const handleSavePassword = () => {
        if (passwordData.newPassword === passwordData.confirmPassword) {
            console.log("Mot de passe modifié")
            setPasswordData({ newPassword: "", confirmPassword: "" })
        }
    }

    const allPasswordRequirementsMet = Object.values(passwordRequirements).every((req) => req)

    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Mon profil</h1>
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        {isEditing ? "Annuler" : "Éditer"}
                    </Button>
                </div>

                {/* Informations personnelles */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="w-16 h-16 bg-[#f97316]">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="bg-[#f97316] text-white">
                                    <User className="w-8 h-8" />
                                </AvatarFallback>
                            </Avatar>
                            {isEditing ? (
                                <Input
                                    value={profileData.name}
                                    onChange={(e) => handleProfileChange("name", e.target.value)}
                                    className="text-xl font-semibold"
                                />
                            ) : (
                                <h2 className="text-xl font-semibold">{profileData.name}</h2>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-sm text-gray-600 mb-1 block">Adresse Email</Label>
                                {isEditing ? (
                                    <Input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => handleProfileChange("email", e.target.value)}
                                    />
                                ) : (
                                    <p className="font-medium">{profileData.email}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm text-gray-600 mb-1 block">Téléphone</Label>
                                {isEditing ? (
                                    <Input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => handleProfileChange("phone", e.target.value)}
                                    />
                                ) : (
                                    <p className="font-medium">{profileData.phone}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label className="text-sm text-gray-600 mb-1 block">Nom de votre compte</Label>
                                {isEditing ? (
                                    <Input
                                        value={profileData.accountName}
                                        onChange={(e) => handleProfileChange("accountName", e.target.value)}
                                    />
                                ) : (
                                    <p className="font-medium">{profileData.accountName}</p>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end mt-6">
                                <Button onClick={handleSaveProfile} className="bg-[#f97316] hover:bg-[#ea6a0a]">
                                    Enregistrer
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Modifier mon mot de passe */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Modifier mon mot de passe</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Label htmlFor="newPassword" className="text-sm text-gray-600 mb-1 block">
                                    Nouveau mot de passe
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                    placeholder="Entrez votre nouveau mot de passe"
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="text-sm text-gray-600 mb-1 block">
                                    Confirmation
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                    placeholder="Confirmez votre mot de passe"
                                />
                            </div>
                        </div>

                        {/* Exigences du mot de passe */}
                        <div className="mb-6">
                            <ul className="space-y-1 text-sm">
                                <li
                                    className={`flex items-center gap-2 ${passwordRequirements.minLength ? "text-green-600" : "text-gray-500"}`}
                                >
                  <span
                      className={`w-2 h-2 rounded-full ${passwordRequirements.minLength ? "bg-green-600" : "bg-gray-300"}`}
                  ></span>
                                    Minimum 12 caractères
                                </li>
                                <li
                                    className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? "text-green-600" : "text-gray-500"}`}
                                >
                  <span
                      className={`w-2 h-2 rounded-full ${passwordRequirements.hasLowercase ? "bg-green-600" : "bg-gray-300"}`}
                  ></span>
                                    Minimum une minuscule
                                </li>
                                <li
                                    className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? "text-green-600" : "text-gray-500"}`}
                                >
                  <span
                      className={`w-2 h-2 rounded-full ${passwordRequirements.hasUppercase ? "bg-green-600" : "bg-gray-300"}`}
                  ></span>
                                    Minimum une majuscule
                                </li>
                                <li
                                    className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? "text-green-600" : "text-gray-500"}`}
                                >
                  <span
                      className={`w-2 h-2 rounded-full ${passwordRequirements.hasNumber ? "bg-green-600" : "bg-gray-300"}`}
                  ></span>
                                    Minimum 1 chiffre
                                </li>
                                <li
                                    className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}
                                >
                  <span
                      className={`w-2 h-2 rounded-full ${passwordRequirements.hasSpecialChar ? "bg-green-600" : "bg-gray-300"}`}
                  ></span>
                                    Minimum 1 caractère spécial
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={handleSavePassword}
                                disabled={
                                    !allPasswordRequirementsMet ||
                                    passwordData.newPassword !== passwordData.confirmPassword ||
                                    !passwordData.newPassword
                                }
                                className="bg-[#f97316] hover:bg-[#ea6a0a] disabled:bg-gray-300"
                            >
                                Enregistrer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
