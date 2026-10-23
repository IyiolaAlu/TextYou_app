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
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn, useSession } from "@/lib/auth/auth-client"
import { Loader2, LogIn } from "lucide-react"

export default function Login() {
    const router = useRouter()
    const { data: session } = useSession()
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (session) {
            router.push("/room")
        }
    }, [session, router])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!form.email || !form.password) {
            setError("Please fill in all fields")
            setLoading(false)
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Please enter a valid email address")
            setLoading(false)
            return
        }

        try {
            const data = await signIn.email({
                email: form.email,
                password: form.password,
            })

            if (data.error) {
                switch (data.error.status) {
                    case 401:
                        setError("Incorrect email or password")
                        break
                    case 403:
                        setError("Please verify your email before signing in")
                        break
                    case 429:
                        setError("Too many attempts. Please try again later")
                        break
                    default:
                        setError(data.error.message ?? "Failed to sign in")
                }
            } else if (data.data && "message" in data.data && typeof data.data.message === "string") {
                setError(data.data.message)
            }
        } catch (error) {
            setError("Network error. Please check your connection")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-[#F5F5F5] p-5">
            <Card className="w-full max-w-md shadow-xl border-gray-200">
                <CardHeader className="space-y-1 pb-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Sign in to your TextYou account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                value={form.password}
                                onChange={(e) => {
                                    setForm({ ...form, password: e.target.value })
                                    setError("")
                                }}
                                minLength={7}
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className="h-11"
                                required
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            </div>
                        )}

                        <Button size="lg" type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center border-t pt-6">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="text-blue-600 font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}