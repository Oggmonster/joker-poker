import { useEffect, useState } from 'react'
import { useSocket } from '#app/utils/useSocket'

export function LoginNotifications() {
    const [notifications, setNotifications] = useState<Array<{ id: string; username: string; timestamp: number }>>([])
    const { on, off, isConnected } = useSocket()

    // Log socket connection status
    useEffect(() => {
        console.log('LoginNotifications - Socket connected:', isConnected)
    }, [isConnected])

    useEffect(() => {
        const handleLogin = (data: { username: string }) => {
            console.log('Login event received:', data)
            const newNotification = {
                id: Math.random().toString(36).substring(7),
                username: data.username,
                timestamp: Date.now()
            }
            setNotifications(prev => [...prev, newNotification])

            // Remove notification after 5 seconds
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== newNotification.id))
            }, 5000)
        }

        console.log('Setting up login event listener')
        on('user:login', handleLogin)

        // Cleanup function to remove event listener
        return () => {
            console.log('Cleaning up login event listener')
            off('user:login', handleLogin)
        }
    }, [on, off])

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" data-socket-component>
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className="animate-slide-left rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg"
                >
                    {notification.username} logged in
                </div>
            ))}
        </div>
    )
} 