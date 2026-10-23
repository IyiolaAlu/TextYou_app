"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { signUp } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { CldUploadWidget } from "next-cloudinary"
import { Loader2, UserPlus, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function SignUp() {
    const router = useRouter()
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        image: ""
    })
    const [isUploading, setIsUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!form.firstName || !form.lastName || !form.email || !form.password) {
            setError("Please fill in all fields")
            setLoading(false)
            return
        }

        if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) {
            setError("Names must be at least 2 characters")
            setLoading(false)
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Please enter a valid email address")
            setLoading(false)
            return
        }

        if (form.password.length < 7) {
            setError("Password must be at least 7 characters")
            setLoading(false)
            return
        }

        try {
            const data = await signUp.email({
                name: `${form.firstName.trim()} ${form.lastName.trim()}`,
                email: form.email,
                password: form.password,
                image: form.image
            })

            if (data.error) {
                switch (data.error.status) {
                    case 422:
                        setError("This email is already registered. Try signing in")
                        break
                    case 400:
                        setError(data.error.message ?? "Invalid details. Please check your input")
                        break
                    case 429:
                        setError("Too many attempts. Please try again later")
                        break
                    default:
                        setError(data.error.message ?? "Failed to create account")
                }
            } else if (data.data && "message" in data.data && typeof data.data.message === "string") {
                setError(data.data.message)
            } else {
                router.push("/room")
            }
        } catch (error) {
            setError("Network error. Please check your connection")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-[#F5F5F5] p-5 py-10">
            <Card className="w-full max-w-md shadow-xl border-gray-200">
                <CardHeader className="space-y-1 pb-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Join TextYou and start chatting
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Image Uploader */}
                        <div className="space-y-2 flex flex-col items-center mb-2">
                            <Label className="self-start">Profile Image</Label>
                            <CldUploadWidget
                                uploadPreset="ecommerce_uploads"
                                onSuccess={(result) => {
                                    const url = (result.info as { secure_url: string }).secure_url
                                    if (url) {
                                        setForm({ ...form, image: url })
                                        setIsUploading(false)
                                    }
                                }}
                                onQueuesStart={() => setIsUploading(true)}
                                onQueuesEnd={() => setIsUploading(false)}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className={`relative w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center transition-colors overflow-hidden ${
                                            form.image ? "border-blue-500 p-0" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-500"
                                        }`}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                        ) : form.image ? (
                                            <Image 
                                                src={form.image} 
                                                alt="Profile" 
                                                fill 
                                                unoptimized={true} 
                                                className="object-cover" 
                                            />
                                        ) : (
                                            <ImageIcon className="h-6 w-6" />
                                        )}
                                    </button>
                                )}
                            </CldUploadWidget>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    value={form.firstName}
                                    onChange={(e) => {
                                        setForm({ ...form, firstName: e.target.value })
                                        setError("")
                                    }}
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    className="h-11"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    value={form.lastName}
                                    onChange={(e) => {
                                        setForm({ ...form, lastName: e.target.value })
                                        setError("")
                                    }}
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    className="h-11"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                value={form.email}
                                onChange={(e) => {
                                    setForm({ ...form, email: e.target.value })
                                    setError("")
                                }}
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                value={form.password}
                                onChange={(e) => {
                                    setForm({ ...form, password: e.target.value })
                                    setError("")
                                }}
                                minLength={7}
                                id="password"
                                type="password"
                                placeholder="At least 7 characters"
                                className="h-11"
                                required
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            </div>
                        )}

                        <Button size="lg" type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base mt-2" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center border-t pt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}