import type {Session, User} from "next-auth"
import type { JWT } from "next-auth/jwt"

type UserId = string

declare module "next-auth/jwt"{
    interface jwt{
        id: Userid
    }
}

declare module "next-auth"{
    interface Session{
        user : User & {
            id: Userid
        }
    }
}