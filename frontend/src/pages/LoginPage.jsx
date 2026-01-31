import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "../api"; // Fixed import path

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, user } = response.data.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Navigate based on role or to dashboard
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            {/* Left Side - Hero/Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 relative overflow-hidden">
                {/* Abstract background blobs */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/40 via-background to-background opacity-50" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 to-transparent blur-3xl" />

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
                        <UtensilsCrossed className="h-6 w-6 text-primary" />
                        ZAPfest
                    </Link>
                </div>

                <div className="relative z-10 space-y-6 max-w-lg">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl leading-tight">
                        Order food from your favorite restaurants.
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Experience the fastest delivery and easiest management platform for food lovers and restaurant owners.
                    </p>
                </div>

                <div className="relative z-10 text-zinc-500 text-sm">
                    &copy; 2026 ZAPfest Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left mb-8">
                        <div className="flex justify-center lg:justify-start mb-4 lg:hidden">
                            <UtensilsCrossed className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-muted-foreground mt-2">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <Card className="border-border/60 shadow-xl shadow-primary/5">
                        <form onSubmit={handleLogin}>
                            <CardContent className="space-y-4 pt-6">
                                {error && (
                                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md animate-in fade-in">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11 bg-muted/30 focus:bg-background transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link to="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 bg-muted/30 focus:bg-background transition-colors"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 pb-6">
                                <Button
                                    className="w-full h-11 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                                    ) : (
                                        <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>

                                <div className="relative w-full">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-muted" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <Button variant="outline" type="button" disabled>GitHub</Button>
                                    <Button variant="outline" type="button" disabled>Google</Button>
                                </div>

                                <div className="text-center text-sm text-muted-foreground">
                                    Don&apos;t have an account?{" "}
                                    <Link to="/register" className="text-primary hover:underline font-medium">
                                        Create an account
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
