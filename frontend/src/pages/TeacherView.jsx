import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User } from 'lucide-react'
import { generateModule, getConversations, createConversation, getConversationMessages } from '../services/api'
import ConversationSidebar from '../components/ConversationSidebar'
import ChatMessage from '../components/ChatMessage'
import FeedbackForm from '../components/FeedbackForm'
import LogoIcon from '../assets/pragati-logo-icon.png'

export default function TeacherView() {
    const [conversations, setConversations] = useState([])
    const [activeConvId, setActiveConvId] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [duration, setDuration] = useState(15)
    const [isLoading, setIsLoading] = useState(false)
    const [showFeedback, setShowFeedback] = useState(false)
    const [currentModule, setCurrentModule] = useState(null)
    const endRef = useRef(null)
    const location = useLocation()

    const [showNavbar, setShowNavbar] = useState(true)
    const scrollTimeout = useRef(null)
    const lastScrollY = useRef(0)

    // Hide navbar when scrolling down, show when scrolling up
    const handleScroll = (e) => {
        const currentY = e.target.scrollTop
        const delta = currentY - lastScrollY.current
        const scrollingDown = delta > 5
        const scrollingUp = delta < -5
        const atTop = currentY < 50

        if (atTop) {
            setShowNavbar(true)
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current)
                scrollTimeout.current = null
            }
        }
        else if (scrollingDown) {
            setShowNavbar(false)
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current)
                scrollTimeout.current = null
            }
        }
        else if (scrollingUp) {
            // Wait a bit before showing it again
            if (!showNavbar && !scrollTimeout.current) {
                scrollTimeout.current = setTimeout(() => {
                    setShowNavbar(true)
                    scrollTimeout.current = null
                }, 2000)
            }
        }

        lastScrollY.current = currentY
    }

    useEffect(() => {
        return () => {
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
        }
    }, [])

    useEffect(() => {
        if (location.state?.conversationId) {
            setActiveConvId(location.state.conversationId)
        }
    }, [location])

    useEffect(() => {
        loadConversations()
    }, [])

    useEffect(() => {
        if (activeConvId) {
            loadMessages(activeConvId)
        } else {
            setMessages([])
        }
    }, [activeConvId])

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const loadConversations = async () => {
        try {
            const res = await getConversations()
            if (res.success) {
                setConversations(res.conversations)
            }
        } catch (err) {
            console.error('Conversations load failed:', err)
        }
    }

    const loadMessages = async (id) => {
        try {
            const res = await getConversationMessages(id)
            if (res.success) {
                setMessages(res.messages)
            }
        } catch (err) {
            console.error('Messages load failed:', err)
        }
    }

    const onNewChat = () => {
        setActiveConvId(null)
        setMessages([])
        setInput('')
        setCurrentModule(null)
        setShowFeedback(false)
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        let convId = activeConvId

        // Start new conv if needed
        if (!convId) {
            try {
                const res = await createConversation(input.substring(0, 50))
                if (res.success) {
                    convId = res.conversation_id
                    setActiveConvId(convId)
                    await loadConversations()
                }
            } catch (err) {
                console.error('Create conv failed:', err)
                return
            }
        }

        const userMsg = input
        setInput('')
        setIsLoading(true)

        try {
            const res = await generateModule({
                challenge: userMsg,
                target_duration: duration,
                difficulty_level: 'intermediate',
                conversation_id: convId
            })

            if (res.success) {
                await loadMessages(convId)
                setCurrentModule(res.module)
            }
        } catch (err) {
            console.error('Generation failed:', err)
            alert('Something went wrong. Try again?')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-pragati-bg via-[#fff5fb] to-pragati-secondary/10 font-ranade text-pragati-text selection:bg-pragati-primary selection:text-white overflow-hidden">
            <ConversationSidebar
                conversations={conversations}
                activeId={activeConvId}
                onSelect={setActiveConvId}
                onNewConversation={onNewChat}
            />

            <div className="flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute top-20 right-20 w-64 h-64 bg-pragati-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob pointer-events-none" />
                <div className="absolute bottom-20 left-20 w-64 h-64 bg-pragati-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />

                <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-30 transition-all duration-500 transform ${showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
                    <div className="bg-white/60 backdrop-blur-xl border border-white/40 px-6 py-2 rounded-full flex items-center justify-between shadow-lg shadow-black/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <img src={LogoIcon} alt="PRAGATI Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-sm font-bold text-pragati-text font-ranade tracking-tight uppercase leading-none">PRAGATI</h1>
                                <p className="text-[8px] text-pragati-primary/70 font-bold uppercase tracking-widest mt-1">AI Teaching Assistant</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-black/5 rounded-full transition-colors relative group">
                                <div className="w-9 h-9 border-2 border-pragati-primary/20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-pragati-secondary/20 shadow-inner">
                                    <User className="w-5 h-5 text-pragati-primary/60" />
                                </div>
                                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto pt-24 pb-40 px-6 relative z-10 transition-all scroll-smooth"
                >
                    {messages.length === 0 && !activeConvId ? (
                        <div className="flex items-center justify-center h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center max-w-md bg-white/40 backdrop-blur-xl p-10 rounded-3xl border border-white/40 shadow-xl"
                            >
                                <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                    <img src={LogoIcon} alt="PRAGATI Logo" className="w-full h-full object-contain" />
                                </div>
                                <h2 className="text-3xl font-bold text-pragati-text mb-3 font-ranade">
                                    Welcome to PRAGATI
                                </h2>
                                <p className="text-pragati-text/70 mb-8 font-ranade leading-relaxed">
                                    Type your classroom challenge below to generate a micro-learning module.
                                </p>
                            </motion.div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    message={msg}
                                    onFeedbackClick={() => {
                                        setCurrentModule(msg.module_data)
                                        setShowFeedback(true)
                                    }}
                                />
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-pragati-secondary/30 flex items-center justify-center flex-shrink-0">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pragati-primary"></div>
                                    </div>
                                    <div className="bg-white/60 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-sm border border-white/40 shadow-sm">
                                        <p className="text-sm text-pragati-text/70 italic">Generating module...</p>
                                    </div>
                                </div>
                            )}
                            <div ref={endRef} />
                        </>
                    )}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-30">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-2 shadow-2xl shadow-pragati-primary/5 transition-all hover:shadow-pragati-primary/10 hover:bg-white/80">
                        <form onSubmit={sendMessage} className="flex gap-2 items-end relative">
                            <div className="flex-1 p-2">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Refine the module or ask a new question..."
                                    className="w-full bg-transparent border-none p-3 focus:ring-0 resize-none max-h-32 text-base text-pragati-text placeholder:text-pragati-text/40 font-ranade"
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            sendMessage(e)
                                        }
                                    }}
                                    disabled={isLoading}
                                />
                                <div className="flex items-center gap-2 px-2 pb-1 mt-1">
                                    {[5, 15, 40].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setDuration(t)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${duration === t
                                                ? 'bg-pragati-primary text-white shadow-sm'
                                                : 'bg-pragati-secondary/20 text-pragati-primary hover:bg-pragati-secondary/40'
                                                }`}
                                        >
                                            {t} min
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-pragati-primary hover:bg-pragati-primary/90 text-white p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-lg shadow-pragati-primary/20 hover:shadow-pragati-primary/30 transform hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:hover:translate-y-0 mb-2 mr-2"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showFeedback && currentModule && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 m-4">
                            <FeedbackForm
                                moduleId={currentModule.id}
                                challenge={currentModule.challenge}
                                conversationId={activeConvId}
                                onClose={() => setShowFeedback(false)}
                            />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
