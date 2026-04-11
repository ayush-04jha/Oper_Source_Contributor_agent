function HowItWorks() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] gap-8 bg-[#0a0c10]">
        {/* 1st */}
        <div className="bg-[#11141c] border border-[#556070] rounded-2xl px-3 text-[12px] text-[#a8ff3e]">how it works</div>
        {/* 2nd */}
        <div className="text-center font-syne-ExtraBold  text-[40px] max-w-225 text-white">From zero to merged in four steps.</div>
        {/* 3rd */}
       
          <div className="grid grid-cols-4 min-w-6xl ">
            <div className="border-r border-[#1a1f2e] min-h-35 pl-4 ">
                <div className="text-[#a8ff3e] text-[11px]">01</div>
                <div className="font-syne-ExtraBold text-[15px] text-white">Paste a GitHub URL</div>
                <div className="text-[#556070]">Any public repo, any language.</div>
            </div>
            <div className="border-x border-[#1a1f2e] pl-4">
                <div className="text-[#a8ff3e] text-[11px]">02</div>
                <div className="font-syne-ExtraBold text-[15px] text-white">AI maps the terrain</div>
                <div className="text-[#556070]">Any public repo, any language.</div>
            </div>
            <div className="border-x border-[#1a1f2e] pl-4 ">
                <div className="text-[#a8ff3e] text-[11px]">03</div>
                <div className="font-syne-ExtraBold text-[15px] text-white">Pick your issue</div>
                <div className="text-[#556070]">Any public repo, any language.</div>
            </div>
            <div className="border-l border-[#1a1f2e] pl-4">
                <div className="text-[#a8ff3e] text-[11px]">04</div>
                <div className="font-syne-ExtraBold text-[15px] text-white">Ship your PR</div>
                <div className="text-[#556070]">Any public repo, any language.</div>
            </div>
        </div>
        
        

    </div>
  )
}

export default HowItWorks