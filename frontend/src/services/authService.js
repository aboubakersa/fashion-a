// ==================================================
//  🔐 frontend/src/services/authService.js
//  تسجيل الدخول والخروج وإنشاء الحساب
// ==================================================

import API from './api'

export const register = async (data) => {
  // data = { username, email, password, password2 }
  const res = await API.post('/auth/register/', data)
  localStorage.setItem('access_token',  res.data.tokens.access)
  localStorage.setItem('refresh_token', res.data.tokens.refresh)
  return res.data
}

export const login = async (data) => {
  // data = { email, password }
  const res = await API.post('/auth/login/', data)
  localStorage.setItem('access_token',  res.data.tokens.access)
  localStorage.setItem('refresh_token', res.data.tokens.refresh)
  return res.data
}

export const logout = async () => {
  const refresh = localStorage.getItem('refresh_token')
  await API.post('/auth/logout/', { refresh })
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getProfile = async () => {
  const res = await API.get('/auth/profile/')
  return res.data
}
