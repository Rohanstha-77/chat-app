import { authOptions } from "@/libs/auth"
import { addFriendValidator } from "@/libs/validation/add-friend"
import { getServerSession } from "next-auth"
import { fetchRedis } from "@/helpers/redis"
import { db } from "@/libs/db"
import { z } from "zod"

export const POST = async (req: Request)=>{
    try {
        const body = await req.json()

        const {email: emailToAdd} = addFriendValidator.parse(body.email)

        const idToAdd: string = await fetchRedis('get',`user:email:${emailToAdd} `)


        if(!idToAdd){
            return new Response('This Person does not exist',{status:401})
        }
        const session =await getServerSession(authOptions)
        if(!session){
            return new Response('Unauthorized',{status:401})
        }
        if(idToAdd === session.user.id){
            return new Response ('You cannot add yourself',{status:400})
        }
        // check if user is already added
        const isAlreadyAdded: boolean  = (await fetchRedis('sismember',`user:${idToAdd}:incoming_friend_request`, session.user.id)) 

        if (isAlreadyAdded) {
            return new Response ('Already added this user', {status:400})
        }

        const isAlreadyFriends: boolean  = ( await fetchRedis('sismember',`user:${idToAdd}:friends`, idToAdd))

        if (isAlreadyFriends) {
            return new Response ('Already friends with this user', {status:400})
        }
        //valid request and send friend request

        db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

        return new Response('ok')

        // console.log(data)
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('invalid request payload',{status:422})
        }
        return new Response('Invalid Request', {status:400})
    }
}