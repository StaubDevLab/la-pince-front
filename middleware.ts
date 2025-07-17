import { auth } from "@/auth"

export default auth((req) => {
    if (!req.auth && req.nextUrl.pathname !== "/app/connexion" && req.nextUrl.pathname !== "/app/inscription" && req.nextUrl.pathname !== "/app/forgot-password" && req.nextUrl.pathname !== "/app/mentions-legales" && req.nextUrl.pathname !== "/app/contact" && req.nextUrl.pathname !== "/app/a-propos" && req.nextUrl.pathname !== "/app/conditions-generales" && req.nextUrl.pathname !== "/") {
        const newUrl = new URL("/app/connexion", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|la-pince-logo|reset-password|forgot-password|mentions-legales|contact|a-propos|conditions-generales|politique-privacite).*)"],
}
