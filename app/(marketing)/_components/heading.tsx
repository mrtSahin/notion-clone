"use client" // server component değil client component olduğunu belirtiyoruz

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'

export const Heading = () => { // diğer sayfalarda kullanabilmek adına bu şekilde export etmeliyiz
  // export default ile hata veriyor
  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
        Your Ideas, Documents & Plans. Unified. Welcome to <span className='underline'>Sotion</span>
      </h1>
      <h3 className='text-base sm:text-xl md:text-2xl font-medium'>Sotion is the connected workspace where <br />
        better. faster work happens
      </h3>
      <Button>
        Enter Sotion
        <ArrowRight className='h-4 w-4 ml-2'></ArrowRight>
      </Button>
    </div>
  )
}

