import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'

function MessageList() {
    const {selectedConversation}=useSelector(state=>state.conversation)
    const {messages,isLoading}=useSelector(state=>state.message)
    const bottemRef=useRef(null)
   
   useEffect(()=>{
       requestAnimationFrame(()=>{
        bottemRef?.current?.scrollIntoView({
          behavior:"smooth",
          block:"end"
        })
       })
   },[messages?.length,isLoading])


  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      
      {messages.length==0 || !selectedConversation ?(
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
           <div className='flex flex-col gap-1.5'>
               <h1 className='text-[50px] font-bold text-slate-200 tracking-tight'>DarshAI</h1>
               <p className='text-[15px] font-semibold text-slate-400 tracking-tight'>How can I help you?</p>
               <p className='text-[13px] text-slate-600 max-w-[260px] leading-relaxed'>Ask me anything — code, ideas, explanations, or just a quick question.</p>
           </div>
           <div className='flex flex-wrap justify-center gap-2 mt-1'>
            {["Write a Netflix clone", "Explain Redis", "Build a dashboard"].map((s, i)=>(
              <button key={i} className='text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3.5 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'>
                {s}
              </button>
            ))}
           </div>
        </div>
      ):
      <div className='space-y-5'>

        {messages?.map((msg,i)=>(
            <div key={msg?._id || `${msg?.role}-${i}`}>
               <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []} diagram={msg.diagram} dataHtml={msg.dataHtml} /> 
            </div>
        ))}

        {isLoading && <LoadingAnimation/>}

        
      </div>
      }
      <div ref={bottemRef}/>
    </div>
  )
}

export default MessageList































// import { useEffect, useRef } from 'react'
// import { useSelector } from 'react-redux'
// import MessageBubble from './MessageBubble'
// import LoadingAnimation from './LoadingAnimation'

// function MessageList() {
//     const { selectedConversation } = useSelector(state => state.conversation)
//     const { messages, isLoading } = useSelector(state => state.message)
//     const bottemRef = useRef(null)

//     useEffect(() => {
//         requestAnimationFrame(() => {
//             bottemRef?.current?.scrollIntoView({
//                 behavior: "smooth",
//                 block: "end"
//             })
//         })
//     }, [messages?.length, isLoading])

//     return (
//         <>
//             <style>{`
//                 @keyframes darshOrbFloat {
//                     0%, 100% {
//                         transform: translateY(0) scale(1);
//                     }
//                     50% {
//                         transform: translateY(-8px) scale(1.025);
//                     }
//                 }

//                 @keyframes darshOrbPulse {
//                     0%, 100% {
//                         opacity: .28;
//                         transform: scale(.92);
//                     }
//                     50% {
//                         opacity: .7;
//                         transform: scale(1.08);
//                     }
//                 }

//                 @keyframes darshGlow {
//                     0%, 100% {
//                         opacity: .25;
//                     }
//                     50% {
//                         opacity: .65;
//                     }
//                 }

//                 @keyframes darshShine {
//                     0% {
//                         transform: translateX(-140%);
//                     }
//                     35%, 100% {
//                         transform: translateX(360%);
//                     }
//                 }

//                 @keyframes darshMessageReveal {
//                     from {
//                         opacity: 0;
//                         transform: translateY(7px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }

//                 .darsh-empty-orb {
//                     animation: darshOrbFloat 5s ease-in-out infinite;
//                 }

//                 .darsh-empty-orb-ring {
//                     animation: darshOrbPulse 4s ease-in-out infinite;
//                 }

//                 .darsh-empty-glow {
//                     animation: darshGlow 5s ease-in-out infinite;
//                 }

//                 .darsh-prompt-card {
//                     position: relative;
//                     overflow: hidden;
//                     isolation: isolate;
//                 }

//                 .darsh-prompt-card::after {
//                     content: "";
//                     position: absolute;
//                     top: 0;
//                     bottom: 0;
//                     left: -30%;
//                     width: 22%;
//                     transform: skewX(-16deg);
//                     background: linear-gradient(
//                         90deg,
//                         transparent,
//                         rgba(255,255,255,.055),
//                         transparent
//                     );
//                     pointer-events: none;
//                 }

//                 .darsh-prompt-card:hover::after {
//                     animation: darshShine .9s ease forwards;
//                 }

//                 .darsh-message-reveal {
//                     animation: darshMessageReveal .35s ease-out both;
//                 }

//                 @media (prefers-reduced-motion: reduce) {
//                     .darsh-empty-orb,
//                     .darsh-empty-orb-ring,
//                     .darsh-empty-glow,
//                     .darsh-message-reveal {
//                         animation: none !important;
//                     }

//                     .darsh-prompt-card:hover::after {
//                         animation: none !important;
//                     }
//                 }
//             `}</style>

//             <div className='flex-1 min-h-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>

//                 {messages.length == 0 || !selectedConversation ? (
//                     <div className='relative h-full min-h-[520px] flex flex-col items-center justify-center overflow-hidden px-4 text-center'>

//                         {/* Ambient background */}
//                         <div className='pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.035] blur-[110px] darsh-empty-glow' />

//                         <div className='pointer-events-none absolute left-[16%] top-[23%] h-1 w-1 rounded-full bg-violet-300/30 animate-pulse' />
//                         <div className='pointer-events-none absolute right-[17%] top-[28%] h-1 w-1 rounded-full bg-blue-300/25 animate-pulse [animation-delay:1s]' />
//                         <div className='pointer-events-none absolute left-[23%] bottom-[24%] h-1 w-1 rounded-full bg-white/15 animate-pulse [animation-delay:2s]' />
//                         <div className='pointer-events-none absolute right-[22%] bottom-[20%] h-1 w-1 rounded-full bg-violet-300/20 animate-pulse [animation-delay:1.5s]' />

//                         {/* DarshAI visual */}
//                         <div className='relative mb-7 darsh-empty-orb'>
//                             <div className='absolute -inset-5 rounded-full border border-violet-300/[0.035] darsh-empty-orb-ring' />

//                             <div className='absolute -inset-10 rounded-full bg-violet-500/[0.025] blur-2xl darsh-empty-glow' />

//                             <div className='relative flex h-[82px] w-[82px] items-center justify-center rounded-[26px] border border-violet-300/[0.13] bg-gradient-to-br from-violet-500/[0.15] via-indigo-500/[0.08] to-blue-500/[0.055] shadow-[0_20px_70px_rgba(79,70,229,.14)] transition-all duration-500 hover:scale-105 hover:border-violet-300/[0.23]'>
//                                 <div className='absolute inset-[10px] rounded-[19px] border border-white/[0.055]' />

//                                 <div className='relative flex flex-col items-center'>
//                                     <span className='text-[24px] font-bold tracking-[-0.08em] text-white'>
//                                         D<span className='text-violet-300'>AI</span>
//                                     </span>

//                                     <span className='mt-0.5 text-[7px] font-semibold uppercase tracking-[0.18em] text-violet-200/45'>
//                                         MULTI AGENT
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Hero */}
//                         <div className='relative flex flex-col items-center'>

//                             <div className='mb-3 flex items-center gap-2'>
//                                 <span className='h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(167,139,250,.6)] animate-pulse' />

//                                 <span className='text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-200/50 sm:text-[11px]'>
//                                     Multi-Agent AI Platform
//                                 </span>
//                             </div>

//                             <h1 className='text-[52px] font-semibold leading-[0.92] tracking-[-0.075em] text-white sm:text-[70px] lg:text-[82px]'>
//                                 Darsh<span className='bg-gradient-to-r from-violet-300 via-indigo-200 to-blue-300 bg-clip-text text-transparent'>AI</span>
//                             </h1>

//                             <h2 className='mt-5 text-[24px] font-medium tracking-[-0.045em] text-white/90 sm:text-[30px]'>
//                                 How can I help you<span className='text-violet-300'>?</span>
//                             </h2>

//                             <p className='mt-3 max-w-[550px] text-[14px] leading-6 text-slate-400/65 sm:text-[15px]'>
//                                 Research ideas, write code, analyze information, create content,
//                                 or build something new with your AI workspace.
//                             </p>
//                         </div>

//                         {/* Prompt cards */}
//                         <div className='relative mt-9 grid w-full max-w-[780px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
//                             {[
//                                 {
//                                     title: "Build",
//                                     text: "Create a Netflix-style web app",
//                                     icon: "✦"
//                                 },
//                                 {
//                                     title: "Explain",
//                                     text: "Explain Redis in simple terms",
//                                     icon: "⌁"
//                                 },
//                                 {
//                                     title: "Analyze",
//                                     text: "Build a dashboard from my data",
//                                     icon: "◫"
//                                 },
//                                 {
//                                     title: "Code",
//                                     text: "Review and improve my React code",
//                                     icon: "</>"
//                                 },
//                                 {
//                                     title: "Research",
//                                     text: "Compare the latest AI models",
//                                     icon: "◎"
//                                 },
//                                 {
//                                     title: "Create",
//                                     text: "Give me a practical startup idea",
//                                     icon: "✧"
//                                 }
//                             ].map((item, i) => (
//                                 <button
//                                     key={i}
//                                     type='button'
//                                     className='darsh-prompt-card group min-h-[78px] rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.025)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/[0.16] hover:bg-violet-500/[0.055] hover:shadow-[0_18px_45px_rgba(0,0,0,.18)] cursor-pointer'
//                                 >
//                                     <div className='relative z-10 flex items-center gap-3'>

//                                         <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/[0.10] bg-gradient-to-br from-violet-400/[0.09] to-blue-400/[0.045] text-[12px] font-semibold text-violet-200 transition-all duration-300 group-hover:scale-105 group-hover:border-violet-300/[0.18] group-hover:bg-violet-400/[0.12]'>
//                                             {item.icon}
//                                         </div>

//                                         <div className='min-w-0 flex-1'>
//                                             <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200/45 transition-colors duration-300 group-hover:text-violet-200/70'>
//                                                 {item.title}
//                                             </p>

//                                             <p className='mt-1 text-[13px] font-medium leading-5 text-slate-300 transition-colors duration-300 group-hover:text-white'>
//                                                 {item.text}
//                                             </p>
//                                         </div>

//                                         <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-[13px] text-slate-600 transition-all duration-300 group-hover:border-violet-300/[0.14] group-hover:bg-violet-400/[0.08] group-hover:text-violet-200'>
//                                             ↗
//                                         </span>

//                                     </div>
//                                 </button>
//                             ))}
//                         </div>

//                         {/* Capabilities */}
//                         <div className='relative mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2'>
//                             {["Research", "Code", "Analyze", "Create", "Automate"].map((item, i) => (
//                                 <div
//                                     key={item}
//                                     className='flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/22'
//                                 >
//                                     <span className='h-1 w-1 rounded-full bg-violet-300/35' />
//                                     {item}

//                                     {i !== 4 && (
//                                         <span className='ml-2 h-3 w-px bg-white/[0.06]' />
//                                     )}
//                                 </div>
//                             ))}
//                         </div>

//                         <div className='mt-5 flex items-center gap-2 text-[10px] text-white/15'>
//                             <span className='h-px w-7 bg-white/[0.06]' />
//                             Your AI workspace is ready
//                             <span className='h-px w-7 bg-white/[0.06]' />
//                         </div>
//                     </div>
//                 ) : (
//                     <div className='mx-auto w-full max-w-[920px] space-y-6'>

//                         {messages?.map((msg, i) => (
//                             <div
//                                 key={msg?._id || `${msg?.role}-${i}`}
//                                 className='darsh-message-reveal'
//                             >
//                                 <MessageBubble
//                                     role={msg?.role}
//                                     content={msg?.content}
//                                     images={msg.images || []}
//                                     diagram={msg.diagram}
//                                     dataHtml={msg.dataHtml}
//                                 />
//                             </div>
//                         ))}

//                         {isLoading && (
//                             <div className='pt-1 darsh-message-reveal'>
//                                 <LoadingAnimation />
//                             </div>
//                         )}

//                     </div>
//                 )}

//                 <div ref={bottemRef} />
//             </div>
//         </>
//     )
// }

// export default MessageList
