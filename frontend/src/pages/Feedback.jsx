import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Star, ArrowDownWideNarrow, Filter, BarChart3, Clock } from 'lucide-react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'

const API_URL = 'http://localhost:8000/api'

// Helper to safely parse and format dates as IST
const formatToIST = (dateStr, options = {}) => {
    if (!dateStr) return '';
    let processedStr = dateStr;
    if (typeof dateStr === 'string' && !dateStr.includes('Z') && !dateStr.includes('+')) {
        processedStr = dateStr.replace(' ', 'T') + 'Z';
    }
    return new Date(processedStr).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        ...options
    });
};

export default function Feedback() {
    const [feedback, setFeedback] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all') // all, implemented, pending, etc.

    useEffect(() => {
        fetchFeedback()
    }, [])

    const fetchFeedback = async () => {
        try {
            // Reusing the stats endpoint as it returns recent_feedback.
            // Ideally, this should be a paginated endpoint for ALL feedback.
            // Assuming for now simply displaying available data.
            const response = await axios.get(`${API_URL}/feedback/stats`)
            if (response.data.success) {
                setFeedback(response.data.recent_feedback || [])
            }
        } catch (error) {
            console.error('Failed to fetch feedback:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredFeedback = feedback.filter(item => {
        if (filterStatus === 'all') return true
        if (filterStatus === 'implemented') return item.implementation_status === 'implemented'
        if (filterStatus === 'partial') return item.implementation_status === 'partially_implemented'
        if (filterStatus === 'not_implemented') return item.implementation_status === 'not_implemented'
        return true
    })

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-pragati-bg via-[#fff5fb] to-pragati-secondary/10 font-ranade text-pragati-text">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-72 relative">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm pl-8 pr-12 h-20 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-pragati-text flex items-center gap-3">
                        <div className="p-2 bg-pragati-accent/10 rounded-xl">
                            <MessageSquare className="w-6 h-6 text-pragati-accent" />
                        </div>
                        Feedback Repository
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/50 border border-white/60 rounded-xl px-3 py-2">
                            <Filter className="w-4 h-4 text-pragati-text/50" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent text-sm font-medium focus:outline-none text-pragati-text cursor-pointer"
                            >
                                <option value="all">All Feedback</option>
                                <option value="implemented">Implemented</option>
                                <option value="partial">Partially Implemented</option>
                                <option value="not_implemented">Not Implemented</option>
                            </select>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-8 py-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pragati-primary"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFeedback.map((fb, idx) => (
                                <motion.div
                                    key={fb.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.02)] border border-white/60 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${fb.implementation_status === 'implemented' ? 'bg-green-100 text-green-700' :
                                                        fb.implementation_status === 'partially_implemented' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {fb.implementation_status.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-xs text-pragati-text/40 font-medium flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatToIST(fb.created_at, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm border border-black/5">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-bold text-pragati-text">{fb.rating}</span>
                                                </div>
                                            </div>

                                            {fb.challenge && (
                                                <div className="mb-4 p-4 bg-pragati-primary/5 rounded-xl border border-pragati-primary/10">
                                                    <p className="text-xs font-bold text-pragati-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                                                        <BarChart3 className="w-3 h-3" />
                                                        Context (Challenge/Query)
                                                    </p>
                                                    <p className="text-sm text-pragati-text/80 italic leading-relaxed">"{fb.challenge}"</p>
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="text-sm font-bold text-pragati-text/50 uppercase tracking-widest mb-1">Teacher Feedback</h3>
                                                <p className="text-lg text-pragati-text font-medium leading-relaxed">"{fb.comments}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {filteredFeedback.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-64 text-pragati-text/40">
                                    <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
                                    <h3 className="text-xl font-bold">No feedback found</h3>
                                    <p className="text-sm">Try adjusting your filters</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
