
function StatsBar() {
  return (
    <div className="bg-[#0d0f14] border border-[#1a1f2e]">
      <div className="  grid grid-cols-4 min-h-[25vh] place-items-center max-w-5xl mx-auto items-center justify-center">
         <div className="border-r border-[#1a1f2e] flex flex-col w-full">
            <div className=" text-center text-white text-[34px] font-syne-ExtraBold">12k+</div>
            <div className=" text-center text-[#556070] text-[14px]">contributors onboarded</div>

         </div>
         <div className="border-x border-[#1a1f2e] flex flex-col w-full">
            <div className=" text-center text-white text-[34px] font-syne-ExtraBold">340k+</div>
            <div className=" text-center text-[#556070] text-[14px]">repos analyzed</div>
         </div>
         <div className="border-x border-[#1a1f2e] flex flex-col w-full">
            <div className=" text-center text-white text-[34px] font-syne-ExtraBold">89%</div>
            <div className=" text-center text-[#556070] text-[14px]">first PR success rate</div>
         </div>
         <div className="border-l border-[#1a1f2e] flex flex-col w-full">
            <div className=" text-center text-white text-[34px] font-syne-ExtraBold">{"<"}60s</div>
            <div className=" text-center text-[#556070] text-[14px]">to first insight</div>
         </div>

    </div>
    </div>
    
  )
}

export default StatsBar