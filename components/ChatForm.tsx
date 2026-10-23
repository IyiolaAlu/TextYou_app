"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Send } from "lucide-react" 

export default function ChatForm({ onSendMessage }: {
    onSendMessage: (message: string) => void
}) {
    const [message, setMessage] = useState("")
    
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (message.trim() !== "") {
            onSendMessage(message)
            setMessage("")
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-200">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="Type a message..."
                id="message"
                className="border-0 shadow-none focus-visible:ring-0 text-base"
                autoComplete="off"
            />
            <Button type="submit" size="icon" className="rounded-full shrink-0 h-10 w-10 bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 text-white" />
                <span className="sr-only">Send</span>
            </Button>
        </form>
    )
}