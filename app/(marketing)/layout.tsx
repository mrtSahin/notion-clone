import { Navbar } from "./_components/navbar";

const MarketingLayout = ({ // layout sayfalarında tanımlama bu şekilde olur 
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full" >
      <Navbar/>
      <main className="h-full pt-40"> {/** pt: padding top */}
        {children}
      </main>
    </div >
  )
}

export default MarketingLayout