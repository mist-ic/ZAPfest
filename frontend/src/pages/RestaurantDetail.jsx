import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { restaurants, menu } from '../api'
import { useCart, useAuth } from '../store'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Clock, Plus, Loader2, Info, ShoppingBag } from "lucide-react"
import { toast } from "sonner"

export default function RestaurantDetail() {
    const { id } = useParams()
    const [restaurant, setRestaurant] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const cart = useCart()
    const { user } = useAuth()

    useEffect(() => { load() }, [id])

    const load = async () => {
        setLoading(true)
        try {
            const [r, m] = await Promise.all([restaurants.get(id), menu.get(id)])
            setRestaurant(r.data.data)
            setItems(m.data.data || [])
        } catch (error) {
            console.error("Failed to load restaurant details", error)
        }
        setLoading(false)
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    if (!restaurant) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
            <Info className="h-12 w-12 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold">Restaurant not found</h2>
        </div>
    )

    const categories = [...new Set(items.map(i => i.category))]

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            {/* Restaurant Hero - Light Theme */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-rose-500/5 border border-border/40 shadow-sm">
                {/* Background image or gradient */}
                {restaurant.imageUrl ? (
                    <div className="absolute inset-0">
                        <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-background/0 opacity-70" />
                )}

                <div className="relative z-10 p-8 md:p-12 text-foreground">
                    <div className="max-w-4xl">
                        <Badge className="mb-4 bg-primary text-white border-transparent hover:bg-primary/90 shadow-sm shadow-primary/20">
                            {restaurant.cuisines?.[0] || "Restaurant"}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-sm">{restaurant.name}</h1>
                        <p className="text-muted-foreground text-lg mb-6 line-clamp-2 max-w-2xl">{restaurant.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                            <div className="flex items-center bg-background/60 backdrop-blur px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
                                <Star className="w-4 h-4 text-yellow-500 mr-1.5 fill-current" />
                                <span>{restaurant.rating?.toFixed(1) || 'New'}</span>
                                <span className="mx-2 text-muted-foreground/50">•</span>
                                <span className="text-muted-foreground">100+ ratings</span>
                            </div>
                            <div className="flex items-center bg-background/60 backdrop-blur px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
                                <Clock className="w-4 h-4 text-muted-foreground mr-1.5" />
                                <span>30-40 min</span>
                            </div>
                            {restaurant.address && (
                                <div className="flex items-center bg-background/60 backdrop-blur px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground mr-1.5" />
                                    <span className="truncate max-w-[200px]">{restaurant.address.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="max-w-5xl mx-auto space-y-12">
                {categories.map(cat => (
                    <div key={cat} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold tracking-tight">{cat}</h2>
                            <Separator className="flex-1" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.filter(i => i.category === cat).map(item => (
                                <Card key={item.id} className="group overflow-hidden border-border/40 hover:border-primary/30 transition-all hover:shadow-md bg-card/60 backdrop-blur-sm">
                                    <div className="flex h-full">
                                        <div className="flex-1 p-5 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                            <div className="pt-2 flex items-center justify-between">
                                                <span className="font-bold text-lg">₹{item.price}</span>
                                                {user?.role === 'CUSTOMER' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            cart.add({ id: item.id, name: item.name, price: item.price }, id)
                                                            toast.success(`Added ${item.name} to cart`)
                                                        }}
                                                        className="h-8 px-4 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                                                    >
                                                        Add <Plus className="w-4 h-4 ml-1" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        {/* Optional Item Image Placeholder - keeping it compact */}
                                        {item.imageUrl && (
                                            <div className="w-32 h-32 relative shrink-0">
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
                        <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-foreground">No menu items available</h3>
                        <p className="text-muted-foreground">Check back later for updates.</p>
                    </div>
                )}
            </div>

            {/* Floating Cart Button */}
            {cart.items.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50 animate-in zoom-in duration-300">
                    <Button
                        onClick={() => window.location.href = '/cart'}
                        size="lg"
                        className="rounded-full h-14 w-14 shadow-xl bg-orange-500 hover:bg-orange-600 border-2 border-white hover:scale-105 transition-transform"
                    >
                        <div className="relative">
                            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                {cart.items.reduce((a, b) => a + b.qty, 0)}
                            </span>
                            <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                    </Button>
                </div>
            )}
        </div>
    )
}
