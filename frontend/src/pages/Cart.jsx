import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useAuth } from '../store'
import { orders } from '../api'
import Navbar from '../components/Navbar'

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
            setError(err.response?.data?.message || 'Order failed')
        }
        setLoading(false)
    }

    if (!user) {
        return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20">Please login to view cart</div></div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Your Cart 🛒</h1>

                {cart.items.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <p className="text-gray-500 mb-4">Your cart is empty</p>
                        <button onClick={() => nav('/')} className="text-orange-500 hover:underline">Browse restaurants</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cart.items.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-orange-500 font-bold">₹{item.price}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => cart.updateQty(item.id, item.qty - 1)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">−</button>
                                    <span className="w-8 text-center font-medium">{item.qty}</span>
                                    <button onClick={() => cart.updateQty(item.id, item.qty + 1)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">+</button>
                                    <button onClick={() => cart.remove(item.id)} className="text-red-500 ml-2">🗑️</button>
                                </div>
                            </div>
                        ))}

                        <div className="bg-white p-4 rounded-xl shadow mt-6">
                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span>Total</span>
                                <span className="text-orange-500">₹{cart.total()}</span>
                            </div>

                            <textarea
                                placeholder="Delivery address..."
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                className="w-full p-3 border rounded-lg mb-4 h-24 resize-none"
                            />

                            {error && <div className="text-red-500 mb-4">{error}</div>}

                            <button
                                onClick={checkout}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                            >
                                {loading ? 'Placing order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
