import AddFriendButton from '@/components/AddFriendButton'
import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/libs/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'

const page = async () => {
    const session = await getServerSession(authOptions)
    if(!session) notFound()


    const incommingSenderIds = (await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`)) as string[]

    const incomingFriendRequest: IncommingFriendRequest[] = await Promise.all(
        incommingSenderIds.map(async (senderIds)=>{
            const sender =  await fetchRedis('get',`user:${senderIds}`) as string
            const senderParsed = JSON.parse(sender) as User
            return {
                senderId: senderIds,
                senderEmail: senderParsed.email,
            }
        })
    )
    // console.log("Incomming Friend Request:", incomingFriendRequest)

    
  return (
    <>
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
            <div className='flex flex-col gap-4'>
                <FriendRequests incomingFriendRequest={incomingFriendRequest} sessionId={session.user.id}/>
            </div>
        </main>
    </>
  )
}

export default page