import { useNavigate } from "react-router-dom"

function HeroSection() {
  const navigate = useNavigate();

  const NavigateToLinkDrop = ():void=>{
    navigate("/pastelink")
  }

  return (
    <>
      <div className="border-2 flex bg-[#0d0f14] justify-center items-center  py-24 min-h-[90vh]">
        {/* leftpart */}
        <div className=" pr-24 space-y-6 w- pt">
          {/* round icon */}
          <span className="font-syne-jetBrains border bg-[#1a2035]  text-[#a8ff3e] px-2 border-[#556070] rounded-2xl">now in beta · 12k+ contributors</span>
          {/* main heading */}
          <div className="pt-[5%]  leading-none h-[60%] ">
            <span className="font-syne-ExtraBold text-[58px] tracking-[-0.03em] text-white ">Open</span>
            <br />
            <span className="font-syne-ExtraBold text-[58px] tracking-[-0.03em] text-white">source,</span>
            <div className="flex border-yellow-950 ">
              <span className="font-syne-ExtraBold text-[58px] tracking-[-0.03em] text-[#a8ff3e] ">finally</span>
              <span className="font-syne-ExtraBold text-[58px] tracking-[-0.03em]  text-white ml-4">less</span>
            </div>
            <span className="font-syne-ExtraBold text-[58px] tracking-[-0.03em]  text-white">intimidating.</span>
          </div>
          {/* paragraph */}
          <div className=" text-[#8895b3] mt-0.5 ">
            <p className="">Drop in any GitHub repo. Our AI decodes the</p>
            <p>architecture, surfaces the right issues, and walks</p>
            <p>you through your first PR — step by step.</p>
          </div>



          <div className="flex justify-start space-x-8 mt-6">
            <button onClick={NavigateToLinkDrop} className="cursor-pointer hover:bg-lime-300 transition h-12 text-[20px] px-6 pb-2 bg-[#a8ff3e] rounded-[5px]">Start contributing free</button>
            
            <button className=" bg-[#0d0f14] border border-[#1e2530] text-white rounded-[7px] px-7 ">See a demo</button>
          </div>
        </div>
        {/* RightPart */}
        <div className="rounded-[20px]  h-[30vh] bg-[#0a0c10] border border-[#1e2530]  w-[25%] flex flex-col justify-center ">
          <div className=" ml-6">
             {/* coloured icons */}
            <div className="flex  border space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* paragraph */}
            <div className="">
              <p className="text-[#e2e8f0]">$ analyzing repo: facebook/react...</p>
              <p className="text-[#7dd3fc]">{">"} 1,247 open issues found</p>
              <p className="text-[#7dd3fc]">{">"} entry points mapped: src/react.js</p>
              <p className="text-[#7dd3fc]">{">"} architecture: Fiber reconciler</p>
              <p className="text-[#7dd3fc]">{">"} good first issues: 23 matches</p>
              <p className="text-[#a8ff3e]">✓ ready to contribute. let's go.</p>
            </div>
          </div>
            
          
          
        </div>
      </div>
    </>
  )
}

export default HeroSection