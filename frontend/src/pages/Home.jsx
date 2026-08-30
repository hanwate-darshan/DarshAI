// import { signInWithPopup } from 'firebase/auth'
// import React from 'react'
// import { auth, googleProvider } from '../../utils/firebase'
// import api from '../../utils/axios'
// import { FcGoogle } from "react-icons/fc";
// import { useDispatch, useSelector } from 'react-redux';
// import { setUserdata } from '../redux/userSlice';
// import SideBar from '../components/SideBar';
// import ChatArea from '../components/ChatArea';
// import Artifact from '../components/Artifact';

// function Home() {
//     const {userData}=useSelector(state=>state.user)
//     const dispatch=useDispatch()
//     const handleLogin = async (token) => {
//         try {
//             const { data } = await api.post("/api/auth/login", { token })
//             dispatch(setUserdata(data))
//         } catch (error) {
//             console.log(error)
//         }
//     }


//     const googleLogin = async () => {
//         const data = await signInWithPopup(auth, googleProvider)
//         const token = await data.user.getIdToken()
//         console.log(token)
//         await handleLogin(token)
//         console.log(data)
//     }
//     return (
//         <div className='h-screen  flex bg-[#0d0f14] text-white overflow-hidden'>

// <SideBar/>
// <ChatArea/>
// <Artifact/>




// {!userData &&   <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur'>
//                 <div className='w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5'>
//                     <div className='flex flex-col gap-1'>
//                         <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>Welcome to DarshAI</h2>
//                         <p className='text-[13px] text-slate-500'>Please login to continue using the app.</p>
//                     </div>

//                     <button className='w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200  transition-all duration-150 cursor-pointer' onClick={googleLogin}>
//                         <FcGoogle size={15} />
//                         Continue With Google
//                     </button>
//                 </div>
//             </div>}
          
//         </div>
//     )
// }

// export default Home









import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc"
import { useDispatch, useSelector } from 'react-redux'
import { setUserdata } from '../redux/userSlice'
import SideBar from '../components/SideBar'
import ChatArea from '../components/ChatArea'
import Artifact from '../components/Artifact'

function Home() {
    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            dispatch(setUserdata(data))
        } catch (error) {
            console.log(error)
        }
    }

    const googleLogin = async () => {
        try {
            const data = await signInWithPopup(auth, googleProvider)
            const token = await data.user.getIdToken()
            console.log(token)
            await handleLogin(token)
            console.log(data)
        } catch (error) {
            console.error("Google authentication failed:", error)
        }
    }

    /*
     * Visual-only data.
     * These items do not introduce new application functionality.
     */
    const features = [
        {
            title: "AI Chat",
            description: "Ask, reason, write and solve everyday problems with DarshAI.",
            icon: "✦",
            tag: "CHAT",
            imagePosition: "50% 50%"
        },
        {
            title: "Multi-Agent AI",
            description: "Use specialized agents designed for different types of work.",
            icon: "◈",
            tag: "AGENTS",
            imagePosition: "62% 38%"
        },
        {
            title: "Coding",
            description: "Build, debug and understand code with an AI developer workflow.",
            icon: "</>",
            tag: "CODE",
            imagePosition: "38% 55%"
        },
        {
            title: "Web Search",
            description: "Research current information and bring useful sources into your work.",
            icon: "⌕",
            tag: "SEARCH",
            imagePosition: "70% 50%"
        },
        {
            title: "PDF & RAG",
            description: "Upload documents and ask questions using document intelligence.",
            icon: "▤",
            tag: "DOCS",
            imagePosition: "45% 65%"
        },
        {
            title: "Data Analysis",
            description: "Turn CSV and Excel data into charts, patterns and useful insights.",
            icon: "◫",
            tag: "DATA",
            imagePosition: "55% 42%"
        },
        {
            title: "Diagrams",
            description: "Create flowcharts, ER diagrams, mindmaps and visual structures.",
            icon: "◇",
            tag: "VISUAL",
            imagePosition: "35% 45%"
        },
        {
            title: "Create",
            description: "Generate presentations, images, video concepts and creative outputs.",
            icon: "✧",
            tag: "CREATE",
            imagePosition: "64% 58%"
        }
    ]

    return (
        <div className="relative flex h-screen overflow-hidden bg-[#050609] text-white">

            {/* Existing application structure — DO NOT CHANGE */}
            <SideBar />
            <ChatArea />
            <Artifact />

            {!userData && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050609] pointer-events-auto">

                    {/* =========================================================
                        ANIMATED VISUAL BACKGROUND
                        External image is used only as a decorative visual.
                        No application logic depends on the image.
                    ========================================================== */}
                    <div className="pointer-events-none fixed inset-0 overflow-hidden">

                        {/* Remote abstract image */}
                        <div
                            className="absolute -inset-[8%] opacity-[0.20]"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1754738381790-8caa4bb0a670?auto=format&fit=crop&fm=jpg&q=80&w=2400')",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                filter: "saturate(1.05) contrast(1.05)",
                                animation: "darshImageDrift 22s ease-in-out infinite alternate, imageBreath 8s ease-in-out 1s infinite"
                            }}
                        />

                        {/* Black cinematic overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(91,103,255,.15),transparent_34%),linear-gradient(180deg,rgba(4,5,9,.50)_0%,rgba(4,5,9,.88)_52%,#050609_100%)]" />

                        {/* Animated aurora blobs */}
                        <div className="absolute left-[-12%] top-[12%] h-[560px] w-[560px] rounded-full bg-violet-500/[0.08] blur-[140px] animate-[auroraOne_12s_ease-in-out_infinite]" />
                        <div className="absolute right-[-10%] top-[5%] h-[620px] w-[620px] rounded-full bg-blue-500/[0.07] blur-[150px] animate-[auroraTwo_15s_ease-in-out_infinite]" />
                        <div className="absolute bottom-[-25%] left-[30%] h-[600px] w-[600px] rounded-full bg-fuchsia-500/[0.045] blur-[160px] animate-[auroraThree_18s_ease-in-out_infinite]" />

                        {/* Moving grid */}
                        <div
                            className="absolute inset-[-100px] opacity-[0.045]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
                                backgroundSize: "70px 70px",
                                animation: "gridMove 18s linear infinite"
                            }}
                        />

                        {/* Orbiting rings */}
                        <div className="absolute left-1/2 top-[21%] h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-white/[0.035] animate-[orbitOne_18s_linear_infinite]" />
                        <div className="absolute left-1/2 top-[21%] h-[400px] w-[400px] -translate-x-1/2 rounded-full border border-violet-300/[0.04] animate-[orbitTwo_13s_linear_infinite_reverse]" />
                        <div className="absolute left-1/2 top-[21%] h-[650px] w-[650px] -translate-x-1/2 rounded-full border border-blue-300/[0.025] animate-[orbitOne_25s_linear_infinite_reverse]" />

                        {/* Floating particles */}
                        <span className="absolute left-[11%] top-[30%] h-1 w-1 rounded-full bg-violet-200/50 shadow-[0_0_14px_rgba(196,181,253,.8)] animate-[particleFloat_7s_ease-in-out_infinite]" />
                        <span className="absolute left-[82%] top-[24%] h-1.5 w-1.5 rounded-full bg-blue-200/40 shadow-[0_0_16px_rgba(147,197,253,.8)] animate-[particleFloat_9s_ease-in-out_1s_infinite]" />
                        <span className="absolute left-[19%] top-[73%] h-1 w-1 rounded-full bg-white/25 animate-[particleFloat_8s_ease-in-out_2s_infinite]" />
                        <span className="absolute left-[88%] top-[68%] h-1 w-1 rounded-full bg-fuchsia-200/35 animate-[particleFloat_6s_ease-in-out_3s_infinite]" />
                    </div>

                    {/* =========================================================
                        PAGE
                    ========================================================== */}
                    <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1240px] flex-col px-5 py-8 sm:px-8 lg:px-10">

                        {/* Top brand */}
                        <header
                            className="flex items-center justify-between"
                            style={{
                                animation: "fadeDown .7s cubic-bezier(.22,1,.36,1) both"
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[13px] border border-white/[0.12] bg-white/[0.06] shadow-[0_10px_40px_rgba(0,0,0,.3)]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-blue-400/10 to-transparent" />

                                    <svg
                                        viewBox="0 0 24 24"
                                        className="relative h-5 w-5 text-white"
                                        fill="none"
                                    >
                                        <path
                                            d="M12 2.8l2.55 5.52 6.05.67-4.48 4.12 1.22 5.94L12 16.05l-5.34 3 1.22-5.94L3.4 8.99l6.05-.67L12 2.8Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <div className="text-[18px] font-semibold tracking-[-0.03em]">
                                        DarshAI
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.20em] text-white/25">
                                        Intelligent AI Workspace
                                    </div>
                                </div>
                            </div>

                            <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/30 sm:flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                                Multi-agent platform
                            </div>
                        </header>

                        {/* =====================================================
                            HERO
                        ====================================================== */}
                        <section className="mx-auto w-full max-w-[980px] pt-[8vh] text-center sm:pt-[9vh]">

                            <div
                                className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-white/45 backdrop-blur-xl"
                                style={{
                                    animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .05s both"
                                }}
                            >
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-300" />
                                </span>
                                One workspace · many agents
                            </div>

                            <h1
                                className="mt-6 text-[68px] font-semibold leading-[.92] tracking-[-0.07em] sm:text-[92px] md:text-[112px]"
                                style={{
                                    animation: "heroIn .9s cubic-bezier(.22,1,.36,1) .10s both"
                                }}
                            >
                                <span className="block text-white">
                                    Darsh<span className="bg-gradient-to-r from-[#9fb2ff] via-[#c7a8ff] to-[#8bdcff] bg-clip-text text-transparent animate-[brandAI_4s_ease-in-out_infinite]">AI</span>
                                </span>

                                <span className="relative mt-4 block bg-gradient-to-r from-[#e5e9ff] via-[#9eafff] to-[#d8c7ff] bg-clip-text text-[34px] font-medium tracking-[-0.055em] text-transparent sm:text-[48px] md:text-[58px]">
                                    Multi-Agent Platform
                                </span>
                            </h1>

                            <p
                                className="mx-auto mt-7 max-w-[660px] text-[17px] leading-8 text-white/45 sm:text-[20px] sm:leading-8"
                                style={{
                                    animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .22s both"
                                }}
                            >
                                Your intelligent workspace for chatting, coding, researching,
                                analyzing, creating and solving complex tasks.
                            </p>

                            {/* Google button */}
                            <div
                                className="relative z-[70] mx-auto mt-9 w-full max-w-[410px] pointer-events-auto"
                                style={{
                                    animation: "loginIn .8s cubic-bezier(.22,1,.36,1) .30s both, ctaBreath 4s ease-in-out 1.2s infinite"
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={googleLogin}
                                    className="group relative flex h-[60px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/[0.14] bg-white text-[16px] font-medium text-[#202124] shadow-[0_18px_55px_rgba(0,0,0,.32)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f8f9fa] hover:shadow-[0_25px_70px_rgba(0,0,0,.42)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-violet-400/60"
                                >
                                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                    <FcGoogle className="relative" size={20} />
                                    <span className="relative">Continue with Google</span>
                                </button>

                                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-white/25">
                                    <span className="h-px w-8 bg-white/[0.07]" />
                                    Secure authentication
                                    <span className="h-px w-8 bg-white/[0.07]" />
                                </div>
                            </div>
                        </section>

                        {/* =====================================================
                            INFINITE CAPABILITY MARQUEE
                        ====================================================== */}
                        <div
                            className="mx-auto mt-12 w-full max-w-[1000px] overflow-hidden"
                            style={{
                                animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .38s both"
                            }}
                        >
                            <div className="relative overflow-hidden py-2">
                                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#050609] to-transparent" />
                                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#050609] to-transparent" />

                                <div className="flex w-max animate-[marquee_24s_linear_infinite]">
                                    {[
                                        "AI Chat",
                                        "Multi-Agent",
                                        "Coding",
                                        "Web Search",
                                        "PDF",
                                        "Data Analysis",
                                        "Diagrams",
                                        "Vision",
                                        "Resume",
                                        "Translation",
                                        "Presentations",
                                        "Video"
                                    ].concat([
                                        "AI Chat",
                                        "Multi-Agent",
                                        "Coding",
                                        "Web Search",
                                        "PDF",
                                        "Data Analysis",
                                        "Diagrams",
                                        "Vision",
                                        "Resume",
                                        "Translation",
                                        "Presentations",
                                        "Video"
                                    ]).map((item, index) => (
                                        <div
                                            key={`${item}-${index}`}
                                            className="mx-2 flex items-center gap-2 rounded-full border border-white/[0.065] bg-white/[0.025] px-3 py-1.5 text-[11px] font-medium text-white/30 backdrop-blur-md transition-all duration-300 hover:border-violet-300/20 hover:bg-violet-300/[0.05] hover:text-violet-100/70"
                                        >
                                            <span className="h-1 w-1 rounded-full bg-violet-300/50" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* =====================================================
                            FEATURES
                        ====================================================== */}
                        <section className="mx-auto mt-14 w-full max-w-[1050px] pb-12 sm:mt-16">

                            <div
                                className="mb-7 text-center"
                                style={{
                                    animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .42s both"
                                }}
                            >
                                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300/60">
                                    Everything you need
                                </p>

                                <h2 className="mt-2 text-[36px] font-semibold tracking-[-0.05em] text-white sm:text-[40px]">
                                    One AI. Many possibilities.
                                </h2>

                                <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-6 text-white/32">
                                    Explore the tools and specialized agents available inside DarshAI.
                                </p>
                            </div>

                            <div className="mb-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.018] py-2.5">
                                <div className="flex w-max animate-[marqueeReverse_30s_linear_infinite]">
                                    {[
                                        "Think",
                                        "Research",
                                        "Code",
                                        "Analyze",
                                        "Create",
                                        "Automate",
                                        "Visualize",
                                        "Build",
                                        "Think",
                                        "Research",
                                        "Code",
                                        "Analyze",
                                        "Create",
                                        "Automate",
                                        "Visualize",
                                        "Build"
                                    ].map((item, index) => (
                                        <div
                                            key={`${item}-${index}`}
                                            className="mx-2.5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/22"
                                        >
                                            <span className="h-1 w-1 rounded-full bg-violet-300/45" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                                {features.map((feature, index) => (
                                    <div
                                        key={feature.title}
                                        className="group relative min-h-[275px] overflow-hidden rounded-[26px] border border-violet-200/[0.10] bg-gradient-to-br from-[#1b1830]/95 via-[#121421]/95 to-[#0d111b]/95 p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-200/[0.24] hover:from-[#1d1a2d]/95 hover:via-[#141522]/95 hover:to-[#10131c]/95 hover:shadow-[0_28px_80px_rgba(0,0,0,.42)] hover:scale-[1.02] hover:-rotate-[0.25deg]"
                                        style={{
                                            animation: `cardEnter .7s cubic-bezier(.22,1,.36,1) ${480 + index * 75}ms both, cardFloat ${6 + (index % 3)}s ease-in-out ${1000 + index * 180}ms infinite`
                                        }}
                                    >
                                        {/* image texture */}
                                        <div
                                            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-[2px] transition-all duration-700 group-hover:scale-125 group-hover:opacity-25"
                                            style={{
                                                backgroundImage:
                                                    "url('https://images.unsplash.com/photo-1754738381790-8caa4bb0a670?auto=format&fit=crop&fm=jpg&q=70&w=700')",
                                                backgroundPosition: feature.imagePosition,
                                                backgroundSize: "cover"
                                            }}
                                        />

                                        {/* moving hover sheen */}
                                        <div className="pointer-events-none absolute -inset-x-20 -top-24 h-28 rotate-[-12deg] bg-gradient-to-r from-transparent via-white/[0.035] to-transparent opacity-0 blur-md transition-all duration-700 group-hover:translate-y-40 group-hover:opacity-100" />

                                        {/* glow */}
                                        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-violet-500/[0.06] blur-[55px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        {/* subtle colored card edge */}
                                        <div className="pointer-events-none absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-violet-300/25 to-transparent opacity-60" />

                                        {/* continuous card aura */}
                                        <div className="pointer-events-none absolute inset-0 rounded-[26px] border border-violet-300/[0.025] animate-[cardAura_5s_ease-in-out_infinite]" />

                                        {/* top accent */}
                                        <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        <div className="relative z-10 flex items-start justify-between">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.045] text-[14px] font-semibold text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,.03)] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-violet-300/20 group-hover:bg-violet-400/[0.09] group-hover:text-violet-100">
                                                {feature.icon}
                                            </div>

                                            <span className="rounded-full border border-white/[0.06] px-2 py-1 text-[9px] font-semibold tracking-[0.15em] text-violet-200/35 transition-colors duration-300 group-hover:border-violet-300/10 group-hover:text-violet-200/40">
                                                {feature.tag}
                                            </span>
                                        </div>

                                        <div className="relative z-10 mt-7">
                                            <h3 className="text-[23px] font-semibold tracking-[-0.035em] text-white">
                                                {feature.title}
                                            </h3>

                                            <p className="mt-3 text-[15px] leading-6 text-white/50">
                                                {feature.description}
                                            </p>
                                        </div>

                                        {/* slow animated card signal */}
                                        <div className="pointer-events-none absolute right-5 bottom-5 flex items-center gap-1 opacity-35">
                                            <span className="h-1 w-1 rounded-full bg-violet-300 animate-[signalDot_2.4s_ease-in-out_infinite]" />
                                            <span className="h-1 w-1 rounded-full bg-blue-300 animate-[signalDot_2.4s_ease-in-out_.4s_infinite]" />
                                            <span className="h-1 w-1 rounded-full bg-white/50 animate-[signalDot_2.4s_ease-in-out_.8s_infinite]" />
                                        </div>

                                        {/* animated line */}
                                        <div className="absolute bottom-5 left-5 h-px w-7 bg-white/[0.10] transition-all duration-500 group-hover:w-16 group-hover:bg-violet-300/40" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <footer className="mt-auto flex justify-center pb-3">
                            <p className="text-[11px] text-white/18">
                                DarshAI · Intelligent AI workspace
                            </p>
                        </footer>
                    </div>

                    <style>{`
                        @keyframes darshImageDrift {
                            0% {
                                transform: scale(1.04) translate3d(-1%, -1%, 0);
                            }
                            50% {
                                transform: scale(1.10) translate3d(1.5%, 1%, 0);
                            }
                            100% {
                                transform: scale(1.06) translate3d(-.5%, 1.5%, 0);
                            }
                        }

                        @keyframes auroraOne {
                            0%, 100% {
                                transform: translate3d(0, 0, 0) scale(1);
                            }
                            33% {
                                transform: translate3d(110px, 50px, 0) scale(1.12);
                            }
                            66% {
                                transform: translate3d(35px, -70px, 0) scale(.92);
                            }
                        }

                        @keyframes auroraTwo {
                            0%, 100% {
                                transform: translate3d(0, 0, 0) scale(1);
                            }
                            50% {
                                transform: translate3d(-120px, 70px, 0) scale(1.15);
                            }
                        }

                        @keyframes auroraThree {
                            0%, 100% {
                                transform: translate3d(0, 0, 0) scale(1);
                            }
                            50% {
                                transform: translate3d(80px, -80px, 0) scale(1.12);
                            }
                        }

                        @keyframes gridMove {
                            from {
                                transform: translate3d(0, 0, 0);
                            }
                            to {
                                transform: translate3d(70px, 70px, 0);
                            }
                        }

                        @keyframes orbitOne {
                            from {
                                transform: translateX(-50%) rotate(0deg);
                            }
                            to {
                                transform: translateX(-50%) rotate(360deg);
                            }
                        }

                        @keyframes orbitTwo {
                            from {
                                transform: translateX(-50%) rotate(0deg);
                            }
                            to {
                                transform: translateX(-50%) rotate(360deg);
                            }
                        }

                        @keyframes particleFloat {
                            0%, 100% {
                                transform: translate3d(0, 0, 0);
                                opacity: .25;
                            }
                            50% {
                                transform: translate3d(20px, -28px, 0);
                                opacity: .9;
                            }
                        }

                        @keyframes fadeDown {
                            from {
                                opacity: 0;
                                transform: translateY(-12px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        @keyframes fadeUp {
                            from {
                                opacity: 0;
                                transform: translateY(16px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        @keyframes heroIn {
                            from {
                                opacity: 0;
                                transform: translateY(24px) scale(.97);
                                filter: blur(5px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                                filter: blur(0);
                            }
                        }

                        @keyframes loginIn {
                            from {
                                opacity: 0;
                                transform: translateY(16px) scale(.97);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }

                        @keyframes cardEnter {
                            from {
                                opacity: 0;
                                transform: translateY(24px) scale(.97);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }

                        @keyframes cardFloat {
                            0%, 100% {
                                transform: translateY(0);
                            }
                            50% {
                                transform: translateY(-5px);
                            }
                        }

                        @keyframes marquee {
                            from {
                                transform: translateX(0);
                            }
                            to {
                                transform: translateX(-50%);
                            }
                        }

                        @keyframes topLine {
                            0%, 100% {
                                opacity: .2;
                            }
                            50% {
                                opacity: .7;
                            }
                        }

                        @keyframes signalDot {
                            0%, 100% {
                                transform: scale(.7);
                                opacity: .25;
                            }
                            50% {
                                transform: scale(1.35);
                                opacity: 1;
                            }
                        }

                        @keyframes marqueeReverse {
                            from {
                                transform: translateX(-25%);
                            }
                            to {
                                transform: translateX(0);
                            }
                        }

                        @keyframes ctaBreath {
                            0%, 100% {
                                filter: drop-shadow(0 0 0 rgba(139, 92, 246, 0));
                            }
                            50% {
                                filter: drop-shadow(0 8px 24px rgba(139, 92, 246, .08));
                            }
                        }

                        @keyframes ribbonOne {
                            0%, 100% {
                                transform: translateX(-50%) translate3d(-40px, 0, 0) rotate(-12deg) scaleX(.92);
                                opacity: .35;
                            }
                            50% {
                                transform: translateX(-50%) translate3d(60px, 20px, 0) rotate(-8deg) scaleX(1.08);
                                opacity: .75;
                            }
                        }

                        @keyframes ribbonTwo {
                            0%, 100% {
                                transform: translateX(-50%) translate3d(45px, -10px, 0) rotate(14deg) scaleX(1);
                                opacity: .3;
                            }
                            50% {
                                transform: translateX(-50%) translate3d(-70px, 25px, 0) rotate(9deg) scaleX(.9);
                                opacity: .7;
                            }
                        }

                        @keyframes lightSweep {
                            0% {
                                transform: translate3d(-30vw, 0, 0) rotate(18deg);
                                opacity: 0;
                            }
                            15% {
                                opacity: .7;
                            }
                            50% {
                                opacity: .25;
                            }
                            100% {
                                transform: translate3d(260vw, 0, 0) rotate(18deg);
                                opacity: 0;
                            }
                        }

                        @keyframes starPulse {
                            0%, 100% {
                                transform: scale(.5);
                                opacity: .15;
                            }
                            50% {
                                transform: scale(1.8);
                                opacity: .9;
                            }
                        }

                        @keyframes brandAI {
                            0%, 100% {
                                filter: brightness(.95);
                                text-shadow: 0 0 0 rgba(167,139,250,0);
                            }
                            50% {
                                filter: brightness(1.18);
                                text-shadow: 0 0 22px rgba(167,139,250,.18);
                            }
                        }

                        @keyframes imageBreath {
                            0%, 100% {
                                opacity: .18;
                            }
                            50% {
                                opacity: .235;
                            }
                        }

                        @keyframes energyPulse {
                            0%, 100% {
                                transform: translateX(-50%) scale(.94);
                                opacity: .15;
                            }
                            50% {
                                transform: translateX(-50%) scale(1.06);
                                opacity: .55;
                            }
                        }

                        @keyframes atmosphereLine {
                            0%, 100% {
                                transform: translateX(-7%) scaleX(.78);
                                opacity: .15;
                            }
                            50% {
                                transform: translateX(7%) scaleX(1);
                                opacity: .7;
                            }
                        }

                        @keyframes cardAura {
                            0%, 100% {
                                opacity: .25;
                                transform: scale(.995);
                            }
                            50% {
                                opacity: .75;
                                transform: scale(1.01);
                            }
                        }

                        @media (max-width: 480px) {
                            h1 {
                                letter-spacing: -0.06em;
                            }
                        }

                        @media (max-width: 640px) {
                            .animate-\[lightSweep_14s_linear_infinite\] {
                                animation-duration: 20s;
                            }

                                                        @keyframes darshImageDrift {
                                0%, 100% {
                                    transform: scale(1.08);
                                }
                                50% {
                                    transform: scale(1.14) translate3d(1%, 1%, 0);
                                }
                            }

                            .group {
                                animation-duration: 0.01ms;
                            }
                        }

                        @media (prefers-reduced-motion: reduce) {
                            *,
                            *::before,
                            *::after {
                                animation-duration: .01ms !important;
                                animation-iteration-count: 1 !important;
                                transition-duration: .01ms !important;
                                scroll-behavior: auto !important;
                            }
                        }
                    `}</style>
                </div>
            )}
        </div>
    )
}

export default Home
