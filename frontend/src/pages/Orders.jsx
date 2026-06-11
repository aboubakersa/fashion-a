import React from 'react'


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/designs"         element={<Designs />} />
        <Route path="/ai"              element={<PrivateRoute><AIGenerator /></PrivateRoute>} />
        <Route path="/profile"         element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/orders"          element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/customize"       element={<PrivateRoute><OrderCustomizer /></PrivateRoute>} />
        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
