'use client'


import { ImageIcon, X } from "lucide-react"
import { useParams } from "next/navigation"
import { useMutation } from "convex/react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useCoverImage } from "@/hooks/use-cover-image"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useEdgeStore } from "@/lib/edgestore"
import { Skeleton } from "./ui/skeleton"

interface CoverProps {
  url?: string
  preview?: boolean
}

export const Cover = ({ // coverImg ın görüntülendiği ve işlemlerinin yapıldığı komponent
  url,
  preview
}: CoverProps) => {

  const { edgestore } = useEdgeStore()
  const params = useParams()
  const coverImage = useCoverImage()
  const removeCover = useMutation(api.documents.removeCover)

  const onRemoveCover = async () => {
    if (url) {
      await edgestore.publicFiles.delete({ // covexden sildigimiz gibi edgestore dan da silmemiz lazim
        url: url,
      })
    }
    removeCover({ id: params.documentId as Id<"documents"> })
  }

  return (
    <div className={cn(
      "relative w-full h-[35vh] group",
      !url && "h-[12vh]",
      url && "bg-muted"
    )}>
      {!!url && (
        <Image
          src={url} // resimleri edgestore dan cektigimiz icin next.config.js dosyasinda resimler icin domain i belirttik
          fill
          alt="cover"
          className="object-cover"
        />
      )}

      {url && !preview && ( // resmi yukarıda zaten gösteriyoruz. eğer preview yani kullanıcı misafirse burdaki buton vs göstermiyoruz
        <div className="opacity-o group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant='outline'
            size='sm'
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>

          <Button
            onClick={onRemoveCover}
            className="text-muted-foreground text-xs"
            variant='outline'
            size='sm'
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSekeleton (){
  return <Skeleton className="w-full h-[12vh]"/>
}