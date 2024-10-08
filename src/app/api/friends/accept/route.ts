import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/libs/auth"
import { db } from "@/libs/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

export const POST = async (req: Request) =>{
    try {
        const body = await req.json()

        const {id: idToAdd } = z.object({id: z.string()}).parse(body)

        const session = await getServerSession(authOptions)

        if(!session){
            return new Response ('unauthorized', {status:401})
        }

        // verify both users are not already friends

        const isAlreadyFriends =  await fetchRedis('sismember',`user:${session.user.id}:friends`,idToAdd)

        if(isAlreadyFriends) {
            return new Response('Already friends',{status: 400})
        }

        const hasFriendRequest = await fetchRedis('sismember',`user:${session.user.id}:incoming_friend_requests`,idToAdd)
        // console.log(hasFriendRequest)

        if(!hasFriendRequest) {
            return new Response('No friend request', {status: 400})
        }

        await db.sadd(`user:${session.user.id}:friends`, idToAdd)
        await db.sadd(`user:${idToAdd}:friend`,session.user.id)

        // await db.srem(`user:${idToAdd}:outbound_friend_requests`, session.user.id)

        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)

        return new Response('OK')

    } catch (error) {
        console.log(error)
        if(error instanceof z.ZodError){
            return new Response('Invalid request payload', {status:422})
        }

        return new Response('invalid request', {status:400})
    }
}