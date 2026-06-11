// ==================================================
//  pages/Login.jsx — صفحة تسجيل الدخول
// ==================================================
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) return setError('يرجى ملء جميع الحقول')
    try {
      setLoading(true)
      await login(form)
      navigate('/')
    } catch (err) {
      setError('الإيميل أو كلمة المرور خاطئة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>تسجيل الدخول</h1>
        <p style={styles.sub}>أهلاً بك مجدداً 👋</p>

        <div style={styles.field}>
          <label style={styles.label}>البريد الإلكتروني</label>
          <input
            name="email" type="email" value={form.email}
            onChange={handleChange} placeholder="ahmed@gmail.com"
            className="input"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>كلمة المرور</label>
          <input
            name="password" type="password" value={form.password}
            onChange={handleChange} placeholder="كلمة المرور"
            className="input"
          />
        </div>

        {error && <p className="msg-error">{error}</p>}

        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 20, padding: 14 }}
          disabled={loading}
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>

        <p style={styles.footer}>
          ليس لديك حساب؟ <Link to="/register" style={styles.link}>أنشئ حساباً</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page:  { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: 20 },
  card:  { background: '#fff', borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: 32, marginBottom: 8, textAlign: 'center' },
  sub:   { color: '#888', textAlign: 'center', marginBottom: 32 },
  field: { marginBottom: 18 },
  label: { display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#333' },
  footer:{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#888' },
  link:  { color: '#c9a84c', fontWeight: 600 },
}
