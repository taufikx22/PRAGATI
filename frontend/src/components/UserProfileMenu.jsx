
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import LogoIcon from '../assets/pragati-logo-icon.png';

export default function UserProfileMenu({ isOpen, onClose, onDialectClick }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-16 right-0 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden font-ranade"
                style={{ transformOrigin: 'top right' }}
            >
                <div className="flex items-center justify-between p-5 pb-2">
                    <h2 className="text-xl font-bold text-pragati-text">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-6">
                    <div className="flex items-center gap-4 p-2">
                        <div className="w-12 h-12 bg-[#D1E6C8] rounded-2xl flex items-center justify-center text-pragati-text/80">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-pragati-text text-base">Demo Teacher</h3>
                            <p className="text-xs text-gray-400 font-medium">teacher@pragati.edu</p>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-pragati-text text-sm">Help & Support</h4>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>

                        <div className="h-px bg-gray-100 w-full" />

                        <button className="w-full flex items-center gap-4 group">
                            <div className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-red-500 text-sm">Sign Out</h4>
                            </div>
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
