import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, BarChart3, ArrowRight, CheckCircle2, Menu, X, Mail, Phone, MapPin, School, BookOpen, Users, Star, Trophy, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import LoginIllustration from '../assets/login-illustration.png'
import LogoFull from '../assets/pragati-logo-full.png'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setIsMobileMenuOpen(false)
        }
    }

    // Floating glassy navbar
    return (
        <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 rounded-3xl ${isScrolled ? 'bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg py-3' : 'bg-white/50 backdrop-blur-md border border-white/20 py-5 shadow-sm'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="cursor-pointer" onClick={() => scrollToSection('home')}>
                    <img src={LogoFull} alt="PRAGATI Logo" className="h-16 w-auto transition-all duration-300" />
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-1">
                    <button onClick={() => scrollToSection('home')} className="px-6 py-3 rounded-full text-pragati-text hover:bg-pragati-primary/5 hover:text-pragati-primary font-medium transition-all duration-200 font-ranade">Home</button>
                    <button onClick={() => scrollToSection('about')} className="px-6 py-3 rounded-full text-pragati-text hover:bg-pragati-primary/5 hover:text-pragati-primary font-medium transition-all duration-200 font-ranade">About</button>
                    <button onClick={() => scrollToSection('contact')} className="px-6 py-3 rounded-full text-pragati-text hover:bg-pragati-primary/5 hover:text-pragati-primary font-medium transition-all duration-200 font-ranade">Contact</button>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-pragati-text p-2 hover:bg-black/5 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Nav */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-4 md:hidden flex flex-col space-y-2 overflow-hidden animate-in fade-in slide-in-from-top-4">
                        <button onClick={() => scrollToSection('home')} className="text-left py-3 px-4 hover:bg-pragati-bg rounded-xl text-pragati-text font-ranade font-medium transition-colors">Home</button>
                        <button onClick={() => scrollToSection('about')} className="text-left py-3 px-4 hover:bg-pragati-bg rounded-xl text-pragati-text font-ranade font-medium transition-colors">About</button>
                        <button onClick={() => scrollToSection('contact')} className="text-left py-3 px-4 hover:bg-pragati-bg rounded-xl text-pragati-text font-ranade font-medium transition-colors">Contact</button>
                    </div>
                )}
            </div>
        </nav>
    )
}

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-lg hover:bg-white transition-all group"
    >
        <div className="w-12 h-12 bg-pragati-secondary/20 rounded-xl flex items-center justify-center text-pragati-primary mb-4 group-hover:bg-pragati-primary group-hover:text-white transition-colors duration-300">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-pragati-text mb-2 font-ranade">{title}</h3>
        <p className="text-gray-500 font-ranade">{description}</p>
    </motion.div>
)

const FloatingCard = ({ icon: Icon, title, subtext, className, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
        className={`absolute bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-center gap-4 hover:scale-105 transition-transform duration-300 ${className}`}
    >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pragati-secondary/30 to-pragati-primary/10 flex items-center justify-center text-pragati-primary">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{subtext}</p>
            <h4 className="text-pragati-text font-bold text-lg leading-tight">{title}</h4>
        </div>
    </motion.div>
)

export default function Login() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-pragati-bg via-[#fff5fb] to-pragati-secondary/10 font-ranade text-pragati-text selection:bg-pragati-primary selection:text-white">
            <Navbar />

            {/* HOME SECTION */}
            <section id="home" className="min-h-screen pt-20 flex">
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 xl:p-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-xl mx-auto w-full"
                    >
                        {/* Header */}
                        <div className="mb-12">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-pragati-secondary/20 text-pragati-primary px-4 py-2 rounded-full text-sm font-semibold mb-6"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pragati-secondary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-pragati-primary"></span>
                                </span>
                                Innovation for Education Equity Hackathon 2026
                            </motion.div>
                            <h1 className="text-5xl lg:text-7xl font-bold text-pragati-text mb-4 tracking-tight font-ranade">
                                Start Your <span className="text-pragati-primary">Growth Journey</span> With <span className="bg-pragati-primary text-white px-2 rounded">PRAGATI</span>
                            </h1>
                            <p className="text-lg text-pragati-text/70 leading-relaxed font-ranade">
                                Personalized Rapid Adaptive Growth And Training Intelligence.
                                Empowering teachers and DIET officials with data-driven insights.
                            </p>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-4 mb-12">
                            <p className="text-sm font-semibold text-pragati-text/50 uppercase tracking-wider mb-4">Select your role to continue</p>

                            <motion.button
                                whileHover={{ scale: 1.01, translateY: -2 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => navigate('/teacher')}
                                className="w-full group p-5 border border-pragati-text/10 rounded-2xl hover:border-pragati-accent hover:shadow-xl hover:shadow-pragati-accent/10 transition-all duration-300 bg-white text-left flex items-center justify-between relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-pragati-secondary/10 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-14 h-14 bg-pragati-secondary/20 text-pragati-primary rounded-xl flex items-center justify-center group-hover:bg-pragati-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <GraduationCap className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-pragati-text group-hover:text-pragati-primary transition-colors font-ranade">Teacher</h3>
                                        <p className="text-pragati-text/60 text-sm group-hover:text-pragati-text/80">Generate learning modules & track progress</p>
                                    </div>
                                </div>
                                <div className="relative z-10 w-10 h-10 rounded-full border border-pragati-text/10 flex items-center justify-center group-hover:border-pragati-accent/50 group-hover:bg-white transition-all">
                                    <ArrowRight className="w-5 h-5 text-pragati-text/30 group-hover:text-pragati-accent transition-colors" />
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.01, translateY: -2 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => navigate('/dashboard')}
                                className="w-full group p-5 border border-pragati-text/10 rounded-2xl hover:border-pragati-primary hover:shadow-xl hover:shadow-pragati-primary/10 transition-all duration-300 bg-white text-left flex items-center justify-between relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-pragati-secondary/10 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-14 h-14 bg-pragati-secondary/20 text-pragati-primary rounded-xl flex items-center justify-center group-hover:bg-pragati-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <BarChart3 className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-pragati-text group-hover:text-pragati-primary transition-colors font-ranade">DIET Admin</h3>
                                        <p className="text-pragati-text/60 text-sm group-hover:text-pragati-text/80">View analytics, feedback & usage stats</p>
                                    </div>
                                </div>
                                <div className="relative z-10 w-10 h-10 rounded-full border border-pragati-text/10 flex items-center justify-center group-hover:border-pragati-primary/50 group-hover:bg-white transition-all">
                                    <ArrowRight className="w-5 h-5 text-pragati-text/30 group-hover:text-pragati-primary transition-colors" />
                                </div>
                            </motion.button>
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-6 text-sm text-pragati-text/60 font-ranade">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-pragati-primary" />
                                <span>Free for schools</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-pragati-primary" />
                                <span>AI-Powered</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Image/Visual */}
                <div className="hidden lg:block w-1/2 relative overflow-hidden bg-gradient-to-br from-[#fdfbfd] to-[#f4f7f6]">
                    {/* Background elements */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-pragati-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pragati-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
                    <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-pragati-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />

                    <div className="absolute inset-0 flex items-center justify-center p-20 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                            className="relative z-10 w-full max-w-2xl"
                        >
                            <img
                                src={LoginIllustration}
                                alt="Education Platform Illustration"
                                className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                            />

                            {/* Floating Stats Cards */}
                            <FloatingCard
                                icon={Trophy}
                                subtext="Excellence"
                                title="Top Rated Platform"
                                className="-top-12 -left-8 z-20"
                                delay={0.4}
                            />

                            <FloatingCard
                                icon={Users}
                                subtext="Capacity Building"
                                title="2k+ Active Trainers"
                                className="top-1/2 -right-12 z-20"
                                delay={0.6}
                            />

                            <FloatingCard
                                icon={TrendingUp}
                                subtext="Growth"
                                title="95% Improvement"
                                className="-bottom-8 left-12 z-20"
                                delay={0.8}
                            />

                            {/* Testimonial Snippet */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="absolute -bottom-32 right-0 left-0 mx-auto bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 max-w-sm text-center"
                            >
                                <div className="flex justify-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-pragati-accent text-pragati-accent" />
                                    ))}
                                </div>
                                <p className="text-sm text-pragati-text/80 italic font-medium">
                                    "Pragati has transformed how we track student development."
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="py-24 bg-pragati-bg relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-pragati-text mb-4 font-ranade">About PRAGATI</h2>
                        <p className="text-pragati-text/70 text-lg font-ranade">
                            PRAGATI stands for <span className="font-semibold text-pragati-primary">P</span>ersonalized <span className="font-semibold text-pragati-primary">R</span>apid <span className="font-semibold text-pragati-primary">A</span>daptive <span className="font-semibold text-pragati-primary">G</span>rowth <span className="font-semibold text-pragati-primary">A</span>nd <span className="font-semibold text-pragati-primary">T</span>raining <span className="font-semibold text-pragati-primary">I</span>ntelligence.
                            We bridge the gap between educational data and actionable insights.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <FeatureCard
                            icon={School}
                            title="For Schools"
                            description="Streamline administrative tasks and gain real-time visibility into classroom performance."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={BookOpen}
                            title="For Teachers"
                            description="AI-powered tools to generate lesson plans, quizzes, and track student progress effortlessly."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Users}
                            title="For Administrators"
                            description="Empowering SCERT & DIETs with tools for curriculum design and training management."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-pragati-primary rounded-3xl p-12 text-white text-center md:text-left overflow-hidden relative shadow-2xl">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                        <div className="grid md:grid-cols-2 gap-12 relative z-10">
                            <div>
                                <h2 className="text-3xl font-bold mb-6 font-ranade">Get in Touch</h2>
                                <p className="text-pragati-secondary mb-8 font-ranade">
                                    Have questions? We'd love to hear from you. Reach out to our team for support or partnership inquiries.
                                </p>
                                <div className="space-y-4 font-ranade">
                                    <div className="flex items-center gap-4 text-white/90">
                                        <Mail className="w-5 h-5" />
                                        <span>hello@pragati.edu</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/90">
                                        <Phone className="w-5 h-5" />
                                        <span>+91 98765 43210</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/90">
                                        <MapPin className="w-5 h-5" />
                                        <span>Bangalore, India</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col justify-center items-center text-center">
                                <School className="w-16 h-16 text-pragati-secondary mb-4" />
                                <h3 className="text-xl font-semibold mb-2 font-ranade">Visit Our HQ</h3>
                                <p className="text-pragati-secondary text-sm font-ranade">
                                    Innovation Hub, Tech Park<br />
                                    Bangalore, xyz 560001
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-pragati-bg py-8 text-center text-pragati-text/50 text-sm font-ranade">
                <p>&copy; 2026 PRAGATI. Innovation for Education Equity Hackathon. <span className="font-semibold text-pragati-primary">Team Laplace.</span></p>
            </footer>
        </div>
    )
}
