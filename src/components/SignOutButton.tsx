"use client"
import React, { ButtonHTMLAttributes, useState } from 'react'
import Button from './ui/Button'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}

const SignOutButton = ({...props}) => {
    const [isSignOut, setisSignOut] = useState(false)
  return (
    <>
        <Button {...props} varient='ghost' onClick ={async ()=>{
            setisSignOut(true)
            try {
                await signOut()
            } catch (error) {
                toast.error("There is a problem while signing out")
                console.log("There is a problem while signing out", error)
            }finally{
                setisSignOut(false)
            }
        }}>
            {isSignOut ? (
                <Loader2 className='animate-spin h-4 w-4'/>
            ):(
                <LogOut className='w-4 h-4'/>
            )}
        </Button>
    </>
  )
}

export default SignOutButton