import NextAuth from "next-auth"
import Credentials from "@auth/core/providers/credentials"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"
import type { User } from "next-auth"
import type { AdapterUser } from "@auth/core/adapters"

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    })

    const refreshedTokens = await response.json()

    if (process.env.NODE_ENV !== "production") {
      console.log("Token in refreshAccessToken", refreshedTokens)
    }

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpiresAt: Date.now() + refreshedTokens.accessTokenExpiresAt,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      refreshTokenExpiresAt: refreshedTokens.refreshTokenExpiresAt
        ? new Date(refreshedTokens.refreshTokenExpiresAt).getTime()
        : token.refreshTokenExpiresAt,
      error: undefined,
    } as JWT
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error)
    return { ...token, accessToken: null as any, error: "RefreshAccessTokenError" } as JWT
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.API_URL}/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })

        const data = await response.json()

        if (!response.ok || !data.user) {
          throw new Error(data.message || "Authentication failed")
        }

        return {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          accountName: data.user.accountName,
          amount: data.user.amount,
          accessToken: data.accessToken,
          accessTokenExpiresAt: new Date(data.accessTokenExpiresAt).getTime(),
          refreshToken: data.refreshToken,
          refreshTokenExpiresAt: new Date(data.refreshTokenExpiresAt).getTime(),
          sessionId: data.sessionId,
          firstLogin: data.user.firstLogin,
          currency: data.user.currency,
          locale: data.user.locale,
        } as User
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user,trigger }) {
      if (trigger === "update") {
        return {
          ...token,
          firstLogin: false,
        } as JWT
      }
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          accountName: user.accountName,
          amount: user.amount,
          accessToken: user.accessToken,
          accessTokenExpiresAt: user.accessTokenExpiresAt,
          refreshToken: user.refreshToken,
          refreshTokenExpiresAt: user.refreshTokenExpiresAt,
          sessionId: user.sessionId,
          firstLogin: user.firstLogin,
          currency: user.currency,
          locale: user.locale,
          error: undefined,
        } as JWT
      }

      if (Date.now() > (token.refreshTokenExpiresAt || 0)) {
        console.warn("Refresh Token expiré. Forcing la déconnexion.")
        return { ...token, error: "RefreshTokenExpired", accessToken: null as any } as JWT
      }

      if (Date.now() < (token.accessTokenExpiresAt || 0)) {
        return token
      }

      const refreshedToken = await refreshAccessToken(token)
      if (refreshedToken.error) {
        console.error("Rafraîchissement du token échoué. L'utilisateur devra se reconnecter.")
      }
      return refreshedToken
    },
    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError" || token.error === "RefreshTokenExpired") {
        return {
          ...session,
          user: null,
          accessToken: "",
          error: token.error,
        } as Session
      }

      session.user = {
        id: token.id,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        accountName: token.accountName,
        amount: token.amount,
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        firstLogin: token.firstLogin,
        currency: token.currency,
        locale: token.locale,
      } as AdapterUser

      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: "/connexion",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
})
