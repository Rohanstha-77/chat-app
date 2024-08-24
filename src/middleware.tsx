import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    async(req)=>{
        const pathname = req.nextUrl.pathname

        //manage routh protection
        const isAuth = await getToken({req})
        const isLogin = pathname.startsWith('/login')

        const sensitiveRoutes = ["/dashboard"]
        const isAccessiongSensitiveRoute = sensitiveRoutes.some((route)=> pathname.startsWith(route))

        if(isLogin){
            if(isAuth){
                return NextResponse.redirect(new URL ('/dashboard',req.url))
            }
            return NextResponse.next()
        }
        if(!isAuth && isAccessiongSensitiveRoute){
            return NextResponse.redirect(new URL('/login',req.url))
        }
        if(pathname==='/'){
            return NextResponse.redirect(new URL('/login',req.url))
        }
    },{
        callbacks:{
            async authorized(){
                return true
            }
        }
    }
)

export const config ={
    matcher:['/','/login','/dashboard/:path*']
}