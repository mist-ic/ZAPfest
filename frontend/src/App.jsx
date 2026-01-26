import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RestaurantDetail from './pages/RestaurantDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import RestaurantPanel from './pages/RestaurantPanel'
import Admin from './pages/Admin'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/restaurant" element={<RestaurantPanel />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
