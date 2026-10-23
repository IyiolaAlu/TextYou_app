import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Shield, Zap, Users } from "lucide-react"

export default function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100dvh-4rem)] bg-[#F5F5F5]">
            
         
            <main className="flex-1 flex flex-col items-center justify-center p-5 text-center">
                
         
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-blue-600 bg-blue-100/50 rounded-full border border-blue-200">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Real-time messaging built for speed
                </div>

             
                <h1 className="max-w-3xl text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                    Connect with anyone, <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                        anywhere in the world.
                    </span>
                </h1>

         
                <p className="max-w-xl text-lg text-gray-500 mb-10">
                    A blazing fast, secure, and beautifully designed chat application. 
                    Join a room and start talking instantly.
                </p>

          
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link href="/room">
                        <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-blue-600 hover:bg-blue-700">
                            Start Chatting <MessageSquare className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 bg-white">
                            Create an Account
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full mt-20 text-left">
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                            <Zap className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Instant Delivery</h3>
                        <p className="text-sm text-gray-500">Powered by WebSockets for zero-lag messaging.</p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Secure by Default</h3>
                        <p className="text-sm text-gray-500">Your data is safe with Better Auth and encrypted sessions.</p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                            <Users className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Public Rooms</h3>
                        <p className="text-sm text-gray-500">Create or join any room instantly with a unique name.</p>
                    </div>
                </div>

            </main>

            <footer className="py-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} TextYou. Built with Next.js & Socket.IO.
            </footer>
        </div>
    )
}