import '../globals.css'
import ClientLayout from '@/components/client-layout'
import { SessionProvider } from 'next-auth/react'

import { UserProvider } from '@/context/user-context'
import ToasterComponent from '@/components/toaster'


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
      
     
          
                <UserProvider>
                    <ClientLayout>
                        <ToasterComponent />
                        {children}


                    </ClientLayout>
                </UserProvider>
            
      
    )
}
