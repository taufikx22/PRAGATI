import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    GraduationCap,
    MessageSquare,
    Settings,
    User,
    Languages,
    HelpCircle,
    LogOut,
    ChevronRight,
    School
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoIcon from '../assets/pragati-logo-icon.png'
import DialectModal from './DialectModal'
import { useDialect } from '../context/DialectContext'

const SidebarItem = ({ icon: Icon, label, path, isActive, onClick, hasSubmenu = false, isOpen = false }) => (
    <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${isActive && !hasSubmenu
            ? 'bg-pragati-primary/10 text-pragati-primary font-bold shadow-sm border border-pragati-primary/20'
            : 'text-pragati-text/70 hover:bg-white hover:text-pragati-text hover:shadow-sm'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${isActive && !hasSubmenu ? 'text-pragati-primary' : 'text-pragati-text/50 group-hover:text-pragati-primary'}`} />
            <span className="text-sm font-ranade">{label}</span>
        </div>
        {hasSubmenu && (
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
        )}
    </motion.button>
)

const SubMenuItem = ({ label, icon: Icon, onClick, subtext }) => (
    <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        onClick={onClick}
        className="w-full flex items-center justify-between gap-3 p-2 pl-4 rounded-lg text-sm text-pragati-text/60 hover:text-pragati-primary hover:bg-pragati-primary/5 transition-colors font-ranade group"
    >
        <div className="flex items-center gap-3">
            {Icon && <Icon className="w-4 h-4" />}
            <span className="truncate">{label}</span>
        </div>
        {subtext && (
            <span className="text-[10px] bg-pragati-secondary/20 text-pragati-primary px-1.5 py-0.5 rounded uppercase font-bold group-hover:bg-pragati-primary/10">
                {subtext}
            </span>
        )}
    </motion.button>
)

export default function Sidebar({ className }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isTeachersOpen, setIsTeachersOpen] = useState(false)
    const [isDialectModalOpen, setIsDialectModalOpen] = useState(false)
    const { selectedDialect, availableDialects } = useDialect()

    const currentDialectName = availableDialects.find(d => d.code === selectedDialect)?.name || "English"

    const teachersList = [
        { name: "Ramesh Gupta", cluster: "Cluster A", id: 1 },
        { name: "Priya Sharma", cluster: "Cluster B", id: 2 },
        { name: "Anita Desai", cluster: "Cluster A", id: 3 },
        { name: "Suresh Kumar", cluster: "Cluster C", id: 4 },
        { name: "Meera Patel", cluster: "Cluster B", id: 5 },
        { name: "Vikram Singh", cluster: "Cluster A", id: 6 },
    ]

    return (
        <aside className={`h-screen bg-white/60 backdrop-blur-xl border-r border-white/40 shadow-xl flex flex-col p-6 w-72 transition-all duration-300 ${className}`}>
            {/* Logo Area */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <img src={LogoIcon} alt="PRAGATI" className="w-10 h-10 object-contain drop-shadow-md" />
                <div>
                    <h1 className="text-xl font-bold text-pragati-text font-ranade tracking-tight">PRAGATI</h1>
                    <p className="text-xs text-pragati-text/50 font-medium tracking-wider">DIET PORTAL</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                <SidebarItem
                    icon={LayoutDashboard}
                    label="DIET Overview"
                    path="/dashboard"
                    isActive={location.pathname === '/dashboard'}
                    onClick={() => navigate('/dashboard')}
                />

                {/* Teachers Dropdown */}
                <div>
                    <SidebarItem
                        icon={GraduationCap}
                        label="Teachers"
                        isActive={isTeachersOpen || location.pathname.includes('/teachers')}
                        hasSubmenu={true}
                        isOpen={isTeachersOpen}
                        onClick={() => setIsTeachersOpen(!isTeachersOpen)}
                    />
                    <AnimatePresence>
                        {isTeachersOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden ml-4 mt-1 border-l-2 border-pragati-text/10 pl-2 space-y-1"
                            >
                                {teachersList.map((teacher) => (
                                    <SubMenuItem
                                        key={teacher.id}
                                        label={teacher.name}
                                        subtext={teacher.cluster}
                                        onClick={() => navigate('/teachers')}
                                    />
                                ))}
                                <button
                                    onClick={() => navigate('/teachers')}
                                    className="w-full text-left text-xs text-pragati-accent hover:underline pl-4 mt-2"
                                >
                                    View All Teachers →
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <SidebarItem
                    icon={MessageSquare}
                    label="Feedback"
                    path="/feedback"
                    isActive={location.pathname === '/feedback'}
                    onClick={() => navigate('/feedback')}
                />

                {/* Settings Section */}
                <div className="pt-4 mt-4 border-t border-pragati-text/5">
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        isActive={isSettingsOpen}
                        hasSubmenu={true}
                        isOpen={isSettingsOpen}
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    />

                    <AnimatePresence>
                        {isSettingsOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden ml-4 mt-1 border-l-2 border-pragati-text/10 pl-2 space-y-1"
                            >
                                <SubMenuItem icon={User} label="Profile" onClick={() => console.log('Profile')} />
                                <SubMenuItem
                                    icon={Languages}
                                    label="Native Dialect"
                                    subtext={currentDialectName}
                                    onClick={() => setIsDialectModalOpen(true)}
                                />
                                <SubMenuItem icon={HelpCircle} label="Help & Support" onClick={() => console.log('Help')} />
                                <SubMenuItem icon={LogOut} label="Sign Out" onClick={() => navigate('/')} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* Footer / User Info */}
            <div className="mt-auto pt-6 border-t border-pragati-text/5">
                <div className="bg-white/50 p-3 rounded-xl border border-white/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pragati-accent to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
                        DK
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-pragati-text truncate">Dr. Kumar</p>
                        <p className="text-xs text-pragati-text/60 truncate">DIET Admin</p>
                    </div>
                </div>
            </div>

            <DialectModal
                isOpen={isDialectModalOpen}
                onClose={() => setIsDialectModalOpen(false)}
            />
        </aside>
    )
}
