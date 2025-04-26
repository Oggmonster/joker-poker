import { Server } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { Socket } from 'socket.io'

let io: Server | null = null

export function initializeSocketIO(httpServer: HTTPServer) {
    if (io) return io

    io = new Server(httpServer, {
        cors: {
            origin: process.env.NODE_ENV === 'production' 
                ? false 
                : true,
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id)

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id)
        })

        socket.on('hello', (data: { message: string }) => {
            console.log('Received hello:', data)
            socket.broadcast.emit('welcome', { message: data.message })
        })
    })

    return io
}

export function getIO(): Server {
    if (!io) {
        throw new Error('Socket.IO has not been initialized. Please call initializeSocketIO first.')
    }
    return io
} 