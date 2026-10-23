
import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db"
import { Message } from "./lib/models/messageModel"  


await connectDB()


const dev = process.env.NODE_ENV !== "production"
const hostname = process.env.HOSTNAME || "localhost"
const port = parseInt(process.env.PORT || "3000", 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

interface JoinRoomTypes {
    room: string;
    username: string;
}

interface MessageTypes {
    room: string;
    message: string;
    sender: string;
    image: string;
}

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        handle(req, res)
    })
    const io = new Server(httpServer)

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        socket.on("join-room", async ({ room, username }: JoinRoomTypes) => {
            if (!username || username === "Anonymous") {
                socket.emit("error", "You must be logged in to join a room")
                return
            }
            socket.join(room)
            const messages = await Message.find({room}).sort({ createdAt: 1 }).limit(50)
            console.log(`User ${username} joined ${room}`);
            socket.emit("chat-history", messages)
            socket.to(room).emit("user_joined", `${username} joined room`)
        })

        socket.on("message", async ({ room, sender, message, image }: MessageTypes) => {
            console.log(`Message from ${sender} in room ${room}: ${message}`);
                try {
                    const newMessage = await Message.create({ room, sender, message, image })
                     socket.to(room).emit("message", newMessage)
                } catch (error) {
                    console.error("Failed to save message:", error)

                }
           
        })

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
    });

    httpServer.listen(port, () => {
        console.log(`Server running on port http://${hostname}:${port}`);

    })
})