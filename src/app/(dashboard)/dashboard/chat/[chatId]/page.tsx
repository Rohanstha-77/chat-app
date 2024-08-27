import ChatInput from '@/components/ChatInput'
import Message from '@/components/Messages'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { messagesArrayValidator } from '@/libs/validation/messages'
import { Messages, User } from '@/types/db'
import clsx from 'clsx'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

interface PageProps {
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    )
    const dbMessages = result.map((message) => (
      JSON.parse(message) as Messages
    ))

    const reverseDbMessages = dbMessages.reverse()
    const messages = messagesArrayValidator.parse(reverseDbMessages)

    return messages
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    notFound()
  }
}

const Page = async ({ params }: PageProps) => {
  const { chatId } = params
  // console.log('Raw chatId from URL:', chatId)

  // Decode chatId to handle encoded spaces and special characters
  const decodedChatId = decodeURIComponent(chatId).trim()
  // console.log('Decoded chatId:', decodedChatId)

  const session = await getServerSession(authOptions)

  if (!session) {
    console.log("Session not found")
    notFound()
  }

  const { user } = session
  const [userId1, userId2] = decodedChatId.split('--').map(id => id.trim())

  // console.log('Parsed userId1:', userId1)
  // console.log('Parsed userId2:', userId2)
  // console.log('Current User ID:', user.id)
  
  if (user.id !== userId1 && user.id !== userId2) {
    console.log('Unauthorized access')
    notFound()
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User

  if (!chatPartner) {
    console.log('Missing chat partner')
    notFound()
  }

  const initialMessages = await getChatMessages(decodedChatId)

  return (
    <>

      <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-2rem)]'>
        <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
          <div className='relative flex items-center space-x-4'>
            <div className="relative">
              <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                <Image
                  fill
                  referrerPolicy='no-referrer'
                  src={chatPartner.image}
                  alt={`${chatPartner.name} profile picture`}
                  className='rounded-full'
                />
              </div>
            </div>

            <div className='flex flex-col leading-tight'>
              <div className='text-xl flex items-center'>
                <span className='text-gray-700 mr-3 font-semibold'>
                  {chatPartner.name}
                </span>
              </div>

              <span className='text-sm text-gray-600'>{chatPartner.email}</span>
            </div>
          </div>
        </div>

        <Message sessionId={session.user.id} initialMessages={initialMessages.map(message => ({ ...message, receiverId: '' }))} chatId={chatId} sessionImg={session.user.image} chatPartner={chatPartner}/>

        <ChatInput chatId={decodedChatId} chatPartner={chatPartner}/>
      </div>
    </>
  )
}

export default Page
