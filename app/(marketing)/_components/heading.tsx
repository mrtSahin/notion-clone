"use client" // server component değil client component olduğunu belirtiyoruz

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/clerk-react'
import { useConvexAuth } from 'convex/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const Heading = () => { // giriş ekranında üst kısma denk gelir
  // diğer sayfalarda kullanabilmek adına bu şekilde export etmeliyiz
  // export default ile hata veriyor

  const { isAuthenticated, isLoading } = useConvexAuth()

  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
        Your Ideas, Documents & Plans. Unified. Welcome to <span className='underline'>Sotion</span>
      </h1>
      <h3 className='text-base sm:text-xl md:text-2xl font-medium'>Sotion is the connected workspace where <br />
        better. faster work happens
      </h3>
      {isLoading && (
        <div className="w-full flex justify-center items-center ">
          <Spinner size='lg' />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href='/documents'>Enter Sotion<ArrowRight className='h-4 w-4 ml-2'></ArrowRight></Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode='modal'>
          <Button>
            Get Sotion Free
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </SignInButton>
      )}
    </div>
  )
}

