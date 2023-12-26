"use client"

import { redirect } from 'next/navigation'
import { useConvexAuth } from 'convex/react'

import { Spinner } from '@/components/spinner'
import { SearchCommand } from '@/components/search-command'

import { Navigation } from './_components/navigation'

const MainLayout = ({// belgeler buraya gelir ve burada gösterilir.
  children  // [documentsId] deki page buna denk gelir.
}: {
  children: React.ReactNode
}) => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    )
  }

  if (!isAuthenticated) {// giriş yapılmamışsa ana sayfaya yonlendiriyor
    return redirect('/')// redırect ile direct anasayfaya yönlendiriyor
  }


  return (
    <div className='h-full flex dark:bg-[#1f1f1f]'>
      <Navigation />
      <main className='flex-1 h-full overflow-y-auto'>
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout