import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Designs from './pages/Designs'
import AIGenerator from './pages/AIGenerator'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Register from './pages/Register'  // أو من Auth حسب ملفاتك
import Login from './pages/Login'
import './styles/global.css'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/designs"  element={<Designs />} />
        <Route path="/ai"       element={<PrivateRoute><AIGenerator /></PrivateRoute>} />
        <Route path="/profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/orders"   element={<PrivateRoute><Orders /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}