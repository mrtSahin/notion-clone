'use client'

import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useTheme } from 'next-themes'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

interface IconPickerProps {
  onChange: (icon: string) => void
  children: React.ReactNode
  asChild?: boolean
}

export const IconPicker = ({ // emojipicker isimle npm kütüphanesi ile kullanıcıların istediiği emojiyi seçmesini sağlıyoruz.
  onChange,
  children,
  asChild
}: IconPickerProps) => {

  const { resolvedTheme } = useTheme()
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap

  const themeMap = {
    'dark': Theme.DARK,
    'light': Theme.LIGHT
  }

  const theme = themeMap[currentTheme]

  return (
    <Popover>
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent className='p-0 w-full border-none shadow-me'>
        <EmojiPicker
        height={350}
        theme={theme}
        onEmojiClick={(data)=>onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  )
}

