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
        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data])
        })

        socket.on("user_joined", (message) => {
            setMessages((prev) => [...prev, { sender: "System", message, image: "" }])
        })

        socket.on("chat-history", (messages) => {
            setMessages(messages)
        })

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
    if (isPending) return <p>Loading...</p>
    return (
        <>

            <div className="container min-h-dvh max-w-7xl mx-auto p-5 flex flex-col justify-center items-center">

                {
                    !joined ? (
                        <Card className="w-full max-w-sm">
                            <CardHeader>
                                <CardTitle>Enter Room</CardTitle>

                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleJoinRoom} className="space-y-4">
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="room">Room</Label>
                                            </div>
                                            <Input
                                                value={room}
                                                onChange={(e) => setRoom(e.target.value)}
                                                placeholder="Enter room name"
                                                id="room"
                                                type="text"
                                                required />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Join Room
                                    </Button>
                                </form>
                            </CardContent>

                        </Card>
                    ) : (
                        <div className="w-full max-w-3xl mx-auto">
                            <div className="flex justify-between">
                                <h1 className="mb-4 text-2xl font-bold">Room: {room}</h1>
                                <Button
                                onClick={handleSignOut}
                                >Logout</Button>
                            </div>
                            <div className="h-125 overflow-y-auto p-4 mb-4 bg-gray-200 rounded-lg">
                                {
                                    messages.map((message, index) => (
                                        <ChatMessage
                                            key={index}
                                            image={message.image}
                                            sender={message.sender}
                                            message={message.message}
                                            isOwnMessage={message.sender === userName}
                                        />
                                    ))
                                }
                            </div>
                            <ChatForm onSendMessage={handleSendMessage} />
                        </div>

                    )
                }
            </div>
        </>
    )
}