import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  error: string | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
      auth: {
        userId: user.id,
      },
      transports: ['websocket', 'polling'],
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
      setError(null)
      console.log('Connected to server')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from server')
    })

    newSocket.on('connect_error', (err) => {
      setError(err.message)
      console.error('Connection error:', err)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [user])

  const value: SocketContextType = {
    socket,
    isConnected,
    error,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}