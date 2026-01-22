import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, HelpCircle, Globe, Settings, ChevronRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SettingsMenu({ onClose, onDialectClick }) {
    const navigate = useNavigate()
    const [nativeDialectEnabled, setNativeDialectEnabled] = useState(false)

    // Mock user data
    const user = {
        name: "Demo Teacher",
        email: "teacher@pragati.edu",
        role: "Teacher"
    }

    const handleSignOut = () => {
        // Implement sign out logic here (clear tokens, etc.)
        navigate('/')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-20 left-6 w-80 bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/40 overflow-hidden z-20 font-ranade text-pragati-text"
        >
            {/* Header */}
            <div className="p-6 border-b border-pragati-text/5 flex items-center justify-between">
                <h3 className="font-bold text-pragati-text text-lg">Settings</h3>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-pragati-secondary/20 text-pragati-text/40 hover:text-pragati-text rounded-full transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-1">
                {/* User Profile */}
                <div className="p-4 flex items-center gap-4 rounded-3xl hover:bg-white transition-all shadow-none hover:shadow-sm">
                    <div className="w-12 h-12 bg-pragati-secondary text-pragati-text rounded-2xl flex items-center justify-center shadow-sm">
                        <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-pragati-text truncate">{user.name}</p>
                        <p className="text-xs text-pragati-text/50 truncate font-medium">{user.email}</p>
                    </div>
                </div>

                <div className="h-px bg-pragati-text/5 my-2 mx-4" />

                {/* Native Dialect */}
                <button
                    onClick={() => {
                        onDialectClick();
                        onClose();
                    }}
                    className="w-full p-4 flex items-center justify-between rounded-[1.5rem] hover:bg-white transition-all group text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-pragati-secondary/20 rounded-[0.8rem] flex items-center justify-center text-pragati-primary">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-pragati-text">Native Dialect</p>
                            <p className="text-[10px] text-pragati-text/40 font-bold uppercase tracking-widest mt-0.5">Local language support</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-pragati-text/20 group-hover:text-pragati-text/50 transform group-hover:translate-x-1 transition-all" />
                </button>

                {/* Help & Support */}
                <button className="w-full p-4 flex items-center justify-between rounded-[1.5rem] hover:bg-white transition-all group text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-pragati-accent/20 rounded-[0.8rem] flex items-center justify-center text-pragati-accent">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-pragati-text/80">Help & Support</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-pragati-text/20 group-hover:text-pragati-text/50 transform group-hover:translate-x-1 transition-all" />
                </button>

                <div className="h-px bg-pragati-text/5 my-2 mx-4" />

                {/* Sign Out */}
                <button
                    onClick={handleSignOut}
                    className="w-full p-4 flex items-center gap-4 rounded-3xl hover:bg-red-50 text-red-600 transition-all group"
                >
                    <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-90">
                        <LogOut className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold">Sign Out</span>
                </button>
            </div>
        </motion.div>
    )
}
