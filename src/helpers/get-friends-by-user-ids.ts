import { User } from "@/types/db"
import { fetchRedis } from "./redis"

export const getFriendsByuserId= async( userId:string)=>{
    // retrive friends from current user
    const friendsIds = await fetchRedis('smembers', `user:${userId}:friends`) as string[]

    const friends = await Promise.all(
        friendsIds.map(async(friendsId)=>{
            const friends = await fetchRedis('get', `user:${friendsId}`) as string
            const parsedString = JSON.parse(friends)
            return parsedString
        })
    )

    return friends
}