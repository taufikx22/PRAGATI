import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, X, Send, Check } from 'lucide-react'
import { submitFeedback } from '../services/api'

export default function FeedbackForm({ moduleId, challenge, conversationId, onClose }) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [implStatus, setImplStatus] = useState('')
    const [comments, setComments] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (rating === 0 || !implStatus) return

        setIsSubmitting(true)
        try {
            await submitFeedback({
                module_id: moduleId,
                challenge: challenge,
                conversation_id: conversationId,
                rating,
                implementation_status: implStatus,
                comments: comments || undefined,
            })

            setIsSubmitted(true)
        } catch (error) {
            console.error('Feedback submission failed:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative overflow-hidden p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Implementation Feedback</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {isSubmitting && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                        <span className="text-sm text-indigo-600 font-medium">Sending feedback...</span>
                    </div>
                </div>
            )}

            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            How helpful was this module?
                        </label>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors duration-200 ${star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-200'
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-600 font-medium">
                                {rating > 0 ? (
                                    <span className="text-indigo-600">{rating} / 5</span>
                                ) : (
                                    <span className="text-gray-400">Select a rating</span>
                                )}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Implementation Status
                        </label>
                        <select
                            value={implStatus}
                            onChange={(e) => setImplStatus(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            required
                        >
                            <option value="">Select status...</option>
                            <option value="implemented">Successfully Implemented</option>
                            <option value="partially_implemented">Partially Implemented</option>
                            <option value="planning">Planning to Implement</option>
                            <option value="not_applicable">Not Applicable</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Additional Comments (Optional)
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Share your experience, challenges, or suggestions..."
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0 || !implStatus}
                        className="btn-primary w-full group disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                    >
                        <span>Submit Feedback</span>
                        <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-6 max-w-xs">
                        Your feedback helps us improve the learning experience for everyone.
                    </p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </motion.div>
            )}
        </motion.div>
    )
}
