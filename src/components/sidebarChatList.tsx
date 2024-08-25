
"use client"
import { chatHrefConstructor } from '@/libs/ultils'
import { Message } from '@/libs/validation/messages'
import { User } from '@/types/db'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface SidebarChatListProps{
  friends: User[]
  sessionId: string
}


const SidebarChatList = ({friends, sessionId}:SidebarChatListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  
  const [unseenMessage, setunseenMessage] = useState<Message[]>([])

  useEffect(()=>{
    if(pathname?.includes('chat')){
      setunseenMessage((prev)=>{
        return prev.filter((msg)=>!pathname.includes(msg.senderId))
      })
    }
  },[pathname])
  
  return (
    <>
      <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
        {friends.sort().map((friend)=>{
          const unseenMessageCount = unseenMessage.filter((unseenMsg)=>{
            return unseenMsg.senderId === friend.id
          }).length
          return <li key={friend.id}>
            <a className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold' href={`/dashboard/chat/${chatHrefConstructor(sessionId,friend.id)}`}>
              {friend.name} {unseenMessageCount >0 ?(
              <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                {unseenMessageCount}
              </div>
              ):null}
            </a>
          </li>
        })}
      </ul>
    </>
  )
}

export default SidebarChatList