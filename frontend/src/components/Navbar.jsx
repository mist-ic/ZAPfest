import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useCart } from '../store'

export default function Navbar() {
    const { user, logout } = useAuth()
    const cart = useCart()
    const nav = useNavigate()

    const handleLogout = () => {
        logout()
        nav('/login')
    }

    return (
        <nav className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">🍔 ZAPfest</Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === 'CUSTOMER' && (
                                <>
                                    <Link to="/orders" className="hover:underline">My Orders</Link>
                                    <Link to="/cart" className="relative hover:underline">
                                        🛒 Cart
                                        {cart.items.length > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                {cart.items.length}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            )}
                            {user.role === 'RESTAURANT_OWNER' && (
                                <Link to="/restaurant" className="hover:underline">My Restaurant</Link>
                            )}
                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className="hover:underline">Admin</Link>
                            )}
                            <span className="text-sm opacity-80">{user.name}</span>
                            <button onClick={handleLogout} className="bg-white/20 px-3 py-1 rounded hover:bg-white/30">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="bg-white text-orange-500 px-4 py-1 rounded font-medium hover:bg-gray-100">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
