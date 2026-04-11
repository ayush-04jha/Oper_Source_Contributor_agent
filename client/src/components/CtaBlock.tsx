
function CtaBlock() {
  return (
    <div className="flex justify-center items-center min-h-[77vh] bg-[#0d0f14]">
        <div className="rounded-3xl flex flex-col justify-center items-center gap-5 border border-[#1e3020] min-h-[55vh] max-w-[65%] bg-linear-to-br from-[#111820] to-[#0f1a14]">
            <div className="absolute mb-32 left-1/2 -translate-x-1/2 w-100 h-100 rounded-full 
  bg-[radial-gradient(circle,rgba(168,255,62,0.09)_0%,transparent_70%)] pointer-events-none" />
            <div className=" font-syne-ExtraBold text-white text-[40px] max-w-[90%] text-center">Your first open source PR
is closer than you think.</div>
            <div className=" text-[#6e7d9b]">Join 12,000+ developers who shipped their first contribution with contrib.ai.</div>
            <button className="bg-[#a8ff3e] rounded-lg p-2">Start for free — no sign up needed →</button>
        </div>
    </div>
  )
}

export default CtaBlock