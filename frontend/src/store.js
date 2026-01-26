import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuth = create(persist(
    (set) => ({
        user: null,
        token: null,
        setUser: user => set({ user }),
        setToken: token => set({ token }),
        logout: () => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            set({ user: null, token: null })
        }
    }),
    { name: 'auth' }
))

export const useCart = create(persist(
    (set, get) => ({
        items: [],
        restaurantId: null,
        add: (item, restaurantId) => {
            const { items, restaurantId: currentRid } = get()
            if (currentRid && currentRid !== restaurantId) {
                set({ items: [{ ...item, qty: 1 }], restaurantId })
            } else {
                const existing = items.find(i => i.id === item.id)
                if (existing) {
                    set({ items: items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) })
                } else {
                    set({ items: [...items, { ...item, qty: 1 }], restaurantId })
                }
            }
        },
        remove: id => set(s => ({ items: s.items.filter(i => i.id !== id) })),
        updateQty: (id, qty) => set(s => ({
            items: qty > 0 ? s.items.map(i => i.id === id ? { ...i, qty } : i) : s.items.filter(i => i.id !== id)
        })),
        clear: () => set({ items: [], restaurantId: null }),
        total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0)
    }),
    { name: 'cart' }
))
