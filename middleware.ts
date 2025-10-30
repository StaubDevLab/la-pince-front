import { auth } from "@/auth"

export default auth((req) => {
    const publicPaths = [
        "/",
        "/app/connexion",
        "/app/inscription",
        "/app/forgot-password",
        "/app/mentions-legales",
        "/app/contact",
        "/app/a-propos",
        "/app/conditions-generales",
        "/_next/image" 
    ];

    const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

  
    if (!req.auth && !isPublicPath) {
        const newUrl = new URL("/app/connexion", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)'],
}
