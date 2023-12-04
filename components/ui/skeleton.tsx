import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/5", className)} // icon ve yazilar gelene kadar orayi gri renkte gosteriyor. bosluk olmaktansa orada bir seylerin oldugunu hissetiriyor
      {...props}
    />
  )
}

export { Skeleton }
