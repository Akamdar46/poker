import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'
import { usePoker } from '@/contexts/PokerContext'
import { formatCurrency, formatPercentage, getRelativeTime } from '@/lib/utils'

const HistoryPage: React.FC = () => {
  const { state } = usePoker()
  const { handHistory, playerStats } = state

  const statCards = [
    {
      icon: BarChart3,
      label: 'Hands Played',
      value: playerStats.handsPlayed.toString(),
      color: 'text-primary-400',
    },
    {
      icon: TrendingUp,
      label: 'Win Rate',
      value: formatPercentage(playerStats.winRate),
      color: 'text-success-400',
    },
    {
      icon: DollarSign,
      label: 'Total Profit',
      value: formatCurrency(playerStats.profit),
      color: playerStats.profit >= 0 ? 'text-success-400' : 'text-error-400',
    },
    {
      icon: Calendar,
      label: 'VPIP',
      value: formatPercentage(playerStats.vpip),
      color: 'text-warning-400',
    },
  ]

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
            Hand History & Statistics
          </h1>
          <p className="text-gray-400 text-lg">
            Track your performance and analyze your playing patterns over time.
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`stat-value ${stat.color}`}>
                {stat.value}
              </div>
              <div className="stat-label">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hand History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white">Recent Hands</h2>
          </div>

          {handHistory.length === 0 ? (
            <div className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No hands recorded yet
              </h3>
              <p className="text-gray-500">
                Start analyzing hands to build your history and track your progress.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {handHistory.map((hand, index) => (
                <motion.div
                  key={hand.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-1">
                        {hand.gameState.holeCards.map((card) => (
                          <div
                            key={card.id}
                            className="w-8 h-12 bg-white rounded text-xs flex items-center justify-center font-bold"
                          >
                            <span className={card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-black'}>
                              {card.rank}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <div className="text-white font-medium">
                          {hand.analysis.handType}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {hand.gameState.gameStage} • {hand.gameState.opponents} opponents
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-gray-400 text-sm">
                        {getRelativeTime(hand.timestamp)}
                      </div>
                      <div className="text-white font-medium">
                        Action: {hand.action}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Win Probability</div>
                      <div className="text-white font-medium">
                        {formatPercentage(hand.analysis.winProbability)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-400">Pot Odds</div>
                      <div className="text-white font-medium">
                        {hand.analysis.potOdds ? formatPercentage(hand.analysis.potOdds) : 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-400">Expected Value</div>
                      <div className={`font-medium ${
                        hand.analysis.expectedValue && hand.analysis.expectedValue > 0 
                          ? 'text-success-400' 
                          : 'text-error-400'
                      }`}>
                        {hand.analysis.expectedValue ? formatCurrency(hand.analysis.expectedValue) : 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-400">Result</div>
                      <div className={`font-medium ${
                        hand.result === 'win' 
                          ? 'text-success-400' 
                          : hand.result === 'loss' 
                          ? 'text-error-400' 
                          : 'text-gray-400'
                      }`}>
                        {hand.result || 'Pending'}
                        {hand.profit && ` (${formatCurrency(hand.profit)})`}
                      </div>
                    </div>
                  </div>

                  {hand.notes && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Notes:</div>
                      <div className="text-white text-sm">{hand.notes}</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default HistoryPage