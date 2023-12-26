'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'

import {
  Dialog,
  DialogContent,
  DialogHeader
} from '../ui/dialog'

import { useCoverImage } from '@/hooks/use-cover-image'
import { SingleImageDropzone } from '../single-image-dropzone'
import { useEdgeStore } from '@/lib/edgestore'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useParams } from 'next/navigation'

export const CoverImageModal = () => { // cover image i 
  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = useMutation(api.documents.update)
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()
  const params = useParams()


  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true)
      setFile(file)



      // if (coverImage.url) { // eger resim varsa guncellemeyi farkli yapiyor yoksa farkli
      //   /** bu sekilde yapmazsak resmi degistirdigimizde onceki resmi veritabanindan silmiyor.
      //    bu sekil yaparsak onceden resim varsa once onu siliyor sonra bizim yukledigimiz resmi ekliyor*/
      //   res = await edgestore.publicFiles.upload({
      //     file,
      //     options: {
      //       replaceTargetUrl: coverImage.url
      //     }
      //   })
      // } else {
      //    res = await edgestore.publicFiles.upload({
      //     file
      //   })
      // }

      const res = await edgestore.publicFiles.upload({ // resmi edgestore a yüklüyoruz
        file,
        options: {
          replaceTargetUrl: coverImage.url // yukaridaki gibi varligini kontrol ederek degil boyle yapmamizin nedeni replaceTargetUrl undefined olabilir
        }
      })

      await update({ // sonra resmin url ini convex db de tutmak için belgede güncelleme yapıyoruz.
        id: params.documentId as Id<'documents'>,
        coverImage: res.url
      })

      onClose()

    }
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className='text-center text-lg font-semibold'>
            Cover Image
          </h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />

      </DialogContent>
    </Dialog>
  )
}