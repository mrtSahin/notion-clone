
'use client'

import { Cover } from "@/components/cover"
import { Toolbar } from "@/components/toolbar"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"

// koseli parantezlerle dynamic bir route olusturduk
// yani url de yazan documentId lere gore buayi acacak
//    burasi url de: http://localhost:3000/documents/3njjbwceg5epv0vzwe3z6f059kqmrm0

interface DocumentIdPageProps {
  params: { // dynamic dosya oldugu icin bu sekilde yazinca url den aliyor documentId degerini
    documentId: Id<"documents">
  }

}


const DocumentIdPage = ({
  params
}: DocumentIdPageProps) => {

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  })

  if (document === undefined) {
    return (<div>
      Loading...
    </div>)
  }


  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}

export default DocumentIdPage