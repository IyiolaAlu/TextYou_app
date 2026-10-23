import Image from "next/image"
import { Button } from "./ui/button"

interface ChatMessageProps {
    sender: string
    message: string
    image: string
    isOwnMessage: boolean
}

export default function ChatMessage({ sender, message, isOwnMessage, image }: ChatMessageProps) {

    const isSystemMessage = sender === "System"

    if (isSystemMessage) {
        return (
            <div className="flex justify-center my-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <p className="text-xs font-medium">{message}</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            
            <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-3`}>
            <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${isOwnMessage
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-white text-black border border-gray-200 rounded-bl-sm"
                    }`}
            >
                <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <Image
                        src={image}
                        fill
                        unoptimized={true}
                        alt="Profile Image"
                    />
                </div>
                <p className="text-xs font-bold mb-0.5 opacity-70">
                    {isOwnMessage ? "You" : sender}
                </p>

                </div>


                <p className="text-sm leading-relaxed">{message}</p>
            </div>
        </div>
        </div>
    )
}