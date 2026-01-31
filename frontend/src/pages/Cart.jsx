import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useAuth } from '../store'
import { orders } from '../api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function Cart() {
    const cart = useCart()
    const { user } = useAuth()
    const nav = useNavigate()
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const checkout = async () => {
        if (!address.trim()) { setError('Enter delivery address'); return }
        setLoading(true)
        setError('')
        try {
            await orders.create({
                restaurantId: cart.restaurantId,
                items: cart.items.map(i => ({ menuItemId: i.id, quantity: i.qty })),
                deliveryAddress: { label: 'Delivery', address }
            })
            cart.clear()
            nav('/orders')
        } catch (err) {
            console.error("Order error:", err)
            const msg = err.response?.data?.message || err.message || 'Order failed'
            setError(msg)
            toast.error(`Order Failed: ${msg}`)
        }
        setLoading(false)
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-20" />
                <h2 className="text-xl font-semibold text-muted-foreground">Please login to view cart</h2>
                <Button onClick={() => nav('/login')}>Login</Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-2">
                Your Cart <ShoppingCart className="h-8 w-8 text-primary" />
            </h1>

            {cart.items.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border px-4">
                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-6 opacity-30" />
                    <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
                    <Button onClick={() => nav('/')} size="lg" className="rounded-full px-8 shadow-md">
                        Browse Restaurants
                    </Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="md:col-span-2 space-y-4">
                        {cart.items.map(item => (
                            <Card key={item.id} className="overflow-hidden border-border/60 hover:border-primary/30 transition-all">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <p className="text-primary font-bold">₹{item.price * item.qty}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-lg border border-border/40">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-md hover:bg-background hover:text-foreground"
                                            onClick={() => cart.updateQty(item.id, item.qty - 1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-6 text-center font-medium text-sm">{item.qty}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-md hover:bg-background hover:text-foreground"
                                            onClick={() => cart.updateQty(item.id, item.qty + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                                        onClick={() => cart.remove(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24 border-primary/20 shadow-lg shadow-primary/5 bg-background/60 backdrop-blur-xl">
                            <CardHeader className="pb-4">
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-base">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-semibold">₹{cart.total()}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">₹{cart.total()}</span>
                                </div>

                                <div className="pt-4 space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" /> Delivery Address
                                    </label>
                                    <Textarea
                                        placeholder="Enter your full address..."
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        className="resize-none min-h-[80px] bg-background/50 focus:bg-background"
                                    />
                                    {error && <p className="text-xs text-destructive font-medium">{error}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full shadow-lg shadow-primary/20"
                                    size="lg"
                                    onClick={checkout}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <>Checkout <ArrowRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
