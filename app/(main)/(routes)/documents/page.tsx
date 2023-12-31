"use client"

import Image from 'next/image'
import React from 'react'
import { useUser } from "@clerk/clerk-react"
import { PlusCircle } from 'lucide-react'
import { useMutation } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function DocumentsPage() { // her hangi bir belge görüntülenmiyorken render edilecek olan komponent

  const { user } = useUser()
  const create = useMutation(api.documents.create)
  const router = useRouter()

  const onCreate = () => {
    const promise = create({ title: 'Untitle' })
      .then((documentId) => router.push(`/documents/${documentId}`)) // belgeyi olusturunca direkt onun sayfasina yonlendiriyor
    toast.promise(promise, { // ekranin altinda uyari kutucugu cikarir
      loading: 'Creating a new note...',
      success: "New note created!",
      error: "Failed to create a new note."
    })
  }

  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="EmptyPng"
        className='dark:hidden'
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className='hidden dark:block'
      />
      <h2 className='text-lg font-medium'>
        Welcome to {user?.firstName}&apos;s Sotion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className='h-4 w-4 mr-2' />
        Create a note
      </Button>
    </div>
  )
}

export default DocumentsPage