import { useState, useEffect } from 'react'
import { analytics, users, restaurants } from '../api'
import { useAuth } from '../store'
import Navbar from '../components/Navbar'

export default function Admin() {
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [userList, setUserList] = useState([])
    const [restList, setRestList] = useState([])
    const [tab, setTab] = useState('dashboard')
    const [loading, setLoading] = useState(true)

    useEffect(() => { load() }, [])

    const load = async () => {
        setLoading(true)
        try {
            const [s, u, r] = await Promise.all([
                analytics.dashboard(),
                users.list(),
                restaurants.list()
            ])
            setStats(s.data.data)
            setUserList(u.data.data?.content || [])
            setRestList(r.data.data?.content || [])
        } catch { }
        setLoading(false)
    }

    const changeRole = async (id, role) => {
        await users.updateRole(id, role)
        load()
    }

    if (!user || user.role !== 'ADMIN') {
        return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20">Admin access required</div></div>
    }

    if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20">Loading...</div></div>

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard 🛠️</h1>

                <div className="flex gap-4 mb-6">
                    {['dashboard', 'users', 'restaurants'].map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg capitalize ${tab === t ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                            {t}
                        </button>
                    ))}
                </div>

                {tab === 'dashboard' && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-orange-500">₹{stats.totalRevenue?.toFixed(0) || 0}</p>
                            <p className="text-gray-500">Total Revenue</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-blue-500">{stats.totalOrders || 0}</p>
                            <p className="text-gray-500">Total Orders</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-green-500">{stats.totalUsers || 0}</p>
                            <p className="text-gray-500">Total Users</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-purple-500">{stats.totalRestaurants || 0}</p>
                            <p className="text-gray-500">Restaurants</p>
                        </div>
                    </div>
                )}

                {tab === 'users' && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Role</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList.map(u => (
                                    <tr key={u.id} className="border-t">
                                        <td className="px-4 py-3">{u.name}</td>
                                        <td className="px-4 py-3">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${u.role === 'ADMIN' ? 'bg-red-100' : u.role === 'RESTAURANT_OWNER' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select onChange={e => changeRole(u.id, e.target.value)} value={u.role} className="text-sm border rounded px-2 py-1">
                                                <option value="CUSTOMER">Customer</option>
                                                <option value="RESTAURANT_OWNER">Owner</option>
                                                <option value="DELIVERY_PARTNER">Delivery</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'restaurants' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {restList.map(r => (
                            <div key={r.id} className="bg-white p-4 rounded-xl shadow">
                                <h3 className="font-semibold">{r.name}</h3>
                                <p className="text-sm text-gray-500">{r.cuisines?.join(', ')}</p>
                                <p className="text-sm mt-2">⭐ {r.rating?.toFixed(1) || 'New'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
