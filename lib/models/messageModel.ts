import mongoose, { Document, Schema } from "mongoose"

interface MessageTypes extends Document{
    room: string
    sender: string
    message: string
    image: string
}

const messageSchema = new Schema<MessageTypes>({
    room: {
        type: String,
        required: true
    },
    sender: {
           type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    image: {
        type: String,
    }
}, {timestamps: true})

const Message = mongoose.models.Message || mongoose.model<MessageTypes>("Message", messageSchema)
export { Message }
export default Message