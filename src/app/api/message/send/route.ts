import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/libs/auth';
import { db } from '@/libs/db'
import { pusherServer } from '@/libs/pusher';
import { toPusherKey } from '@/libs/ultils';
import { Message, messageValidator } from '@/libs/validation/messages'
import { User } from '@/types/db';
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'

export async function POST(req: Request): Promise<Response> {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json()
    // console.log('Received message:', text, 'for chatId:', chatId);
    console.log(chatId)


    // Decode chatId
    // const decodedChatId = decodeURIComponent(chatId).trim();
    // console.log('Decoded chatId:', decodedChatId);

    const session = await getServerSession(authOptions)

    if (!session) return new Response('Unauthorized', { status: 401 })

    // Split the decoded chatId
    const [userId1, userId2] = chatId.split('--')
    // .map(id => id.trim());

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 })
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1

    const friendList = await fetchRedis('smembers', `user:${session.user.id}:friends`) as string[]
    const isFriend = friendList.includes(friendId)

    if (!isFriend) {
      return new Response('Unauthorized', { status: 401 })
    }

    const rawSender = await fetchRedis('get', `user:${session.user.id}`) as string
    const sender = JSON.parse(rawSender) as User

    const timeStamp = Date.now()

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timeStamp,
    }

    const message = messageValidator.parse(messageData)
    // console.log('Validated message:', message);

    // Notify all connected chat room clients
    await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message)
    // console.log('Pusher triggered for chat:', decodedChatId);

    // Notify friend about the new message
    await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
      ...message,
      senderImg: sender.image,
      senderName: sender.name,
    })

    // Save message to database
    await db.zadd(`chat:${chatId}:messages`, {
      score: timeStamp,
      member: JSON.stringify(message),
    })

    // console.log('Message saved to DB for chat:', decodedChatId);
    return new Response('OK')
  } catch (error) {
    console.error('Error processing message:', error)
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
