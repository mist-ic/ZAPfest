import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../api'
import { useAuth } from '../store'

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { setUser } = useAuth()
    const nav = useNavigate()

    const submit = async e => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const { data } = await auth.register(form)
            localStorage.setItem('accessToken', data.data.accessToken)
            localStorage.setItem('refreshToken', data.data.refreshToken)
            setUser({ id: data.data.userId, name: data.data.name, email: data.data.email, role: data.data.role })
            nav('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">🍔 Join ZAPfest</h1>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={submit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account? <Link to="/login" className="text-orange-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}
