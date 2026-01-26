import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { restaurants, menu } from '../api'
import { useCart, useAuth } from '../store'
import Navbar from '../components/Navbar'

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
        } catch { }
        setLoading(false)
    }

    if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20">Loading...</div></div>
    if (!restaurant) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20">Restaurant not found</div></div>

    const categories = [...new Set(items.map(i => i.category))]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-gradient-to-r from-orange-500 to-red-500 py-8">
                <div className="max-w-5xl mx-auto px-4 text-white">
                    <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                    <p className="opacity-80 mt-2">{restaurant.description}</p>
                    <div className="flex gap-4 mt-3">
                        <span className="bg-white/20 px-3 py-1 rounded">⭐ {restaurant.rating?.toFixed(1) || 'New'}</span>
                        <span className="bg-white/20 px-3 py-1 rounded">{restaurant.cuisines?.join(', ')}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {categories.map(cat => (
                    <div key={cat} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">{cat}</h2>
                        <div className="grid gap-4">
                            {items.filter(i => i.category === cat).map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-gray-500 text-sm">{item.description}</p>
                                        <p className="text-orange-500 font-bold mt-1">₹{item.price}</p>
                                    </div>
                                    {user?.role === 'CUSTOMER' && (
                                        <button
                                            onClick={() => cart.add({ id: item.id, name: item.name, price: item.price }, id)}
                                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                                        >
                                            Add +
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No menu items yet</div>
                )}
            </div>
        </div>
    )
}
