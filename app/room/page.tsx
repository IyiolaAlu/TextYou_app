"use client"

import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { socket } from "@/lib/socketClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

interface MessageTypes {
    sender: string
    message: string
    image: string
}

export default function JoinRoom() {
    const router = useRouter()
    const { data: session, isPending } = useSession()
    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login")
        }
    }, [session, isPending, router])

    const userName = session?.user.name || "Anonymous"
    const image = session?.user.image || "Avartar"

    const [room, setRoom] = useState("")
    const [joined, setJoined] = useState(false)
    const [messages, setMessages] = useState<MessageTypes[]>([])

    const handleJoinRoom = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (room) {
            socket.emit("join-room", { room, username: userName })
            setJoined(true)
        }
    }

    useEffect(() => {
        socket.connect()
        socket.on("message", (data) => setMessages((prev) => [...prev, data]))
        socket.on("user_joined", (message) => setMessages((prev) => [...prev, { sender: "System", message, image: "" }]))
        socket.on("chat-history", (messages) => setMessages(messages))

        return () => {
            socket.off("user_joined")
            socket.off("message")
            socket.off("chat-history")
        }
    }, [])

    const handleSendMessage = (message: string) => {
        const data = { room, message, sender: userName, image: image }
        setMessages((prev) => [...prev, { sender: userName, message, image: image }])
        socket.emit("message", data)
    }

    const handleSignOut = async ()=>{
        socket.disconnect()
        const signout = await signOut()
        if (signout.error) {
            alert("Fail to signout")
        }else{
            router.push("/login")
        }
    }

    if (isPending) return (
        <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-[#F5F5F5]">
            <p className="text-gray-500 animate-pulse">Loading...</p>
        </div>
    )

    return (
        <div className="container min-h-[calc(100dvh-4rem)] max-w-7xl mx-auto p-5 flex flex-col justify-center items-center bg-[#F5F5F5]">
            {
                !joined ? (
                    // JOIN ROOM SCREEN
                    <Card className="w-full max-w-sm shadow-xl border-gray-200">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">Join a Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleJoinRoom} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="room" className="text-gray-600">Room Name</Label>
                                    <Input
                                        value={room}
                                        onChange={(e) => setRoom(e.target.value)}
                                        placeholder="e.g. general"
                                        id="room"
                                        type="text"
                                        required 
                                        className="h-11"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                                    Join Room
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    // CHAT SCREEN
                    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[80vh]">
                        
                        {/* Chat Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">#{room}</h1>
                                <p className="text-xs text-gray-500">Live Chat</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-500 hover:text-red-600 hover:bg-red-50">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <p>No messages yet.</p>
                                    <p className="text-sm">Say hello to start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <ChatMessage
                                        key={index}
                                        image={message.image}
                                        sender={message.sender}
                                        message={message.message}
                                        isOwnMessage={message.sender === userName}
                                    />
                                ))
                            )}
                        </div>

                        {/* Chat Form Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <ChatForm onSendMessage={handleSendMessage} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}