import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Brain,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

const TutorialPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const tutorials = [
    {
      id: 'basics',
      title: 'Poker Basics',
      icon: BookOpen,
      description: 'Learn the fundamentals of Texas Hold\'em poker',
      lessons: [
        {
          title: 'Hand Rankings',
          content: 'Understanding poker hand rankings from high card to royal flush.',
          details: [
            'Royal Flush: A, K, Q, J, 10 all of the same suit',
            'Straight Flush: Five consecutive cards of the same suit',
            'Four of a Kind: Four cards of the same rank',
            'Full House: Three of a kind plus a pair',
            'Flush: Five cards of the same suit',
            'Straight: Five consecutive cards',
            'Three of a Kind: Three cards of the same rank',
            'Two Pair: Two different pairs',
            'One Pair: Two cards of the same rank',
            'High Card: When no other hand is made'
          ]
        },
        {
          title: 'Game Flow',
          content: 'How a hand of Texas Hold\'em progresses from start to finish.',
          details: [
            'Pre-flop: Each player receives two hole cards',
            'Flop: Three community cards are dealt',
            'Turn: Fourth community card is dealt',
            'River: Fifth and final community card is dealt',
            'Showdown: Players reveal hands to determine winner'
          ]
        },
        {
          title: 'Betting Rounds',
          content: 'Understanding the different betting actions available.',
          details: [
            'Fold: Give up your hand and forfeit any chips in the pot',
            'Call: Match the current bet amount',
            'Raise: Increase the bet amount',
            'Check: Pass the action without betting (when no bet is required)',
            'All-in: Bet all remaining chips'
          ]
        }
      ]
    },
    {
      id: 'analysis',
      title: 'Hand Analysis',
      icon: Target,
      description: 'Learn how to use our analysis tools effectively',
      lessons: [
        {
          title: 'Card Selection',
          content: 'How to input your hole cards and community cards.',
          details: [
            'Click on cards to select your hole cards (exactly 2 required)',
            'Add community cards as they are revealed (0-5 cards)',
            'Cards are automatically removed from the deck for accurate calculations',
            'Use the clear button to reset your selection'
          ]
        },
        {
          title: 'Game Parameters',
          content: 'Setting up the game situation for accurate analysis.',
          details: [
            'Number of opponents: Affects win probability calculations',
            'Pot size: Used for pot odds calculations',
            'Bet to call: Amount you need to call to stay in the hand',
            'Position: Your seating position affects strategy',
            'Game stage: Pre-flop, flop, turn, or river',
            'Stack size: Your remaining chips affect decision making'
          ]
        },
        {
          title: 'Reading Results',
          content: 'Understanding the analysis output and recommendations.',
          details: [
            'Win Probability: Chance of winning against opponents',
            'Hand Strength: Current hand ranking and potential',
            'Pot Odds: Ratio of bet to pot size',
            'Expected Value: Predicted profit/loss of calling',
            'Recommendation: Suggested action based on analysis',
            'Confidence Level: How certain the recommendation is'
          ]
        }
      ]
    },
    {
      id: 'strategy',
      title: 'Strategy Concepts',
      icon: Brain,
      description: 'Advanced poker strategy and decision making',
      lessons: [
        {
          title: 'Pot Odds',
          content: 'Understanding pot odds and how to use them in decision making.',
          details: [
            'Pot odds = (Bet to call) / (Pot size + Bet to call)',
            'Compare pot odds to your win probability',
            'If win probability > pot odds, calling is profitable',
            'Example: $10 to call into $30 pot = 25% pot odds',
            'Need >25% win probability to call profitably'
          ]
        },
        {
          title: 'Position Play',
          content: 'How your position affects your strategy.',
          details: [
            'Early Position: Play tighter, fewer hands',
            'Middle Position: Moderate range of hands',
            'Late Position: Play more hands, more information',
            'Button: Best position, can play widest range',
            'Blinds: Forced bets, defend appropriately'
          ]
        },
        {
          title: 'Bankroll Management',
          content: 'Managing your poker bankroll for long-term success.',
          details: [
            'Never risk more than 5% of bankroll in one session',
            'Move down stakes if you lose 25% of bankroll',
            'Move up stakes only with 40+ buy-ins for new level',
            'Track all sessions and analyze your play',
            'Separate poker money from living expenses'
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Concepts',
      icon: TrendingUp,
      description: 'Professional-level poker concepts and techniques',
      lessons: [
        {
          title: 'GTO Strategy',
          content: 'Game Theory Optimal play and when to use it.',
          details: [
            'GTO: Mathematically perfect strategy',
            'Unexploitable but not maximally profitable',
            'Use against strong, unknown opponents',
            'Deviate to exploit weak opponents',
            'Balance your ranges to avoid exploitation'
          ]
        },
        {
          title: 'Range Analysis',
          content: 'Thinking in terms of hand ranges rather than specific hands.',
          details: [
            'Assign opponents a range of possible hands',
            'Narrow ranges based on their actions',
            'Consider position and betting patterns',
            'Use range vs range equity calculations',
            'Adjust your strategy based on opponent ranges'
          ]
        },
        {
          title: 'Meta Game',
          content: 'The psychological aspects of poker.',
          details: [
            'Table image: How opponents perceive your play',
            'Adjust strategy based on your image',
            'Observe opponent tendencies and patterns',
            'Use timing tells and betting patterns',
            'Manage tilt and emotional control'
          ]
        }
      ]
    }
  ]

  const currentTutorial = tutorials[currentStep]
  const [currentLesson, setCurrentLesson] = useState(0)

  const nextStep = () => {
    if (currentStep < tutorials.length - 1) {
      setCurrentStep(currentStep + 1)
      setCurrentLesson(0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setCurrentLesson(0)
    }
  }

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
            Poker Tutorial
          </h1>
          <p className="text-gray-400 text-lg">
            Master Texas Hold'em with our comprehensive tutorial series.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Tutorial Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Tutorials</h2>
              <div className="space-y-2">
                {tutorials.map((tutorial, index) => (
                  <button
                    key={tutorial.id}
                    onClick={() => {
                      setCurrentStep(index)
                      setCurrentLesson(0)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      currentStep === index
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <tutorial.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{tutorial.title}</div>
                        <div className="text-sm opacity-75">{tutorial.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="card"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <currentTutorial.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {currentTutorial.title}
                    </h2>
                    <p className="text-gray-400">{currentTutorial.description}</p>
                  </div>
                </div>

                {/* Lesson Navigation */}
                <div className="flex space-x-2 overflow-x-auto">
                  {currentTutorial.lessons.map((lesson, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentLesson(index)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 ${
                        currentLesson === index
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {lesson.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lesson Content */}
              <div className="p-6">
                <motion.div
                  key={currentLesson}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">
                    {currentTutorial.lessons[currentLesson].title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    {currentTutorial.lessons[currentLesson].content}
                  </p>

                  <div className="space-y-3">
                    {currentTutorial.lessons[currentLesson].details.map((detail, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-300">{detail}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Navigation */}
              <div className="p-6 border-t border-gray-800 flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  {tutorials.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-primary-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  disabled={currentStep === tutorials.length - 1}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialPage