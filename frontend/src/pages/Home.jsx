import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { restaurants } from '../api'
import Navbar from '../components/Navbar'

export default function Home() {
    const [list, setList] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => { load() }, [])

    const load = async (q = '') => {
        setLoading(true)
        try {
            const { data } = q ? await restaurants.search(q) : await restaurants.list()
            setList(data.data?.content || [])
        } catch { setList([]) }
        setLoading(false)
    }

    const handleSearch = e => {
        e.preventDefault()
        load(search)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-gradient-to-r from-orange-500 to-red-500 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">Hungry? We got you! 🍕</h1>
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
                        <input
                            type="text"
                            placeholder="Search restaurants..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="flex-1 p-3 rounded-lg text-gray-800 outline-none"
                        />
                        <button type="submit" className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-300">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : list.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No restaurants found</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map(r => (
                            <Link key={r.id} to={`/restaurant/${r.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
                                <div className="h-40 bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center text-6xl">
                                    🍽️
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold group-hover:text-orange-500">{r.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{r.description}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                                            ⭐ {r.rating?.toFixed(1) || 'New'}
                                        </span>
                                        <span className="text-gray-400 text-sm">{r.cuisines?.join(', ')}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
