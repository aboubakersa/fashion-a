import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, login } from '../services/authService'

// ==================================================
//  صفحة إنشاء الحساب
// ==================================================
export default function Register() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ username: '', email: '', password: '', password2: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.username || !form.email || !form.password || !form.password2)
      return setError('يرجى ملء جميع الحقول')
    if (form.password !== form.password2)
      return setError('كلمتا المرور غير متطابقتين')
    if (form.password.length < 8)
      return setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
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
    <div style={authStyles.page}>

      {/* جانب أيسر — أسود */}
      <div style={authStyles.left}>
        <div style={authStyles.leftInner}>
          <Link to="/" style={authStyles.leftLogo}>
            تصميمك<span style={{ color: '#00d4ff' }}>.</span>
          </Link>
          <h1 style={authStyles.bigText}>
            JOIN<br />THE<br />
            <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>FUTURE</span>
          </h1>
          <p style={authStyles.leftSub}>صمّم. اختر. اطلب.</p>

          {/* مميزات صغيرة */}
          <div style={authStyles.leftFeatures}>
            {['🤖 توليد AI فوري', '🧵 مواد مخصصة', '📋 فاتورة تلقائية'].map((f, i) => (
              <div key={i} style={authStyles.leftFeature}>
                <div style={authStyles.featureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* جانب أيمن — فاتح */}
      <div style={authStyles.right}>
        <div style={authStyles.form}>
          <Link to="/" style={authStyles.backLink}>← رجوع للرئيسية</Link>

          <h2 style={authStyles.title}>إنشاء حساب</h2>
          <p style={authStyles.sub}>انضم وابدأ التصميم مجاناً</p>

          {[
            { name: 'username',  label: 'اسم المستخدم',      placeholder: 'أحمد محمد',           type: 'text'     },
            { name: 'email',     label: 'البريد الإلكتروني', placeholder: 'ahmed@gmail.com',      type: 'email'    },
            { name: 'password',  label: 'كلمة المرور',       placeholder: '8 أحرف على الأقل',    type: 'password' },
            { name: 'password2', label: 'تأكيد كلمة المرور', placeholder: 'أعد كتابة كلمة المرور', type: 'password' },
          ].map(f => (
            <div key={f.name} style={authStyles.field}>
              <label style={authStyles.label}>{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="input"
                style={authStyles.input}
              />
            </div>
          ))}

          {error && <p className="msg-error">{error}</p>}

          <button
            onClick={handleSubmit}
            className="btn btn-black"
            style={{ width: '100%', marginTop: 24, padding: '16px', fontSize: 15, letterSpacing: 2 }}
            disabled={loading}
          >
            {loading ? '...' : 'إنشاء الحساب →'}
          </button>

          {/* فاصل */}
          <div style={authStyles.divider}>
            <div style={authStyles.dividerLine} />
            <span style={authStyles.dividerText}>أو</span>
            <div style={authStyles.dividerLine} />
          </div>

          <p style={authStyles.footer}>
            لديك حساب؟{' '}
            <Link to="/login" style={authStyles.footerLink}>سجّل دخول</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ==================================================
//  صفحة تسجيل الدخول
// ==================================================
export function Login() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [show,    setShow]    = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password)
      return setError('يرجى ملء جميع الحقول')
    try {
      setLoading(true)
      await login(form)
      navigate('/')
    } catch {
      setError('الإيميل أو كلمة المرور خاطئة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={authStyles.page}>

      {/* جانب أيسر */}
      <div style={authStyles.left}>
        <div style={authStyles.leftInner}>
          <Link to="/" style={authStyles.leftLogo}>
            تصميمك<span style={{ color: '#00d4ff' }}>.</span>
          </Link>
          <h1 style={authStyles.bigText}>
            WELCOME<br />
            <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>BACK</span>
          </h1>
          <p style={authStyles.leftSub}>يسعدنا عودتك.</p>

          <div style={authStyles.leftFeatures}>
            {['✨ تصاميمك بانتظارك', '📦 تتبع طلباتك', '🎨 استمر في الإبداع'].map((f, i) => (
              <div key={i} style={authStyles.leftFeature}>
                <div style={authStyles.featureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* جانب أيمن */}
      <div style={authStyles.right}>
        <div style={authStyles.form}>
          <Link to="/" style={authStyles.backLink}>← رجوع للرئيسية</Link>

          <h2 style={authStyles.title}>تسجيل الدخول</h2>
          <p style={authStyles.sub}>أهلاً بك مجدداً 👋</p>

          <div style={authStyles.field}>
            <label style={authStyles.label}>البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ahmed@gmail.com"
              className="input"
              style={authStyles.input}
            />
          </div>

          <div style={authStyles.field}>
            <label style={authStyles.label}>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input"
                style={authStyles.input}
              />
              <button
                onClick={() => setShow(!show)}
                style={authStyles.eyeBtn}
              >
                {show ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="msg-error">{error}</p>}

          <button
            onClick={handleSubmit}
            className="btn btn-black"
            style={{ width: '100%', marginTop: 24, padding: '16px', fontSize: 15, letterSpacing: 2 }}
            disabled={loading}
          >
            {loading ? '...' : 'دخول →'}
          </button>

          <div style={authStyles.divider}>
            <div style={authStyles.dividerLine} />
            <span style={authStyles.dividerText}>أو</span>
            <div style={authStyles.dividerLine} />
          </div>

          <p style={authStyles.footer}>
            ليس لديك حساب؟{' '}
            <Link to="/register" style={authStyles.footerLink}>أنشئ حساباً مجاناً</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ==================================================
//  Styles
// ==================================================
const authStyles = {
  page:  { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' },

  left:  {
    background: '#000',
    backgroundImage: 'radial-gradient(ellipse at 30% 70%, #050d1a 0%, #000 60%)',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'flex-end',
    position: 'relative', overflow: 'hidden',
  },
  leftInner: { padding: '60px 64px', position: 'relative', zIndex: 2 },
  leftLogo:  {
    display: 'block', marginBottom: 48,
    fontFamily: "'Bebas Neue',sans-serif",
    fontSize: 28, letterSpacing: 4, color: '#fff',
  },
  bigText: {
    fontFamily: "'Bebas Neue',sans-serif",
    fontSize: 'clamp(56px, 7vw, 96px)',
    color: '#fff', lineHeight: 0.9,
    letterSpacing: 2, marginBottom: 20,
  },
  leftSub: { color: '#444', fontSize: 15, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 40 },
  leftFeatures: { display: 'flex', flexDirection: 'column', gap: 12 },
  leftFeature:  { display: 'flex', alignItems: 'center', gap: 12, color: '#555', fontSize: 14 },
  featureDot:   { width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', flexShrink: 0 },

  right: {
    background: '#f5f5f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 40,
  },
  form:     { width: '100%', maxWidth: 420 },
  backLink: {
    display: 'inline-block', fontSize: 12, color: '#999',
    marginBottom: 40, letterSpacing: 1,
    textTransform: 'uppercase', transition: 'color 0.2s',
  },
  title:    {
    fontFamily: "'Bebas Neue',sans-serif",
    fontSize: 44, letterSpacing: 2, color: '#000', marginBottom: 8,
  },
  sub:      { color: '#999', fontSize: 14, marginBottom: 36 },
  field:    { marginBottom: 20 },
  label:    {
    display: 'block', fontSize: 11, fontWeight: 700,
    letterSpacing: 2, textTransform: 'uppercase',
    marginBottom: 8, color: '#555',
  },
  input:    { background: '#fff', borderRadius: 4, border: '1.5px solid #e0e0e0' },
  eyeBtn:   {
    position: 'absolute', left: 12, top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
  },
  divider:     { display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' },
  dividerLine: { flex: 1, height: 1, background: '#e0e0e0' },
  dividerText: { color: '#bbb', fontSize: 13 },
  footer:      { textAlign: 'center', fontSize: 14, color: '#999' },
  footerLink:  { color: '#000', fontWeight: 700, textDecoration: 'underline' },
}