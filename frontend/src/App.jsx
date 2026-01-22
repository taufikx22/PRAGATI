import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DialectProvider } from './context/DialectContext'
import Login from './pages/Login'
import TeacherView from './pages/TeacherView'
import Dashboard from './pages/Dashboard'
import Teachers from './pages/Teachers'
import Feedback from './pages/Feedback'

export default function App() {
    return (
        <DialectProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <main>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/teacher" element={<TeacherView />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/teachers" element={<Teachers />} />
                            <Route path="/feedback" element={<Feedback />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </DialectProvider>
    )
}
