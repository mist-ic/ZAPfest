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
import InProgress from './pages/InProgress'

const queryClient = new QueryClient()

import DashboardLayout from './components/layout/DashboardLayout'

import { Toaster } from 'sonner'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/restaurant" element={<RestaurantPanel />} />
            <Route path="/admin" element={<Admin />} />
            {/* Added explicit dashboard route mapping to Home for now */}
            <Route path="/dashboard" element={<Home />} />

            {/* Placeholder Routes for "In Progress" features */}
            <Route path="/menu" element={<InProgress />} />
            <Route path="/reviews" element={<InProgress />} />
            <Route path="/users" element={<InProgress />} />
            <Route path="/settings" element={<InProgress />} />
            <Route path="/profile" element={<InProgress />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
