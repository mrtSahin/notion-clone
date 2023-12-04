import { useState, useEffect } from "react";



// anasayfada ekran scroll edilince navbarin altina border ekleniyor 
// orada ekranin scroll edilip edilmedigi bilgisi buradan aliniyor

export const useScrollTop = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    console.log(threshold,window.scrollY)
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setScrolled(true)
      } else {
        setScrolled(false)
      } // eğer ekran aşağı scroll edildiyse scrolled true yoksa false yapılır
    }
    window.addEventListener("scroll", handleScroll); // ekran scroll edildiğinde handleScroll metodu çalıştırılır
    return () => window.removeEventListener("scroll", handleScroll) 
  }, [threshold])

  return scrolled
}