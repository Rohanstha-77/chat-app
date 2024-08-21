"use client"

import React, { useState } from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@/libs/validation/add-friend'
import axios, { AxiosError } from "axios"
import { z } from 'zod'
import {useForm} from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

type FormData= z.infer<typeof addFriendValidator>

const AddFriendButton = () => {
    const [ShowSucessRate, setShowSucessRate] = useState(false)
    const { register, handleSubmit, setError, formState:{errors} } = useForm<FormData>({
        resolver:zodResolver(addFriendValidator)
    })
    const addFriend= async (email:string)=>{
        try {
           const validateEmail = addFriendValidator.parse({email})

           await axios.post("/api/friends/add",{
            email: validateEmail
           })
           setShowSucessRate(true)
        } catch (error) {
            if(error instanceof z.ZodError){
                setError('email',{message:error.message})
                return toast.error("invalid email format")
            }
            if(error instanceof AxiosError){
                setError('email',{message: error.response?.data})
                return toast.error("something wrong with email")
            }
            setError('email',{message: "something went wrong"})
        }
    }
    const onSubmit = (data: FormData)=>{
        addFriend(data.email)
    }
  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
            <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-900'>Add Friend by Email</label>

            <div className='mt-2 flex gap-4'>
                <input {...register("email")} type="text" className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder='enter email' />
                <Button varient='default-btn' size='default'>Add</Button>
            </div>
            <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
            {ShowSucessRate ? (
                <p className='mt-1 text-sm text-green-600'> Friend Request Sent</p>
            ):null}
        </form>
    </>
  )
}

export default AddFriendButton
