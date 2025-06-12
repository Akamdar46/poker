import React from 'react'
import { motion } from 'framer-motion'
import CardSelector from '@/components/poker/CardSelector'
import GameControls from '@/components/poker/GameControls'
import AnalysisResults from '@/components/poker/AnalysisResults'
import PokerTable from '@/components/poker/PokerTable'
import { usePoker } from '@/contexts/PokerContext'

const AnalysisPage: React.FC = () => {
  const { state } = usePoker()

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Hand Analysis
          </h1>
          <p className="text-gray-400 text-lg">
            Analyze your Texas Hold'em hands with professional-grade tools and AI-powered insights.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <CardSelector />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GameControls />
            </motion.div>
          </div>

          {/* Middle Column - Poker Table */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <PokerTable />
            </motion.div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnalysisResults />
            </motion.div>
          </div>
        </div>

        {/* Error Display */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-error-500/20 border border-error-500/50 rounded-lg"
          >
            <p className="text-error-400">{state.error}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AnalysisPage