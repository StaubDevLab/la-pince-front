'use client'
import React, { createContext, useContext, useState } from "react"
import { User } from "@/types/user"

type UserContextType = {
  user: Partial<User>
  setUser: React.Dispatch<React.SetStateAction<Partial<User>>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Partial<User>>({ firstName: '', lastName: '', email: '' })
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within a UserProvider")
  return context
}