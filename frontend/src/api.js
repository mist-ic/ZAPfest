import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config
        if ((err.response?.status === 401 || err.response?.status === 403) && localStorage.getItem('refreshToken') && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const { data } = await axios.post('/api/auth/refresh', null, {
                    headers: { 'X-Refresh-Token': localStorage.getItem('refreshToken') }
                })
                localStorage.setItem('accessToken', data.data.accessToken)
                localStorage.setItem('refreshToken', data.data.refreshToken)

                // Update header for both storage and the retry request
                api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`
                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`

                return api(originalRequest)
            } catch (refreshError) {
                // Only clear and redirect if refresh actually failed
                console.error("Token refresh failed:", refreshError)
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(err)
    }
)

export const auth = {
    register: d => api.post('/auth/register', d),
    login: d => api.post('/auth/login', d),
    me: () => api.get('/users/me')
}

export const restaurants = {
    list: (p = 0) => api.get(`/restaurants?page=${p}`),
    search: (q, p = 0) => api.get(`/restaurants/search?q=${q}&page=${p}`),
    get: id => api.get(`/restaurants/${id}`),
    create: d => api.post('/restaurants', d),
    update: (id, d) => api.put(`/restaurants/${id}`, d),
    my: () => api.get('/restaurants/my')
}

export const menu = {
    get: id => api.get(`/restaurants/${id}/menu`),
    add: (id, d) => api.post(`/restaurants/${id}/menu`, d),
    update: (rid, mid, d) => api.put(`/restaurants/${rid}/menu/${mid}`, d),
    toggle: (rid, mid) => api.patch(`/restaurants/${rid}/menu/${mid}/availability`)
}

export const orders = {
    create: d => api.post('/orders', d),
    my: (p = 0) => api.get(`/orders?page=${p}`),
    get: id => api.get(`/orders/${id}`),
    restaurant: (id, p = 0) => api.get(`/orders/restaurant/${id}?page=${p}`),
    updateStatus: (id, s) => api.patch(`/orders/${id}/status?status=${s}`),
    cancel: id => api.post(`/orders/${id}/cancel`)
}

export const payments = {
    create: id => api.post(`/payments/create/${id}`)
}

export const reviews = {
    create: d => api.post('/reviews', d),
    restaurant: (id, p = 0) => api.get(`/reviews/restaurant/${id}?page=${p}`)
}

export const analytics = {
    dashboard: () => api.get('/analytics/dashboard'),
    revenue: (s, e) => api.get(`/analytics/revenue?startDate=${s}&endDate=${e}`),
    restaurant: id => api.get(`/analytics/restaurant/${id}`)
}

export const users = {
    list: (p = 0) => api.get(`/users?page=${p}`),
    updateRole: (id, r) => api.patch(`/users/${id}/role?role=${r}`)
}

export default api
