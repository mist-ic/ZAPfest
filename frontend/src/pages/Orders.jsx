import { useState, useEffect } from 'react'
import { orders } from '../api'
import { useAuth } from '../store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Package, Clock, MapPin, Loader2, ListX } from "lucide-react"
import { format } from 'date-fns' // Assuming date-fns might be used, but standard JS date for now if not installed

const statusColors = {
    PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20',
    CONFIRMED: 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20',
    PREPARING: 'bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500/20',
    OUT_FOR_DELIVERY: 'bg-indigo-500/10 text-indigo-600 border-indigo-200 hover:bg-indigo-500/20',
    DELIVERED: 'bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20'
}

export default function Orders() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => { if (user) load() }, [user])

    const load = async () => {
        setLoading(true)
        try {
            const { data } = await orders.my()
            setList(data.data?.content || [])
        } catch (error) {
            console.error("Failed to load orders", error)
        }
        setLoading(false)
    }

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <h2 className="text-2xl font-bold">Please log in to view orders</h2>
            <Button onClick={() => window.location.href = '/login'}>Sign In</Button>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-500 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
                    <p className="text-muted-foreground mt-1">Track your past and current orders</p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse border border-border/40" />
                    ))}
                </div>
            ) : list.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-xl border border-dashed border-border text-center">
                    <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                        <Package className="h-10 w-10 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No orders found</h3>
                    <p className="text-muted-foreground max-w-sm mt-2">Looks like you haven't placed any orders yet. Time to try something delicious!</p>
                    <Button className="mt-6" variant="default" onClick={() => window.location.href = '/'}>
                        Browse Restaurants
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {list.map(order => (
                        <Card key={order.id} className="overflow-hidden border-border/60 hover:border-primary/40 hover:shadow-md transition-all">
                            <CardHeader className="bg-muted/30 p-4 sm:p-6 pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">Order #{order.id.slice(-8).toUpperCase()}</CardTitle>
                                            <Badge variant="outline" className={`${statusColors[order.status] || 'bg-gray-100'}`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                                        <p className="text-xs text-muted-foreground">{order.items?.length} Items</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="p-4 sm:p-6">
                                <div className="space-y-3">
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm group">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center justify-center w-6 h-6 rounded bg-muted text-xs font-medium text-muted-foreground">
                                                    {item.quantity}x
                                                </span>
                                                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                                            </div>
                                            <span className="text-muted-foreground">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/10 p-4 px-6 flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[200px]">{order.deliveryAddress?.address || "Pickup / No Address"}</span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-primary">
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
