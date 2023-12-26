import React from "react"

const PublicLayout = ({ // misafir kullancının görebileceği şeyler
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-full dark:bg-[#1f1f1f]">
      {children}
    </div>
  )
}

export default PublicLayout