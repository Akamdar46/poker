import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import HistoryPage from './pages/HistoryPage'
import TutorialPage from './pages/TutorialPage'
import AuthPage from './pages/AuthPage'
import { AuthProvider } from './contexts/AuthContext'
import { PokerProvider } from './contexts/PokerContext'
import { SocketProvider } from './contexts/SocketContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <PokerProvider>
            <div className="min-h-screen bg-gray-950">
              <Navbar />
              <main className="pt-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/analysis" element={<AnalysisPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/tutorial" element={<TutorialPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                  </Routes>
                </motion.div>
              </main>
            </div>
          </PokerProvider>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App