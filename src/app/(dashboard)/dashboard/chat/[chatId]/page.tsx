import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { messagesArrayValidator } from '@/libs/validation/messages'
import { Messages, User } from '@/types/db'
import clsx from 'clsx'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'

interface pageProps{
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId: string){
  try {
    const result: string[] =await fetchRedis("zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    )
    const dbMessages = result.map((message)=>(
      JSON.parse(message) as Messages
    ))

    const reverseDbMessages = dbMessages.reverse()

    const messages = messagesArrayValidator.parse(reverseDbMessages)

    return messages
  } catch (error) {
    notFound()
  }
}

const page = async ({params}: pageProps) => {
  const {chatId} = params
  const session = await getServerSession(authOptions)
  // console.log(session)

  if(!session) return console.log(" session not found")

    const {user} = session

    const [userId1 , userId2] = chatId.split('--')

    // if(user.id !== userId1 && user.id !== userId2){
    //   notFound()
    // }

    const chatPatnerId = user.id === userId1 ? userId2: userId2
    const chatPatner= (await db.get(`user:${chatPatnerId}`)) as User
    const initialMessages = await getChatMessages(chatId)


  return (
    <>
      <div className='flex-1 justify-between flex flex-col'>
        {params.chatId}
      </div>
    </>
  )
}

export default page