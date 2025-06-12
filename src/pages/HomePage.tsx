import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms provide strategic recommendations based on GTO principles and opponent modeling.',
    },
    {
      icon: Zap,
      title: 'Real-Time Calculations',
      description: 'Lightning-fast Monte Carlo simulations with 10,000+ iterations for accurate probability calculations.',
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Statistics',
      description: 'Track your performance with detailed analytics including VPIP, PFR, aggression factor, and profit tracking.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never share your playing patterns or strategies with third parties.',
    },
  ]

  const stats = [
    { label: 'Hands Analyzed', value: '1M+' },
    { label: 'Active Users', value: '10K+' },
    { label: 'Win Rate Improvement', value: '23%' },
    { label: 'Accuracy Rate', value: '99.2%' },
  ]

  const benefits = [
    'Real-time hand strength evaluation',
    'Monte Carlo probability simulations',
    'Pot odds and implied odds calculations',
    'GTO-based strategic recommendations',
    'Comprehensive hand history tracking',
    'Performance analytics and insights',
    'Mobile-responsive design',
    'Secure cloud synchronization',
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-success-500/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Master</span>{' '}
              <span className="text-white">Texas Hold'em</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional poker analysis with real-time hand evaluation, 
              Monte Carlo simulations, and AI-powered strategic recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analysis" className="btn-primary text-lg px-8 py-4">
                Start Analyzing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link to="/tutorial" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Advanced Poker Intelligence
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leverage cutting-edge technology to improve your poker game with 
              professional-grade analysis tools and strategic insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card card-hover p-6 text-center"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Everything You Need to Win
              </h2>
              
              <p className="text-xl text-gray-300 mb-8">
                Our comprehensive suite of tools gives you the edge you need 
                to make profitable decisions at the poker table.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="poker-table w-full aspect-square max-w-md mx-auto p-8">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-poker-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Improve Your Game
                    </h3>
                    <p className="text-gray-300">
                      Make data-driven decisions
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Elevate Your Game?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of players who have improved their win rate 
              with our advanced poker analysis tools.
            </p>
            
            <Link 
              to="/analysis" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Start Your Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage