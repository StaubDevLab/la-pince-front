"use client"
import { useEffect, useState } from "react"
import { CreateCategoryDialog } from "../category-dialog/CategoryDialog"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { getProfile } from "@/actions/profile.actions"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { updateGlobalBudget } from "@/actions/budget.actions"
import { toast } from "sonner"

const MyData = () => {

    const [userId, setUserId] = useState<string>()
    const [amount, setAmount] = useState<number>()

    useEffect(() => {
        getProfile().then((res) => {
            if(res.success && res.data) {
                setUserId(res.data.id)
                setAmount(res.data.amount)
            } else {
                console.error('Erreur lors de la récupération du profil:', res.error)
            }
        }).catch((error) => {
            console.error('Erreur inattendue lors de la récupération du profil:', error)
        })
    }, [])

    const handleChangeAmount = async () => {
        if (userId && amount) {
            try {
                const res = await updateGlobalBudget({userId, amount})
                if (res.success) {
                    toast.success(res.message)
                } else {
                    toast.error(res.message)
                }
            } catch(e) {
                console.error(e)
            }
        }
    }
        return <Card className='mb-6'>
            <CardHeader>
                <CardTitle className="text-lg font-medium">Mes données</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row items-end gap-4 flex-wrap">
                <CreateCategoryDialog
                    isEditMod={true}
                    triggerElement={<Button>Modifier mes catégories</Button>}
                />
                    <div className="flex flex-col flex-1 min-w-[150px]">
                        <Label htmlFor="amount" className="mb-1">Budget</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount ?? ''}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                        />
                    </div>
                <Button onClick={handleChangeAmount}>Enregistrer</Button>
            </CardContent>
        </Card>
}

export default MyData