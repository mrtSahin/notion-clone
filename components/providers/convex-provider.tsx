"use client"

import { ReactNode } from "react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ClerkProvider, useAuth } from "@clerk/clerk-react"


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export const ConvexClientProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk
        useAuth={useAuth}
        client={convex}
      >
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

// projeye kullanıcı doğrulama ekledik. convexi database oalrak, clerki auth provider olarak kullandık.
// bunu app dosyasında layout.tsx de çağıracağız

