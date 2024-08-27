import AddFriendButton from '@/components/AddFriendButton'
import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/libs/auth'
import { User } from '@/types/db'
import { getServerSession } from 'next-auth'
// import { notFound } from 'next/navigation'
import React from 'react'

const Page = async () => {
  const session = await getServerSession(authOptions)
  console.log(session)
  if (!session) console.log("not found")

  const incomingSenderIds = (await fetchRedis('smembers', `user:${session?.user?.id}:incoming_friend_requests`)) as string[] || null

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string
      if (!sender) {
        console.error(`No data found for user ID: ${senderId}`)
        return { senderId, senderEmail: '' }
      }
      try {
        const senderParsed = JSON.parse(sender) as User
        return {
          senderId,
          senderEmail: senderParsed.email,
        }
      } catch (error) {
        console.error(`Error parsing JSON for user ID: ${senderId}`, error)
        return { senderId, senderEmail: '' }
      }
    })
  )

  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests
          incomingFriendRequest={incomingFriendRequests}
          sessionId={session?.user?.id}
        />
      </div>
    </main>
  )
}

export default Page
