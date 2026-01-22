import { motion } from 'framer-motion'
import { User, Bot } from 'lucide-react'
import MicroLearningCard from './MicroLearningCard'

export default function ChatMessage({ message, onFeedbackClick }) {
    const isMe = message.role === 'user'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
        >
            {!isMe && (
                <div className="w-10 h-10 rounded-xl bg-pragati-secondary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-6 h-6 text-pragati-primary" />
                </div>
            )}

            <div className={`flex-1 max-w-3xl ${isMe ? 'flex justify-end' : ''}`}>
                {isMe ? (
                    <div className="bg-pragati-primary text-white px-5 py-3.5 rounded-3xl rounded-tr-sm max-w-lg shadow-lg shadow-pragati-primary/10">
                        <p className="text-sm font-ranade leading-relaxed">{message.content}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {message.content && message.content !== 'Module generated' && (
                            <div className="bg-white/60 backdrop-blur-md px-5 py-3.5 rounded-3xl rounded-tl-sm border border-white/40 shadow-sm max-w-lg">
                                <p className="text-sm text-pragati-text font-ranade leading-relaxed">{message.content}</p>
                            </div>
                        )}

                        {message.module_data && (
                            <MicroLearningCard
                                module={message.module_data}
                                onFeedbackClick={onFeedbackClick}
                                isInChat={true}
                            />
                        )}
                    </div>
                )}
            </div>

            {isMe && (
                <div className="w-10 h-10 rounded-xl bg-pragati-accent/20 flex items-center justify-center flex-shrink-0 shadow-sm border border-pragati-accent/10">
                    <User className="w-6 h-6 text-pragati-accent" />
                </div>
            )}
        </motion.div>
    )
}
