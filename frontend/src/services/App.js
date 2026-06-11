// ==================================================
//  App.js — نقطة البداية وكل الروابط
// ==================================================
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './src/components/Navbar'
import Home from './src/pages/Home'
import Register from './src/pages/Register'
import Login from './src/pages/Login'
import Designs from './src/pages/Designs'
import AIGenerator from './src/pages/AIGenerator'
import Profile from './src/pages/Profile'
import Orders from './src/pages/Orders'
import './styles/global.css'
import OrderCustomizer from './pages/OrderCustomizer'
import AdminDashboard from './pages/AdminDashboard'
import OrderCustomizer from './pages/OrderCustomizer'

// حماية الصفحات التي تحتاج تسجيل دخول
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/designs"   element={<Designs />} />
        <Route path="/ai"        element={<PrivateRoute><AIGenerator /></PrivateRoute>} />
        <Route path="/profile"   element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/orders"    element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/customize/:id" element={<PrivateRoute><OrderCustomizer /></PrivateRoute>} />
        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/customize"       element={<PrivateRoute><OrderCustomizer /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
