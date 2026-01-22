import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, GraduationCap, MapPin, MoreVertical, Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar'

export default function Teachers() {
    // Mock Data for Teachers
    const [teachers] = useState([
        { id: 1, name: "Ramesh Gupta", cluster: "Cluster A", status: "Active", lastActive: "2 mins ago", subject: "Mathematics" },
        { id: 2, name: "Priya Sharma", cluster: "Cluster B", status: "Active", lastActive: "15 mins ago", subject: "Science" },
        { id: 3, name: "Anita Desai", cluster: "Cluster A", status: "Offline", lastActive: "2 days ago", subject: "English" },
        { id: 4, name: "Suresh Kumar", cluster: "Cluster C", status: "Active", lastActive: "1 hour ago", subject: "Social Studies" },
        { id: 5, name: "Meera Patel", cluster: "Cluster B", status: "Away", lastActive: "5 hours ago", subject: "Mathematics" },
        { id: 6, name: "Vikram Singh", cluster: "Cluster A", status: "Active", lastActive: "Just now", subject: "Science" },
        { id: 7, name: "Neha Verma", cluster: "Cluster C", status: "Offline", lastActive: "1 day ago", subject: "Hindi" },
        { id: 8, name: "Rahul Khanna", cluster: "Cluster B", status: "Active", lastActive: "10 mins ago", subject: "English" },
        { id: 9, name: "Sonia Reddy", cluster: "Cluster A", status: "Active", lastActive: "45 mins ago", subject: "Mathematics" },
        { id: 10, name: "Amit Shah", cluster: "Cluster C", status: "Away", lastActive: "3 hours ago", subject: "Social Studies" },
        { id: 11, name: "Kavita Singh", cluster: "Cluster B", status: "Offline", lastActive: "1 week ago", subject: "Science" },
        { id: 12, name: "Arjun Das", cluster: "Cluster A", status: "Active", lastActive: "5 mins ago", subject: "Hindi" },
    ])

    const [searchTerm, setSearchTerm] = useState('')

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                        <div className="p-2 bg-pragati-primary/10 rounded-xl">
                            <GraduationCap className="w-6 h-6 text-pragati-primary" />
                        </div>
                        Teachers Directory
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pragati-text/40" />
                            <input
                                type="text"
                                placeholder="Search teachers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/50 border border-white/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pragati-primary/20 w-64 transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-pragati-primary text-white rounded-xl shadow-lg shadow-pragati-primary/20 hover:scale-105 transition-transform font-medium text-sm">
                            <Plus className="w-4 h-4" /> Add Teacher
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTeachers.map((teacher) => (
                            <motion.div
                                key={teacher.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/60 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <button className="text-pragati-text/30 hover:text-pragati-primary transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pragati-secondary to-pragati-primary/40 flex items-center justify-center text-pragati-text font-bold text-lg shadow-inner">
                                        {teacher.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-pragati-text">{teacher.name}</h3>
                                        <p className="text-xs text-pragati-text/60 font-medium flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {teacher.cluster}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-pragati-text/50">Subject</span>
                                        <span className="font-medium text-pragati-text">{teacher.subject}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-pragati-text/50">Status</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${teacher.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                teacher.status === 'Away' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-500'
                                            }`}>
                                            {teacher.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-pragati-text/50">Last Active</span>
                                        <span className="font-medium text-pragati-text">{teacher.lastActive}</span>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-pragati-text/5 grid grid-cols-2 gap-3">
                                    <button className="py-2 text-xs font-bold text-pragati-primary bg-pragati-primary/10 rounded-lg hover:bg-pragati-primary/20 transition-colors">
                                        View Profile
                                    </button>
                                    <button className="py-2 text-xs font-bold text-pragati-text/70 bg-white border border-pragati-text/10 rounded-lg hover:bg-gray-50 transition-colors">
                                        Message
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
