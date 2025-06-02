import NextAuth from "next-auth"
import Credentials from '@auth/core/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {  },
                password: { },
            },
            async authorize(credentials) {
                console.log("CREDENTIALS",credentials)
                const response = await fetch('https://api.la-pince.tech/v1/api/auth/signin',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                })
                const data = await response.json()
                if (!response.ok || !data.user) {
                    throw new Error(data.message || 'Authentication failed')
                }

                return {
                    ...data.user,                // id, email, etc.
                    accessToken: data.access_token,
                }
            },
        }),
    ],
    callbacks:{
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.accountName = user.accountName
                token.amount = user.amount
                token.accessToken = user.accessToken
            }
            return token
        },
        async session({ session, token }) {
            session.user = {
                id: token.id as string,
                email: token.email as string,
                firstName: token.firstName as string,
                lastName: token.lastName as string,
                accountName: token.accountName as string,
                amount: token.amount as number,
                accessToken: token.accessToken as string,
                emailVerified: token.emailVerified as Date,
            }
            session.accessToken = token.accessToken as string
            return session
        },


    },
    pages: {
        signIn: '/connexion',

    },

    session: {
        strategy: 'jwt',
    },

    secret: process.env.NEXTAUTH_SECRET,
})
