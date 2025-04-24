import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (!socket) {
            // Initialize socket connection
            const socketUrl = process.env.NODE_ENV === 'production'
                ? window.location.origin
                : 'http://localhost:3000'

            socket = io(socketUrl, {
                withCredentials: true,
            })

            // Connection event handlers
            socket.on('connect', () => {
                console.log('Connected to server')
                setIsConnected(true)
            })

            socket.on('disconnect', () => {
                console.log('Disconnected from server')
                setIsConnected(false)
            })

            socket.on('connect_error', (error) => {
                console.error('Connection error:', error)
                setIsConnected(false)
            })
        }

        return () => {
            // Only disconnect when the last component unmounts
            if (socket && document.querySelectorAll('[data-socket-component]').length === 1) {
                socket.disconnect()
                socket = null
            }
        }
    }, [])

    const emit = (eventName: string, data: any) => {
        if (socket) {
            console.log('Emitting event:', eventName, data)
            socket.emit(eventName, data)
        }
    }

    const on = (eventName: string, callback: (...args: any[]) => void) => {
        if (socket) {
            console.log('Adding listener for:', eventName)
            socket.on(eventName, callback)
        }
    }

    const off = (eventName: string, callback: (...args: any[]) => void) => {
        if (socket) {
            console.log('Removing listener for:', eventName)
            socket.off(eventName, callback)
        }
    }

    return {
        socket,
        isConnected,
        emit,
        on,
        off,
    }
} 