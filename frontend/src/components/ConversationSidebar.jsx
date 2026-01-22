import { MessageSquare, Plus, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import SettingsMenu from './SettingsMenu'
import DialectModal from './DialectModal'

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

export default function ConversationSidebar({ conversations, activeId, onSelect, onNewConversation }) {
    const [showSettings, setShowSettings] = useState(false)
    const [isDialectModalOpen, setIsDialectModalOpen] = useState(false)

    return (
        <div className="w-80 bg-[#f0f4f9] border-r border-[#e1e4e8] flex flex-col h-full relative z-20">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <button
                    onClick={onNewConversation}
                    className="w-full bg-pragati-primary hover:bg-pragati-primary/90 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-pragati-primary/20 hover:shadow-pragati-primary/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-ranade">New Conversation</span>
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No conversations yet</p>
                        <p className="text-xs mt-1">Start a new one!</p>
                    </div>
                ) : (
                    <div className="p-4 space-y-2">
                        {conversations.map((conv) => (
                            <motion.button
                                key={conv.id}
                                whileHover={{ x: 4 }}
                                onClick={() => onSelect(conv.id)}
                                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border ${activeId === conv.id
                                    ? 'bg-white shadow-md border-pragati-secondary/50 ring-1 ring-pragati-secondary/20'
                                    : 'hover:bg-white/50 border-transparent text-pragati-text/70'
                                    }`}
                            >
                                <h3 className={`font-bold text-sm line-clamp-1 font-ranade ${activeId === conv.id ? 'text-pragati-primary' : 'text-pragati-text'
                                    }`}>
                                    {conv.title}
                                </h3>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-pragati-text/30 mt-1">
                                    {formatToIST(conv.updated_at)}
                                </p>
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer / Settings */}
            <div className="p-6 border-t border-white/10">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-white/40 bg-white/20 hover:bg-white transition-all text-pragati-text/70 hover:text-pragati-primary group shadow-sm"
                >
                    <div className="w-10 h-10 bg-pragati-secondary/20 rounded-xl flex items-center justify-center text-pragati-primary group-hover:bg-pragati-primary group-hover:text-white transition-all">
                        <Settings className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm font-ranade">Settings</span>
                </button>
            </div>

            {/* Settings Menu Popup */}
            <AnimatePresence>
                {showSettings && (
                    <SettingsMenu
                        onClose={() => setShowSettings(false)}
                        onDialectClick={() => setIsDialectModalOpen(true)}
                    />
                )}
            </AnimatePresence>

            <DialectModal
                isOpen={isDialectModalOpen}
                onClose={() => setIsDialectModalOpen(false)}
            />
        </div>
    )
}
