import React from 'react'

const PokerTable: React.FC = () => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Poker Table</h3>
      <div className="poker-table w-full h-64 flex items-center justify-center">
        <p className="text-white">Poker table visualization</p>
      </div>
    </div>
  )
}

export default PokerTable