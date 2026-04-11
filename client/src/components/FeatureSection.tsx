
function FeatureSection() {
    return (
        <div className="flex flex-col justify-center items-center bg-[#0d0f14]  min-h-[140vh]">
           <div className="flex flex-col items-center gap-11">
            {/* 1st part */}
            <div className="flex flex-col gap-3  max-w-[70%]">
                <div className="rounded-2xl border border-[#556070] w-24 text-center text-[12px] text-[#a8ff3e] bg-[#1a2035]">features</div>
                <div className="font-syne-ExtraBold text-[40px]  w-[40%] text-white">Everything you need to ship your first PR.
                </div>
                <div className=" w-[40%] text-[#8895b3]">No more staring at a codebase wondering where to start.</div>
            </div>
            {/* grid part */}
            <div className=" flex items-center justify-center ">
                <div className=" grid grid-cols-2 gap-2  items-center max-w-[70%]">
                    <div className="bg-[#11141c] rounded-xl flex flex-col justify-center gap-5 border border-[#1e2530] min-h-52  pl-4">
                        <div className="rounded-[9px]  bg-[#a8ff3e]  w-10 h-10 "></div>
                        <div className="text-white font-syne-ExtraBold text-[15px]">Repo Archaeology</div>
                        <div className="text-[#6e7d9b]">Instantly map any codebase — architecture, entry points, folder conventions, and where the magic happens.</div>
                    </div>
                    <div className="bg-[#11141c] rounded-xl flex flex-col justify-center gap-5 border border-[#1e2530] min-h-52  pl-4">
                        <div className="rounded-[9px] bg-[#7dd3fc]   w-10 h-10"></div>
                        <div className="text-white font-syne-ExtraBold text-[15px]">Repo Archaeology</div>
                        <div className="text-[#6e7d9b]">Instantly map any codebase — architecture, entry points, folder conventions, and where the magic happens.</div>
                    </div>
                    <div className=" bg-[#11141c] rounded-xl flex flex-col justify-center gap-5 border border-[#1e2530] min-h-52  pl-4">
                        <div className="rounded-[9px]  bg-[#f9a8d4]  w-10 h-10"></div>
                        <div className="text-white font-syne-ExtraBold text-[15px]">Repo Archaeology</div>
                        <div className="text-[#6e7d9b]">Instantly map any codebase — architecture, entry points, folder conventions, and where the magic happens.</div>
                    </div>
                    <div className="bg-[#11141c] rounded-xl flex flex-col justify-center gap-5 border border-[#1e2530] min-h-52  pl-4">
                        <div className="rounded-[9px]  bg-[#fbbf24]  w-10 h-10"></div>
                        <div className="text-white font-syne-ExtraBold text-[15px]">Repo Archaeology</div>
                        <div className="text-[#6e7d9b]">Instantly map any codebase — architecture, entry points, folder conventions, and where the magic happens.</div>
                    </div>
                </div>

            </div>
        </div>
        </div>
       
    )
}

export default FeatureSection