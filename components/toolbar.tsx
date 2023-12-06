'use client'

import { Doc } from "@/convex/_generated/dataModel"




interface ToolbarProps {
  initialData: Doc<'documents'>
  preview?: boolean
}

export const Toolbar = ({
  initialData,
  preview
}: ToolbarProps) => {
  return (
    <div className="">
      Toolbar
    </div>
  )
} 