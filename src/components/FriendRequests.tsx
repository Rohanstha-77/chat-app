"use client"

import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type FriendRequestProps={
    incomingFriendRequest: IncommingFriendRequest[]
    sessionId: string
}

const FriendRequests = ({incomingFriendRequest, sessionId}: FriendRequestProps) => {
    const router = useRouter()
    const [FriendRequest, setFriendRequest] = useState<IncommingFriendRequest[]>(
        incomingFriendRequest
    )

    const acceptFriend = async (senderId : string)=>{
        await axios.post('/api/friends/accept',{id:senderId})

        setFriendRequest((prev) => prev.filter((request)=> request.senderId !== senderId)) 
        router.refresh()
    }
    const denyFriend = async (senderId : string)=>{
        await axios.post('/api/friends/deny',{id:senderId})

        setFriendRequest((prev) => prev.filter((request)=> request.senderId !== senderId)) 
        router.refresh()
    }
  return (
    <>
        {FriendRequest.length === 0 ?(
            <p className='text-small text-zinc-500'>Nothing to show.....</p>
        ):(
            FriendRequest.map((request)=>(
                <div key={request.senderId} className='flex gap-4 items-centre'>
                    <UserPlus className='text-black'/>
                    <p className='font-medium text-lg'>{request.senderEmail}</p>
                    <button aria-label='accept-friend' onClick={()=> acceptFriend(request.senderId)} className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                        <Check className='font-semibold text-white w-3/4 h-3/4'/>
                    </button>

                    <button onClick={()=> denyFriend(request.senderId)} aria-label='deny-friend' className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                        <X className='font-semibold text-white w-3/4 h-3/4'/>
                    </button>
                </div>
            ))
        )}
    </>
  )
}

export default FriendRequests