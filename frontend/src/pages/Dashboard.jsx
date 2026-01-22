import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, MessageSquare, Users, Star, School, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import { useDialect } from '../context/DialectContext'

const API_URL = 'http://localhost:8000/api'

// Helper to safely parse and format dates as IST
const formatToIST = (dateStr, options = {}) => {
    if (!dateStr) return '';
    // If the string doesn't have a timezone indicator, assume it's UTC (from SQLite)
    let processedStr = dateStr;
    if (typeof dateStr === 'string' && !dateStr.includes('Z') && !dateStr.includes('+')) {
        processedStr = dateStr.replace(' ', 'T') + 'Z';
    }
    return new Date(processedStr).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        ...options
    });
};

const formatTimeIST = (dateStr, options = {}) => {
    if (!dateStr) return '';
    let processedStr = dateStr;
    if (typeof dateStr === 'string' && !dateStr.includes('Z') && !dateStr.includes('+')) {
        processedStr = dateStr.replace(' ', 'T') + 'Z';
    }
    return new Date(processedStr).toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        ...options
    });
};

export default function Dashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [recentFeedback, setRecentFeedback] = useState([])
    const [recentQueries, setRecentQueries] = useState([])
    const [loading, setLoading] = useState(true)
    const [isScrolled, setIsScrolled] = useState(false)
    const { adaptContent, selectedDialect } = useDialect()
    const [translatedTitle, setTranslatedTitle] = useState("DIET Overview")

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        fetchStats()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const updateTitle = async () => {
            const translated = await adaptContent("DIET Overview")
            setTranslatedTitle(translated)
        }
        updateTitle()
    }, [selectedDialect])

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/feedback/stats`)
            if (response.data.success) {
                setStats(response.data.stats)
                setRecentFeedback(response.data.recent_feedback)
                setRecentQueries(response.data.recent_queries || [])
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pragati-bg via-[#fff5fb] to-pragati-secondary/10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pragati-primary"></div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-pragati-bg via-[#fff5fb] to-pragati-secondary/10 font-ranade text-pragati-text">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-72 relative">
                {/* Glassy Sticky Header */}
                <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm' : 'bg-transparent'}`}>
                    <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-pragati-text flex items-center gap-3">
                            <div className="p-2 bg-pragati-primary/10 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-pragati-primary" />
                            </div>
                            {translatedTitle}
                        </h1>
                        <div className="text-sm font-medium text-pragati-text/50">
                            {formatToIST(new Date().toISOString(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-pragati-text/60 uppercase tracking-wider">Avg. Implementation</h3>
                                <div className="p-2 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold text-pragati-text">{stats?.average_rating || 0}</span>
                                <span className="ml-2 text-sm text-pragati-text/50 font-medium">/ 5.0</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+0.8</span>
                                <span className="text-xs text-pragati-text/50">from last month</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-pragati-text/60 uppercase tracking-wider">Total Feedback</h3>
                                <div className="p-2 bg-pragati-accent/10 text-pragati-accent rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-4xl font-bold text-pragati-text">{stats?.total_count || 0}</div>
                            <p className="mt-3 text-xs text-pragati-text/50 font-medium flex items-center gap-1">
                                <School className="w-3 h-3" /> From 5 different clusters
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-pragati-text/60 uppercase tracking-wider">Active Teachers</h3>
                                <div className="p-2 bg-pragati-primary/10 text-pragati-primary rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-4xl font-bold text-pragati-text">128</div>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs font-bold text-pragati-primary bg-pragati-primary/10 px-2 py-0.5 rounded-full">+12</span>
                                <span className="text-xs text-pragati-text/50">new this week</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Implementation Status Chart */}
                        <div className="lg:col-span-1 bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/60 flex flex-col h-[500px]">
                            <h3 className="text-xl font-bold text-pragati-text mb-6">Implementation Status</h3>
                            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                {Object.entries(stats?.implementation_breakdown || {}).map(([status, count], index) => (
                                    <div key={status} className="group">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-pragati-text capitalize flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${status === 'implemented' ? 'bg-green-500' :
                                                    status === 'partially_implemented' ? 'bg-yellow-400' :
                                                        'bg-gray-400'
                                                    }`} />
                                                {status.replace('_', ' ')}
                                            </span>
                                            <span className="text-pragati-text/60 font-medium">{count} modules</span>
                                        </div>
                                        <div className="w-full bg-black/5 rounded-full h-3 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / stats.total_count) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                                className={`h-full rounded-full ${status === 'implemented' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                                    status === 'partially_implemented' ? 'bg-gradient-to-r from-yellow-300 to-yellow-400' :
                                                        'bg-gradient-to-r from-gray-300 to-gray-400'
                                                    }`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                                {(!stats?.implementation_breakdown || Object.keys(stats.implementation_breakdown).length === 0) && (
                                    <div className="flex flex-col items-center justify-center h-40 text-pragati-text/40">
                                        <BarChart3 className="w-10 h-10 mb-2 opacity-50" />
                                        <p className="text-sm">No data available yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Live Teacher Activity */}
                        <div className="lg:col-span-1 bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/60 flex flex-col h-[500px]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-pragati-text flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pragati-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-pragati-primary"></span>
                                    </span>
                                    Live Activity
                                </h3>
                                <span className="text-xs font-medium px-2 py-1 bg-pragati-primary/10 text-pragati-primary rounded-full">Real-time</span>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {recentQueries.map((query, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-4 bg-white/50 border border-white/60 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-2 bg-gradient-to-br from-pragati-primary/10 to-pragati-secondary/20 text-pragati-primary rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <MessageSquare className="w-4 h-4" />
                                            </div>
                                            <div className="w-full">
                                                <p className="text-sm text-pragati-text font-medium line-clamp-2 leading-relaxed">
                                                    "{query.content}"
                                                </p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-[10px] uppercase tracking-wide font-bold text-pragati-primary bg-pragati-secondary/20 px-2 py-1 rounded-md">
                                                        {query.topic ? query.topic.substring(0, 15) : 'General'}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-pragati-text/40">
                                                        <Clock className="w-3 h-3" />
                                                        {formatTimeIST(query.created_at, { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {recentQueries.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-pragati-text/40">
                                        <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                                        <p className="text-sm">No active queries right now</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Feedback Feed */}
                        <div className="lg:col-span-1 bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/60 flex flex-col h-[500px]">
                            <h3 className="text-xl font-bold text-pragati-text mb-6">Recent Feedback</h3>

                            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {recentFeedback.map((fb, idx) => (
                                    <motion.div
                                        key={fb.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-4 bg-white/50 border border-white/60 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide ${fb.implementation_status === 'implemented' ? 'bg-green-100 text-green-700' :
                                                    fb.implementation_status === 'partially_implemented' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {fb.implementation_status.replace('_', ' ')}
                                                </span>
                                                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm border border-black/5">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-bold text-pragati-text text-sm">{fb.rating}</span>
                                                </div>
                                            </div>

                                            {/* Challenge Context */}
                                            {fb.challenge && (
                                                <div className="p-3 bg-pragati-primary/5 rounded-lg border border-pragati-primary/10">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="text-[10px] text-pragati-primary font-bold uppercase tracking-wider flex items-center gap-1">
                                                            <MessageSquare className="w-3 h-3" /> Query Context
                                                        </p>

                                                    </div>
                                                    <p className="text-xs text-pragati-text/80 italic line-clamp-2">"{fb.challenge}"</p>
                                                </div>
                                            )}

                                            <div className="relative pl-3 border-l-2 border-pragati-text/10">
                                                <p className="text-pragati-text text-sm font-medium">"{fb.comments || "No comments provided"}"</p>
                                            </div>

                                            <p className="text-[10px] text-pragati-text/40 text-right mt-1 font-medium">
                                                {formatToIST(fb.created_at, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                                {recentFeedback.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-pragati-text/40">
                                        <Star className="w-10 h-10 mb-2 opacity-50" />
                                        <p className="text-sm">No specific feedback yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
