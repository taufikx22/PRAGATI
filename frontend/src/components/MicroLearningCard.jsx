import { motion } from 'framer-motion'
import { Clock, Target, MessageSquare, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'

export default function MicroLearningCard({ module, onFeedbackClick, isInChat = false }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        const sectionsText = module.sections.map((s, i) =>
            `Section ${i + 1}: ${s.title}\nDuration: ${s.duration_minutes} min\n\nContent:\n${s.content}\n\nActivity:\n${s.activity || 'N/A'}`
        ).join('\n\n---\n\n')

        const fullText = `PRAGATI Micro-Learning Module: ${module.title}\nTotal Duration: ${module.total_duration} min\nChallenge: ${module.challenge}\n\n${sectionsText}`

        navigator.clipboard.writeText(fullText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl overflow-hidden font-ranade text-pragati-text ${isInChat ? 'p-6' : 'p-8'}`}>
            {/* Module Header */}
            <div className="border-b border-pragati-text/5 pb-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-2xl font-bold text-pragati-text">
                                {module.title}
                            </h2>
                            <span className="inline-flex items-center px-3 py-1 bg-pragati-secondary/30 text-pragati-primary text-xs font-bold rounded-full shadow-sm">
                                <Clock className="w-3 h-3 mr-1.5" />
                                {module.total_duration} min
                            </span>
                        </div>
                        <p className="text-pragati-text/60 text-sm italic">
                            <span className="text-pragati-primary font-bold">Challenge:</span> {module.challenge}
                        </p>
                    </div>
                </div>
            </div>

            {/* Module Sections */}
            <div className="space-y-4">
                {module.sections.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-pragati-secondary/20 to-white/50 rounded-2xl p-6 border border-pragati-secondary/30 hover:border-pragati-primary/30 transition-all group shadow-sm hover:shadow-md"
                    >
                        {/* Section Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="bg-pragati-primary text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-pragati-primary/20">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-pragati-text">
                                        {section.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] uppercase tracking-widest text-pragati-primary font-bold">
                                            Duration: {section.duration_minutes} min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Content */}
                        <div className="prose prose-sm max-w-none mb-4 prose-p:my-1 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-pragati-primary prose-strong:font-bold [&_li>p]:my-0">
                            <div className="text-gray-700 text-sm leading-relaxed">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Activity */}
                        {section.activity && (
                            <div className="mt-4 p-5 bg-pragati-accent/10 border border-pragati-accent/20 rounded-2xl shadow-inner shadow-pragati-accent/5">
                                <div className="flex items-start space-x-3">
                                    <Target className="w-5 h-5 text-pragati-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-pragati-accent font-black uppercase tracking-widest mb-2">
                                            Activity
                                        </p>
                                        <div className="text-sm text-pragati-text/80 leading-relaxed prose-sm prose-pragati prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-pragati-accent prose-strong:font-bold [&_li>p]:my-0">
                                            <ReactMarkdown>{section.activity}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-pragati-text/5 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onFeedbackClick}
                    className="flex-1 bg-white hover:bg-pragati-secondary/10 text-pragati-primary font-bold py-4 px-6 rounded-2xl border border-pragati-secondary/40 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 group"
                >
                    <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="font-ranade">Share Implementation Feedback</span>
                </button>
                <button
                    onClick={handleCopy}
                    className={`flex-1 font-bold py-4 px-6 rounded-2xl border transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 group ${copied
                        ? 'bg-pragati-secondary/20 border-pragati-secondary text-pragati-primary shadow-inner'
                        : 'bg-pragati-primary hover:bg-pragati-primary/90 text-white border-transparent shadow-lg shadow-pragati-primary/20'
                        }`}
                >
                    {copied ? (
                        <>
                            <Check className="w-5 h-5" />
                            <span className="font-ranade">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span className="font-ranade">Copy Module</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
