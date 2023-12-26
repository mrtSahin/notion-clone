import { Button } from "@/components/ui/button"
import { Logo } from "./logo"

export const Footer =()=>{ // giriş ekranında alt kısım
  return(
    <div className="flex
     items-center w-full p-6 bg-background dark:bg-[#1F1F1F] z-50"> {/**p: padding, z: z-index */}
      Footer
      <Logo/>
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </div>
  )
}