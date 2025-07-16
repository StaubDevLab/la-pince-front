// types/next-auth.d.ts

// Importe les types par défaut de next-auth et next-auth/jwt
import { DefaultSession } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * L'interface Session est ce qui est exposé côté client via useSession().
   * Nous ajoutons nos champs personnalisés et la gestion d'erreur.
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      accountName: string;
      amount: number;
      accessToken: string;
      accessTokenExpiresAt: number; 
      refreshToken: string;
      refreshTokenExpiresAt: number; 
      sessionId: string;
      firstLogin?: boolean;
      currency: string;
      locale: string;
    } | null; 
    accessToken: string; 
    error?: "RefreshAccessTokenError" | "RefreshTokenExpired"; 
  }

  /**
   * L'interface User est ce qui est retourné par la fonction `authorize` du provider Credentials.
   * Elle doit correspondre exactement aux données que votre API renvoie lors de la connexion.
   */
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountName: string;
    amount: number;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number; 
    refreshTokenExpiresAt: number; 
    sessionId: string;
    firstLogin: boolean;
    currency: string;
    locale: string;
  }
}



declare module "next-auth/jwt" {
  /**
   * L'interface JWT est la structure du token JWT interne géré par NextAuth.js.
   * Elle stocke les données qui persistent entre les requêtes.
   */
  interface JWT extends NextAuthJWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountName: string;
    amount: number;
    accessToken: string;
    accessTokenExpiresAt: number; 
    refreshToken: string;
    refreshTokenExpiresAt: number; 
    sessionId: string;
    firstLogin?: boolean;
    currency: string;
    locale: string;
  
    error?: "RefreshAccessTokenError" | "RefreshTokenExpired"; 
  }
}