import { useState, useEffect } from 'react'
import { orders } from '../api'
import { useAuth } from '../store'
import Navbar from '../components/Navbar'

const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-purple-100 text-purple-700',
    OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700'
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
        } catch { }
        setLoading(false)
    }

    if (!user) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20">Please login</div></div>

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">My Orders 📦</h1>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : list.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow text-gray-500">No orders yet</div>
                ) : (
                    <div className="space-y-4">
                        {list.map(order => (
                            <div key={order.id} className="bg-white p-4 rounded-xl shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-sm text-gray-500">#{order.id.slice(-8)}</p>
                                        <p className="font-bold text-lg">₹{order.totalAmount}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="border-t pt-3 mt-3">
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-xs text-gray-400 mt-3">
                                    {order.deliveryAddress?.address}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
