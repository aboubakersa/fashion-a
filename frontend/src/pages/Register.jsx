// ==================================================
//  pages/Register.jsx — صفحة إنشاء حساب
// ==================================================
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.username || !form.email || !form.password || !form.password2) {
      return setError('يرجى ملء جميع الحقول')
    }
    if (form.password !== form.password2) {
      return setError('كلمتا المرور غير متطابقتين')
    }
    if (form.password.length < 8) {
      return setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    }
    try {
      setLoading(true)
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'حدث خطأ، حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>إنشاء حساب</h1>
        <p style={styles.sub}>انضم وابدأ بتصميم ملابسك بالذكاء الاصطناعي</p>

        <div style={styles.field}>
          <label style={styles.label}>اسم المستخدم</label>
          <input
            name="username" value={form.username}
            onChange={handleChange} placeholder="أحمد"
            className="input"
          />
        </div>

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
            onChange={handleChange} placeholder="8 أحرف على الأقل"
            className="input"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>تأكيد كلمة المرور</label>
          <input
            name="password2" type="password" value={form.password2}
            onChange={handleChange} placeholder="أعد كتابة كلمة المرور"
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
          {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
        </button>

        <p style={styles.footer}>
          لديك حساب؟ <Link to="/login" style={styles.link}>سجّل دخول</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page:  { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: 20 },
  card:  { background: '#fff', borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 460, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: 32, marginBottom: 8, textAlign: 'center' },
  sub:   { color: '#888', textAlign: 'center', marginBottom: 32, fontSize: 14 },
  field: { marginBottom: 18 },
  label: { display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#333' },
  footer:{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#888' },
  link:  { color: '#c9a84c', fontWeight: 600 },
}
