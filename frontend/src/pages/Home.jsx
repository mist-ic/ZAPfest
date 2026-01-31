import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { restaurants } from '../api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Utensils, Clock } from "lucide-react"

export default function Home() {
    const [list, setList] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => { load() }, [])

    const load = async (q = '') => {
        setLoading(true)
        try {
            const response = q ? await restaurants.search(q) : await restaurants.list()
            // Support both paginated response and direct list
            const content = response.data?.data?.content || response.data?.data || []
            setList(content)
        } catch (error) {
            console.error("Failed to load restaurants:", error)
            setList([])
        }
        setLoading(false)
    }

    const handleSearch = e => {
        e.preventDefault()
        load(search)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-rose-500/5 border border-border/40 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-background/0 opacity-70" />
                {/* Decorative blobs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl opacity-60" />

                <div className="relative z-10 p-10 md:p-16 text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                        Craving something? <br />
                        <span className="italic text-primary">ZAP</span> it.
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Order from top-rated restaurants near you. Fast delivery, fresh food, and exclusive deals.
                    </p>

                    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative flex items-center shadow-lg shadow-primary/5 rounded-full ring-4 ring-background/50 bg-background/80 backdrop-blur border border-border/60">
                        <Search className="absolute left-4 h-5 w-5 text-muted-foreground z-20" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by restaurant or cuisine..."
                            className="bg-transparent border-none text-foreground rounded-full pl-12 pr-32 h-14 focus-visible:ring-0 focus-visible:ring-offset-0 text-base shadow-none"
                        />
                        <Button
                            type="submit"
                            size="lg"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-md shadow-primary/20 h-10"
                        >
                            Find Food
                        </Button>
                    </form>
                </div>
            </div>

            {/* Restaurant Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Popular Restaurants</h2>
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                        View All
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 rounded-xl bg-muted/50 animate-pulse border border-border/40" />
                        ))}
                    </div>
                ) : list.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
                        <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-foreground">No restaurants found</h3>
                        <p className="text-muted-foreground">Try searching for something else or clear filters.</p>
                        <Button variant="link" onClick={() => { setSearch(''); load(); }} className="mt-2 text-primary">
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((r) => (
                            <Link key={r.id} to={`/restaurant/${r.id}`} className="group block h-full">
                                <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 bg-card/60 backdrop-blur-sm">
                                    {/* Image Placeholder or Actual Image */}
                                    <div className="h-48 bg-muted relative overflow-hidden group-hover:shadow-inner transition-all">
                                        {r.imageUrl ? (
                                            <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                                                <Utensils className="h-12 w-12 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <Badge variant="secondary" className="bg-background/80 backdrop-blur text-foreground font-medium shadow-sm border border-border/10">
                                                <Clock className="w-3 h-3 mr-1" /> 25-35 min
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="p-5 pb-2">
                                        <div className="flex justify-between items-start gap-2">
                                            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                {r.name}
                                            </CardTitle>
                                            <Badge className={r.rating >= 4.5 ? "bg-green-500 hover:bg-green-600 border-transparent text-white shadow-sm shadow-green-200" : "bg-primary hover:bg-primary/90 border-transparent text-white shadow-sm shadow-primary/20"}>
                                                <Star className="w-3 h-3 mr-1 fill-current" /> {r.rating ? r.rating.toFixed(1) : "New"}
                                            </Badge>
                                        </div>
                                        {r.address && (
                                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {r.address.address}
                                            </div>
                                        )}
                                    </CardHeader>

                                    <CardContent className="p-5 pt-2 text-sm text-muted-foreground line-clamp-2">
                                        {r.description || "No description available."}
                                    </CardContent>

                                    <CardFooter className="p-5 pt-0 flex flex-wrap gap-2">
                                        {r.cuisines?.slice(0, 3).map((cuisine) => (
                                            <Badge key={cuisine} variant="outline" className="border-border/60 hover:bg-secondary/50 font-normal text-muted-foreground">
                                                {cuisine}
                                            </Badge>
                                        ))}
                                        {r.cuisines?.length > 3 && (
                                            <Badge variant="outline" className="border-border/60 font-normal text-muted-foreground">
                                                +{r.cuisines.length - 3}
                                            </Badge>
                                        )}
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
