// import React from 'react'
// import { Coins, LogOut, Menu, MessageSquare, PanelLeftIcon, PanelRight, PenBoxIcon, PenSquare, Plus, User, X } from "lucide-react"
// import { useState } from 'react'
// import { useEffect } from 'react'
// import { getConversations } from '../features/getConversations'
// import { useDispatch, useSelector } from 'react-redux'
// import { addConversation, setConversations, setSelectedConversation } from '../redux/conversationSlice'

// import { createConversation } from '../features/createConversation'
// import logOut from '../features/logOut'
// import { setUserdata } from '../redux/userSlice'
// import BillingDrawer from './BillingDrawer'
// function SideBar() {
//     const [collapsed, setCollapsed] = useState(false)
//     const dispatch = useDispatch()
//     const [imageError, setImageError] = useState(false)
//     const { conversations, selectedConversation } = useSelector(state => state.conversation)
//     const { userData } = useSelector(state => state.user)
//     const [showBilling,setShowBilling]=useState(false)
//     const [mobileOpen,setMobileOpen]=useState(false)
//     useEffect(() => {
//         const getConv = async () => {
//             const data = await getConversations()
//             dispatch(setConversations(data))
//         }
//         getConv()
//     }, [userData?._id])

//     const handleCreateConversation = async () => {
//         const data = await createConversation()
//         dispatch(addConversation(data))
//     }



//     if (collapsed) {
//         return (
//             <div className='hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0'>
//                 <button className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1'
//                     onClick={() => setCollapsed(false)}
//                 >
//                     <PanelRight />
//                 </button>

//                 <button
//                     className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer '
//                     onClick={()=>dispatch(setSelectedConversation(null))}
//                 >
//                     <Plus size={17} />
//                 </button>

//                 <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5'>
//                     {conversations.map((conv, i) => {
//                         const isActive = selectedConversation?._id == conv?._id
//                         return (
//                             <div
//                                 onClick={() => dispatch(setSelectedConversation(conv))}
//                                 className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
//                 ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]"
//                                         : "bg-transparent border-transparent"}`}>
//                                 <div className={`flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-lg transition-colors duration-150
//                 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}>
//                                     <MessageSquare size={13} />
//                                 </div>
                               

//                             </div>
//                         )
//                     })}

//                 </div>

// <div className='"relative shrink-0'>
//                                 {
//                                     (userData?.avatar && !imageError)
//                                         ?
//                                         <img
//                                             className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'
//                                             src={userData?.avatar}
//                                             alt={"image"}
//                                             onError={() => setImageError(true)} />
//                                         :
//                                         <div className='w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center'>
//                                             <User size={15} className="text-slate-400" />
//                                         </div>

//                                 }

//                             </div>
                

//             </div>
//         )
//     }


//     return (
//         <>
         
//        <button className='lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer' onClick={()=>setMobileOpen(true)}>
//             <Menu size={14}/>
//          </button>

//          {mobileOpen && <div onClick={()=>setMobileOpen(false)} className='lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'/>}
  


//         <div className={` fixed lg:static inset-y-0 left-0 z-50
//         w-[270px] h-screen shrink-0
//         bg-[#0d0f14] border-r border-white/[0.06]
//         transition-transform duration-250
//         ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
// `}
//       >

            

//             <div className='flex flex-col h-full'>
//                 <div className='flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]'>
//                     <div className='hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
//                         onClick={() => setCollapsed(true)}
//                     >
//                         <PanelLeftIcon />
//                     </div>

//                     <button  onClick={() => setMobileOpen(false)}
//           className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
// >
//                         <X/>
//                     </button>
//                     <span className='text-[16px] font-semibold text-slate-100 tracking-tight flex-1'>
//                         DarshAI
//                     </span>
//                     <span className='text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide'>{userData?.plan || "free"}</span>
//                     <button className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
//                         onClick={()=>dispatch(setSelectedConversation(null))}>
//                         <PenSquare size={14} />
//                     </button>
//                 </div>

//                 <div className='px-4 pt-4 pb-1'>
//                     <button className='w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150'
//                         onClick={()=>dispatch(setSelectedConversation(null))}
//                     >
//                         <Plus size={15} />
//                         New Chat
//                     </button>
//                 </div>

//                 {conversations.length == 0
//                     ?
//                     <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>
//                         No Recent Conversations
//                     </div>
//                     :
//                     (
//                         <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>
//                             Recents
//                         </div>
//                     )}


//                 <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
//                     {conversations?.map((conv, i) => {
//                         const isActive = selectedConversation?._id == conv?._id
//                         return (
//                             <div
//                                 onClick={() => dispatch(setSelectedConversation(conv))}
//                                 className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
//                 ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]"
//                                         : "bg-transparent border-transparent"}`}>
//                                 <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150
//                 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}>
//                                     <MessageSquare size={13} />
//                                 </div>
//                                 <span className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-300"}`}>
//                                     {conv?.title || "New Chat"}
//                                 </span>

//                             </div>
//                         )
//                     })}

//                 </div>

//                 <div className='mx-2.5 h-px bg-white/[0.06]' />
//                 <div className='px-3.5 py-3.5'>
//                     {userData ? (
//                         <div className='flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150'>
//                             <div className='"relative shrink-0'>
//                                 {
//                                     (userData?.avatar && !imageError)
//                                         ?
//                                         <img
//                                             className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'
//                                             src={userData?.avatar}
//                                             alt={"image"}
//                                             onError={() => setImageError(true)} />
//                                         :
//                                         <div className='w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center'>
//                                             <User size={15} className="text-slate-400" />
//                                         </div>

//                                 }

//                             </div>
//                             <div className='flex-1 min-w-0'>
//                                 <p className='text-[13.5px] font-semibold text-slate-100 truncate'>{userData?.name || "user"}</p>
//                                 <p className='text-[11px] text-slate-600 mt-px'>{`${userData?.plan}` || "free plan"} </p>
//                             </div>
//                             <div className='flex gap-1'>
//                                 <button 
//                                 onClick={()=>setShowBilling(true)}
//                                 className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150'>
//                                     <Coins size={16} />
//                                 </button>
//                                 <button className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150'
//                                     onClick={() => {
//                                         logOut();
//                                         dispatch(setUserdata(null))
//                                     }}
//                                 >
//                                     <LogOut size={16} />
//                                 </button>
//                             </div>
//                         </div>)
//                         :
//                         <button className='w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150'>
//                             Login
//                         </button>}
//                 </div>
//             </div>

//         </div>

        
//            <BillingDrawer
//            open={showBilling}
//            onClose={()=>setShowBilling(false)}
//            />

//         </>
//     )




// }

// export default SideBar
















import React from 'react'
import { Coins, LogOut, Menu, MessageSquare, PanelLeftIcon, PanelRight, PenBoxIcon, PenSquare, Plus, User, X } from "lucide-react"
import { useState } from 'react'
import { useEffect } from 'react'
import { getConversations } from '../features/getConversations'
import { useDispatch, useSelector } from 'react-redux'
import { addConversation, setConversations, setSelectedConversation } from '../redux/conversationSlice'

import { createConversation } from '../features/createConversation'
import logOut from '../features/logOut'
import { setUserdata } from '../redux/userSlice'
import BillingDrawer from './BillingDrawer'
function SideBar() {
    const [collapsed, setCollapsed] = useState(false)
    const dispatch = useDispatch()
    const [imageError, setImageError] = useState(false)
    const { conversations, selectedConversation } = useSelector(state => state.conversation)
    const { userData } = useSelector(state => state.user)
    const [showBilling, setShowBilling] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const getConv = async () => {
            const data = await getConversations()
            dispatch(setConversations(data))
        }
        getConv()
    }, [userData?._id])

    const handleCreateConversation = async () => {
        const data = await createConversation()
        dispatch(addConversation(data))
    }

    if (collapsed) {
        return (
            <div className='hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0b0d12]/95 border-r border-white/[0.07] py-4 gap-1 shrink-0 shadow-[12px_0_45px_rgba(0,0,0,.14)] backdrop-blur-xl'>
                <button
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-violet-200 hover:bg-violet-400/[0.08] transition-all duration-300 bg-transparent border-none cursor-pointer mb-1'
                    onClick={() => setCollapsed(false)}
                >
                    <PanelRight size={17} />
                </button>

                <button
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-violet-200 hover:bg-violet-400/[0.08] transition-all duration-300 bg-transparent border-none cursor-pointer'
                    onClick={() => dispatch(setSelectedConversation(null))}
                >
                    <Plus size={17} />
                </button>

                <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5'>
                    {conversations.map((conv) => {
                        const isActive = selectedConversation?._id == conv?._id

                        return (
                            <div
                                key={conv?._id}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                className={`group flex items-center justify-center cursor-pointer mb-1 p-2 rounded-xl border transition-all duration-200
                                ${isActive
                                    ? "bg-white/[0.055] border-white/[0.08] shadow-[inset_2px_0_0_rgba(167,139,250,.48)]"
                                    : "bg-transparent border-transparent hover:bg-white/[0.045]"
                                }`}
                            >
                                <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-all duration-200
                                ${isActive
                                    ? "bg-violet-400/[0.09] text-violet-200"
                                    : "bg-white/[0.045] text-slate-500 group-hover:text-violet-200"
                                }`}>
                                    <MessageSquare size={13} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <>
            <SidebarMotionStyles />

            <button
                className='lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer'
                onClick={() => setMobileOpen(true)}
            >
                <Menu size={14} />
            </button>

            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className='lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-md'
                />
            )}

            <div className={`fixed lg:static inset-y-0 left-0 z-50
                w-[270px] h-screen shrink-0
                bg-[#0b0d12]/95 border-r border-white/[0.07]
                shadow-[12px_0_45px_rgba(0,0,0,.16)] backdrop-blur-xl
                transition-transform duration-300
                ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className='flex flex-col h-full'>

                    {/* Header */}
                    <div className='flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.07] bg-gradient-to-b from-white/[0.018] to-transparent'>
                        <div
                            className='hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-violet-200 hover:bg-violet-400/[0.08] transition-all duration-300 cursor-pointer'
                            onClick={() => setCollapsed(true)}
                        >
                            <PanelLeftIcon size={16} />
                        </div>

                        <button
                            onClick={() => setMobileOpen(false)}
                            className='lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-violet-200 hover:bg-violet-400/[0.08] transition-all duration-300 bg-transparent border-none cursor-pointer'
                        >
                            <X size={16} />
                        </button>

                        <span className='text-[17px] font-semibold text-white tracking-[-0.035em] flex-1'>
                            Darsh<span className='text-violet-300'>AI</span>
                        </span>

                        <span className='text-[10px] font-semibold text-violet-200 bg-violet-400/[0.09] border border-violet-300/[0.16] px-2.5 py-1 rounded-full tracking-[0.06em] uppercase'>
                            {userData?.plan || "free"}
                        </span>

                        <button
                            className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-violet-200 hover:bg-violet-400/[0.08] transition-all duration-300 bg-transparent border-none cursor-pointer'
                            onClick={() => dispatch(setSelectedConversation(null))}
                        >
                            <PenSquare size={14} />
                        </button>
                    </div>

                    {/* New Chat */}
                    <div className='px-4 pt-2 pb-1'>
                        <button
                            className='darsh-sidebar-new w-full flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-xl py-[11px] border-none cursor-pointer shadow-[0_10px_28px_rgba(79,70,229,.22)] hover:brightness-110 hover:shadow-[0_10px_28px_rgba(79,70,229,.26)] active:translate-y-0 transition-all duration-300'
                            onClick={() => dispatch(setSelectedConversation(null))}
                        >
                            <Plus size={15} />
                            New Chat
                        </button>
                    </div>

                    {/* Recent label */}
                    <div className='px-5 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300/45'>
                        {conversations.length == 0 ? "No Recent Conversations" : "Recents"}
                    </div>

                    {/* Conversations */}
                    <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                        {conversations?.map((conv) => {
                            const isActive = selectedConversation?._id == conv?._id

                            return (
                                <div
                                    key={conv?._id}
                                    onClick={() => dispatch(setSelectedConversation(conv))}
                                    className={`darsh-sidebar-row group flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[12px] border transition-all duration-200
                                    ${isActive
                                        ? "bg-white/[0.055] border-white/[0.08] shadow-[inset_2px_0_0_rgba(167,139,250,.48)]"
                                        : "bg-transparent border-transparent hover:bg-white/[0.045] hover:border-white/[0.05]"
                                    }`}
                                >
                                    <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-all duration-200
                                    ${isActive
                                        ? "bg-violet-400/[0.09] text-violet-200"
                                        : "bg-white/[0.045] text-slate-500 group-hover:text-violet-200"
                                    }`}>
                                        <MessageSquare size={13} />
                                    </div>

                                    <span className={`text-[14px] font-medium truncate tracking-[-0.01em] ${isActive ? "text-white" : "text-slate-300"}`}>
                                        {conv?.title || "New Chat"}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Bottom actions */}
                    <div className='mx-3 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent' />

                    {/* User profile */}
                    <div className='px-3.5 pt-3 pb-2'>
                        {userData ? (
                            <div className='group flex items-center gap-3 rounded-xl border border-violet-300/[0.10] bg-gradient-to-r from-violet-500/[0.075] via-indigo-500/[0.045] to-blue-500/[0.025] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.035)] transition-all duration-300 hover:border-violet-300/[0.17] hover:from-violet-500/[0.10] hover:via-indigo-500/[0.06] hover:to-blue-500/[0.035] hover:shadow-[0_8px_24px_rgba(79,70,229,.08)]'>
                                <div className='relative shrink-0'>
                                    <div className='absolute -inset-1 rounded-[14px] bg-violet-400/10 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

                                    {(userData?.avatar || userData?.photoURL || userData?.picture) && !imageError ? (
                                        <img
                                            className='relative w-10 h-10 rounded-[12px] object-cover border border-violet-300/20 shadow-[0_4px_18px_rgba(0,0,0,.25)]'
                                            src={userData?.avatar || userData?.photoURL || userData?.picture}
                                            alt='Profile'
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className='relative w-10 h-10 rounded-[12px] bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-blue-500/10 border border-violet-300/15 flex items-center justify-center overflow-hidden'>
                                            <span className='text-[13px] font-semibold text-violet-100'>
                                                {(userData?.name || 'U').trim().charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}

                                    <span className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b0d12] bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,.45)]' />
                                </div>

                                <div className='min-w-0 flex-1'>
                                    <p className='text-[14px] font-semibold text-white truncate tracking-[-0.02em]'>
                                        {userData?.name || 'User'}
                                    </p>
                                    <p className='mt-0.5 text-[10.5px] text-slate-400/65 truncate'>
                                        {userData?.email || 'DarshAI account'}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className='px-3.5 pb-3.5'>
                        <div className='grid grid-cols-2 gap-2'>

                                <button
                                    onClick={() => setShowBilling(true)}
                                    className='group flex h-[48px] items-center justify-center gap-2 rounded-xl border border-violet-300/[0.10] bg-white/[0.035] px-3 text-center text-[12px] font-semibold text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,.025)] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/[0.18] hover:bg-violet-500/[0.075] hover:text-white hover:shadow-[0_8px_24px_rgba(79,70,229,.10)] active:translate-y-0'
                                >
                                    <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-400/[0.09] text-violet-200/85 border border-violet-300/[0.07] group-hover:bg-violet-400/[0.13] group-hover:text-violet-100 transition-colors duration-200'>
                                        <Coins size={15} />
                                    </div>

                                    <span>Credits</span>
                                </button>

                                <button
                                    onClick={() => {
                                        logOut()
                                        dispatch(setUserdata(null))
                                    }}
                                    className='group flex h-[48px] items-center justify-center gap-2 rounded-xl border border-violet-300/[0.10] bg-white/[0.035] px-3 text-center text-[12px] font-semibold text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,.025)] transition-all duration-300 hover:-translate-y-0.5 hover:border-red-300/[0.14] hover:bg-red-400/[0.055] hover:text-white hover:shadow-[0_8px_24px_rgba(239,68,68,.07)] active:translate-y-0'
                                >
                                    <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-400/[0.07] text-red-200/75 border border-violet-300/[0.06] group-hover:bg-red-400/[0.09] group-hover:text-red-100 transition-colors duration-200'>
                                        <LogOut size={15} />
                                    </div>

                                    <span>Logout</span>
                                </button>

                        </div>
                    </div>
                </div>

            </div>

            <BillingDrawer
                open={showBilling}
                onClose={() => setShowBilling(false)}
            />
        </>
    )
}

const SidebarMotionStyles = () => (
    <style>{`
        @keyframes sidebarGlow {
            0%, 100% { box-shadow: 0 0 0 rgba(139,92,246,0); }
            50% { box-shadow: 0 0 16px rgba(139,92,246,.045); }
        }

        .darsh-sidebar-row {
            position: relative;
            isolation: isolate;
        }

        .darsh-sidebar-row::after {
            content: "";
            position: absolute;
            inset: 1px;
            border-radius: 11px;
            pointer-events: none;
            background: linear-gradient(
                110deg,
                transparent 25%,
                rgba(167,139,250,.035) 50%,
                transparent 75%
            );
            transform: translateX(-70%);
            opacity: 0;
            transition: transform .45s ease, opacity .25s ease;
            z-index: -1;
        }

        .darsh-sidebar-row:hover::after {
            transform: translateX(70%);
            opacity: .35;
        }

        .darsh-sidebar-new {
            animation: sidebarGlow 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
            .darsh-sidebar-new {
                animation: none !important;
            }

            .darsh-sidebar-row::after {
                transition: none !important;
            }
        }
    `}</style>
)

export default SideBar
