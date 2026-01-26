import { useState, useEffect } from 'react'
import { restaurants, menu, orders } from '../api'
import { useAuth } from '../store'
import Navbar from '../components/Navbar'

export default function RestaurantPanel() {
    const { user } = useAuth()
    const [myRestaurant, setMyRestaurant] = useState(null)
    const [items, setItems] = useState([])
    const [orderList, setOrderList] = useState([])
    const [tab, setTab] = useState('orders')
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '' })
    const [loading, setLoading] = useState(true)

    useEffect(() => { load() }, [])

    const load = async () => {
        setLoading(true)
        try {
            const { data } = await restaurants.my()
            const r = data.data?.[0]
            if (r) {
                setMyRestaurant(r)
                const [m, o] = await Promise.all([menu.get(r.id), orders.restaurant(r.id)])
                setItems(m.data.data || [])
                setOrderList(o.data.data?.content || [])
            }
        } catch { }
        setLoading(false)
    }

    const addItem = async e => {
        e.preventDefault()
        try {
            await menu.add(myRestaurant.id, { ...newItem, price: parseFloat(newItem.price) })
            setNewItem({ name: '', description: '', price: '', category: '' })
            load()
        } catch { }
    }

    const toggleAvail = async id => {
        await menu.toggle(myRestaurant.id, id)
        load()
    }

    const updateOrder = async (id, status) => {
        await orders.updateStatus(id, status)
        load()
    }

    if (!user || user.role !== 'RESTAURANT_OWNER') {
        return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20">Access denied</div></div>
    }

    if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20">Loading...</div></div>

    if (!myRestaurant) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-md mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Create Your Restaurant</h1>
                    <p className="text-gray-500">Contact admin to get restaurant owner access</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-2">{myRestaurant.name}</h1>
                <p className="text-gray-500 mb-6">{myRestaurant.description}</p>

                <div className="flex gap-4 mb-6">
                    <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-lg ${tab === 'orders' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                        Orders ({orderList.length})
                    </button>
                    <button onClick={() => setTab('menu')} className={`px-4 py-2 rounded-lg ${tab === 'menu' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                        Menu ({items.length})
                    </button>
                </div>

                {tab === 'orders' && (
                    <div className="space-y-4">
                        {orderList.length === 0 ? <div className="text-gray-500 py-8 text-center">No orders</div> : orderList.map(o => (
                            <div key={o.id} className="bg-white p-4 rounded-xl shadow">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">#{o.id.slice(-8)} - ₹{o.totalAmount}</span>
                                    <span className={`px-2 py-1 rounded text-sm ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {o.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mb-3">
                                    {o.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                                </div>
                                {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
                                    <div className="flex gap-2">
                                        {o.status === 'PENDING' && <button onClick={() => updateOrder(o.id, 'CONFIRMED')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Confirm</button>}
                                        {o.status === 'CONFIRMED' && <button onClick={() => updateOrder(o.id, 'PREPARING')} className="bg-purple-500 text-white px-3 py-1 rounded text-sm">Preparing</button>}
                                        {o.status === 'PREPARING' && <button onClick={() => updateOrder(o.id, 'OUT_FOR_DELIVERY')} className="bg-indigo-500 text-white px-3 py-1 rounded text-sm">Out for Delivery</button>}
                                        {o.status === 'OUT_FOR_DELIVERY' && <button onClick={() => updateOrder(o.id, 'DELIVERED')} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Delivered</button>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'menu' && (
                    <div>
                        <form onSubmit={addItem} className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-4 gap-4">
                            <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="p-2 border rounded" required />
                            <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="p-2 border rounded" required />
                            <input placeholder="Price" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="p-2 border rounded" required />
                            <button type="submit" className="bg-orange-500 text-white rounded hover:bg-orange-600">Add Item</button>
                        </form>

                        <div className="space-y-3">
                            {items.map(i => (
                                <div key={i.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{i.name}</h3>
                                        <p className="text-sm text-gray-500">{i.category} - ₹{i.price}</p>
                                    </div>
                                    <button onClick={() => toggleAvail(i.id)} className={`px-3 py-1 rounded text-sm ${i.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {i.isAvailable ? 'Available' : 'Unavailable'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
