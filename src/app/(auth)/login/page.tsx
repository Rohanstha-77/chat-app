"use client"

import Button from '@/components/ui/Button'
import React ,{useState} from 'react'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

const page = () => {
    const [isLoading, setIsLoading] = useState(false)

    const loginWithGoolge = async ()=>{
        setIsLoading(true)
        try {
            // throw new Error("something Went wrong.")
            await signIn("google")
        } catch (error) {
            toast.error('Something went wrong')
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <>
        <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full dlex flex-col items-center max-w-md space-y-8'>
                <div className='flex flex-col items-center gap-8'>
                    logo
                    <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>Sign in to your account</h2>
                </div>
                <Button isLoading= {isLoading} type="button" title='Login' varient='max-w-sm mx-auto w-full default-btn default' onClick={loginWithGoolge}>
                    {isLoading ? (
                        <div className=' flex justify-center items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M2,12A10.94,10.94,0,0,1,5,4.65c-.21-.19-.42-.36-.62-.55h0A11,11,0,0,0,12,23c.34,0,.67,0,1-.05C6,23,2,17.74,2,12Z"><animateTransform attributeName="transform" dur="0.6s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
                            Goolge
                        </div>
                    ):(
                        <div className='flex justify-center items-center'>
                            <svg
                                className='mr-2 h-4 w-4'
                                aria-hidden='true'
                                focusable='false'
                                data-prefix='fab'
                                data-icon='github'
                                role='img'
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 24 24'>
                                <path
                                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                fill='#4285F4'
                                />
                                <path
                                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                fill='#34A853'
                                />
                                <path
                                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                fill='#FBBC05'
                                />
                                <path
                                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                fill='#EA4335'
                                />
                                <path d='M1 1h22v22H1z' fill='none' />
                            </svg>
                            Google
                        </div>
                    )}  
                </Button>
            </div>
        </div>
    </>
  )
}

export default page