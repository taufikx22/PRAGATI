import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Log requests so we can see what's happening
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error) => Promise.reject(error)
)

// Handle errors globally
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

export const generateModule = async (payload) => {
    return await api.post('/api/generate', payload)
}

export const translateContent = async (payload) => {
    return await api.post('/api/translate', payload)
}

export const submitFeedback = async (payload) => {
    return await api.post('/api/feedback', payload)
}

export const ingestDocument = async (file, title) => {
    const formData = new FormData()
    formData.append('file', file)
    if (title) formData.append('title', title)

    return await api.post('/api/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

export const getSupportedLanguages = async () => {
    return await api.get('/api/languages')
}

// Conversation stuff
export const getConversations = async () => {
    return await api.get('/api/conversations')
}

export const createConversation = async (title) => {
    return await api.post('/api/conversations', null, {
        params: { title }
    })
}

export const getConversationMessages = async (conversationId) => {
    return await api.get(`/api/conversations/${conversationId}/messages`)
}

export default api
