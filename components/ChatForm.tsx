"use client"
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";


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
        <form onSubmit={handleSubmit}>
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="Send a message"
                id="message"
            />
            <Button type="submit">Send</Button>
        </form>
    )
}