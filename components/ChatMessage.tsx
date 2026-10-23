import Image from "next/image"

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
            <div className="flex justify-center my-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <p className="text-xs font-medium">{message}</p>
                </div>
            </div>
        )
    }

   
    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
            <div className={`flex gap-2 max-w-[80%] ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
                
                
                <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0 mt-1 bg-gray-200">
                    <Image
                        src={image}
                        fill
                        unoptimized={true}
                        alt={sender}
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col">
                    <p className={`text-[11px] text-gray-400 mb-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
                        {isOwnMessage ? "You" : sender}
                    </p>
                    <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isOwnMessage
                                ? "bg-blue-600 text-white rounded-tr-sm"
                                : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm"
                        }`}
                    >
                        {message}
                    </div>
                </div>
            </div>
        </div>
    )
}