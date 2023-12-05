'use client'

import { Doc } from "@/convex/_generated/dataModel"
import { useRef, useState } from "react"

import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface TitleProps {
  initialData: Doc<'documents'>
}



export const Title = ({
  initialData
}: TitleProps) => {

  const inputRef = useRef<HTMLInputElement>(null)
  const update = useMutation(api.documents.update)

  const [title, setTitle] = useState(initialData.title || 'Untitled')
  const [isEditing, setIsEditing] = useState(false)


// documanin title ini degistirme islemleri
  const enableInput = () => {
    setTitle(initialData.title)
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length) // input icerisindeki yaziyi secer(kisacasi ctrl+a)
    }, 0)
  }

  const disableInput = () => {
    setIsEditing(false)
  }

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value)
    update({ // dokumanin title degerini real time olarak yapiyoruz. bu sayede biz inputu doldururken yazdigimiz yazi ayni anda sidebardaki kisimda da gorunuyor
      id: initialData._id,
      title: event.target.value || 'Untitled' // eger bir veri girilmadiyse untitled yapiyor
    })
  }

  const onKeyDown = ( // enter tusuna basinca input alani kapatiyoruz
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      disableInput()
    }
  }

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className='h-7 px-2 focus-visible:ring-transparent'
        />
      ) : (
        <Button
          onClick={enableInput}
          variant='ghost'
          size='sm'
          className="font-normal h-auto p-1"
        >
          <span className="truncate">
            {initialData?.title}
          </span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton(){ // Skeletonun amaci biozim title alanimizin verisi apiden gelene kadar orada veri yerine bir sey gostermek. o da genellikle zemain beyazsa gri renkli bir dortgen gostermedir.
  return(
    <Skeleton className="h-5 w-20 rounded-md"/>
  )
}