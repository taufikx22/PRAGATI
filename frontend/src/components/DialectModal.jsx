
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useDialect } from '../context/DialectContext';

export default function DialectModal({ isOpen, onClose }) {
    const { availableDialects, selectedDialect, setSelectedDialect } = useDialect();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-pragati-primary/10"
                >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-pragati-text font-ranade">Select Native Dialect</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <p className="text-sm text-gray-500 mb-4">
                            Choose a dialect to contextualize the platform content. <span className="text-red-400 text-xs block mt-1">(Translation temporarily disabled for refinement)</span>
                        </p>

                        <div className="grid gap-2">
                            {availableDialects.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        // Feature temporarily disabled
                                    }}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left group
                                        opacity-50 cursor-not-allowed border-gray-200 bg-gray-50`}
                                >
                                    <span className={`font-medium ${selectedDialect === lang.code ? 'text-pragati-primary' : 'text-gray-700'}`}>
                                        {lang.name}
                                    </span>
                                    {selectedDialect === lang.code && (
                                        <Check className="w-4 h-4 text-pragati-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-right">
                        <button
                            onClick={onClose}
                            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
