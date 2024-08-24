import { authOptions } from '@/libs/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

const page = async ({}) => {
  const session = await getServerSession(authOptions)
  return (
    <>
      <h1>DashBoard</h1>
    </>
  )
}

export default page