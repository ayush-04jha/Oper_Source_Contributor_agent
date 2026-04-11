import { Hexagon } from "lucide-react";
function Navbar() {
    return (
        <div className="bg-[#0d0f14] border-b-2 border-[#1e2530] flex items-center py-5 px-11  justify-between">
            {/* left part */}
            <div className="left flex justify-between space-x-1">
                {/* icon */}
                <div className="icon flex justify-center items-center h-8 w-8 rounded-tl-[25%] rounded-tr-[25%] rounded-br-[25%] rounded-bl-[25%] bg-[#a8ff3e]">
                    <Hexagon className="w-[50%] h-[50%] text-black" />
                </div>
                {/* company name */}
                <div className="text-white flex">
                    <h1>contrib</h1>
                    <h1 className="text-[#a8ff3e]" >.ai</h1>
                </div>
            </div>
            {/* middle part */}
            <div className="space-x-7">
                <a href="" className="text-[#7a8299] ">Features</a>
                <a href="" className="text-[#7a8299]">How it works</a>
                <a href="" className="text-[#7a8299] ">Docs</a>

            </div>
            {/* button */}
            <button className="bg-[#a8ff3e] rounded-[5px] p-2">
                Get early access    
            </button>
        </div>
    )
}

export default Navbar