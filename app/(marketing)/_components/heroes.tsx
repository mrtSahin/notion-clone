import Image from "next/image"

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative 
      w-[300px] h-[300px] 
      sm:w-[350px] sm:h-[350px]  sm
      md:w-[400px] md:h-[400px]">{/** sm = small devices(küçük ekranlarda geçerli css özelliklerinin beliritldiği yer
       * md = medium devices
      */}
          <Image
            src="/documents.png"
            fill
            className="object-contain dark:hidden"
            alt="Documents"
          />
          <Image
            src="/documents-dark.png"
            fill
            className="object-contain hidden dark:block"
            alt="Documents"
          />
        </div>
        <div className="relative h-[400px] w-[400px] hidden
          md:block md"> {/** hidden ile gizliyoruz, md:block ile medium ve daha büyük ekranlar için block yapıp görünür hale getiriyoruz. Kısacası ekrana sığmadığı zaman gizleniyor sığdığı an görünür oluyor */}
          {/** md: @media (min-width: 768px) */}
          <Image
            src="/reading.png"
            fill
            className="object-contain dark:hidden"
            alt="Reading"
          />
          <Image
            src="/reading-dark.png"
            fill
            className="object-contain hidden dark:block"
            alt="Reading"
          />
        </div>
      </div>
    </div>
  )
}