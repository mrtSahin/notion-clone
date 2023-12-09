'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "./ui/button"
import { ImageIcon, X } from "lucide-react"
import { useCoverImage } from "@/hooks/use-cover-image"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"

interface CoverProps {
  url?: string
  preview?: boolean
}

export const Cover = ({
  url,
  preview
}: CoverProps) => {

  const params = useParams()
  const coverImage = useCoverImage()
  const removeCover = useMutation(api.documents.removeCover)

  const onRemoveCover = () => {
    removeCover({id:params.documentId as Id<"documents">})
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

      {url && !preview && (
        <div className="opacity-o group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={coverImage.onOpen}
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