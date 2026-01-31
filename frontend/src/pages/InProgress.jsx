import { Button } from "@/components/ui/button"
import { Construction, ArrowLeft, Rocket } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function InProgress() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Rocket className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Coming Soon</h1>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
                We are building something awesome here! This feature is currently under development and will be available shortly.
            </p>
            <Button onClick={() => navigate('/')} size="lg" className="gap-2 shadow-md">
                <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
        </div>
    )
}
