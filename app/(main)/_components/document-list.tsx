"use client"

import { Doc, Id } from "@/convex/_generated/dataModel"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Item } from "./item"
import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"

interface DocumentListProps { // navbarda bütün dokümanları göstermek için kullanılır
  parentDocumentId?: Id<"documents"> // buradaki Id her bir documente kendisi id veriyor ona da ._id  seklinde erisiyoruz
  // her bir notuun icerigini farkli bir sayfada acabilmak icin bu id yi kullanacagiz
  level?: number
  data?: Doc<"documents">[]

}

export const DocumentList = ({
  parentDocumentId,
  level = 0
}: DocumentListProps) => {

  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }))
  }

  const documents = useQuery(api.documents.getSideBar, { //convexden documentleri alma
    parentDocument: parentDocumentId 
  })

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <p
        style={{ // iç içe olan belgelerin anlaşılması için içeride olan belgeye fazladan padding left eklenir
          paddingLeft: level ? `${(level * 12) + 25}px` : undefined
      }}
      className={cn(
        "hidden text-sm font-medium text-muted-foreground",
        expanded && "last:block",
        level === 0 && "hidden"
      )}
      >
        No pages inside
      </p>
      {documents.map((document)=>(
        <div key={document._id}>
          <Item
          id={document._id}
          onClick={()=>onRedirect(document._id)}
          label={document.title}
          icon={FileIcon}
          documentIcon={document.icon}
          active={params.documentId === document._id} // olusturdugumuz [documentId] isimli dynamic dosya sayesinde documentId bir params degiskeni oluyor 
          level={level}
          onExpand={()=>onExpand(document._id)}
          expanded={expanded[document._id]}
          />
          {expanded[document._id]&&(
            <DocumentList
            parentDocumentId={document._id}
            level={level+1}
            />
          )}
        </div>
      ))}
    </>
  )
}