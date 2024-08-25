import { string } from "zod";

interface User{
    name: string
    email: string
    image: string
    id: string
}

interface Chat{
    id: string
    messages: string[]
}

interface Messages{
    id: string
    senderId: string
    receiverId: string
    text: string
    timeStamp: number
}

interface FriendRequest{
    id: string
    senderId: string
    receiverId: string
}