import React, { useState, useEffect } from 'react'
import { getProfile } from '../services/authService'
import { getMyDesigns } from '../services/designService'

export default function Profile() {
  const [user,    setUser]    = useState(null)
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form,    setForm]    = useState({ username: '', phone: '' })
  const [saved,   setSaved]   = useState(false)
  const [tab,     setTab]     = useState('designs')

  useEffect(() => {
    Promise.all([getProfile(), getMyDesigns()])
      .then(([u, d]) => { setUser(u); setDesigns(d); setForm({ username: u.username, phone: u.phone || '' }) })
      .catch(() => { setUser({ username: 'أحمد', email: 'ahmed@gmail.com', phone: '', created_at: new Date().toISOString() }); setDesigns([]) })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = () => {
    setUser(prev => ({ ...prev, ...form }))
    setEditing(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className="page-center"><div className="spinner" /></div>

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: 64 }}>
      <div style={styles.header}>
        <p className="section-tag">حسابي</p>
        <h1 style={styles.title}>MY PROFILE</h1>
      </div>

      <div style={styles.layout}>
        {/* كارد البيانات */}
        <div style={styles.card}>
          <div style={styles.avatarBox}>
            <div style={styles.avatar}>
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={styles.avatarGlow} />
          </div>

          {!editing ? (
            <>
              <h2 style={styles.name}>{user?.username}</h2>
              <p style={styles.email}>{user?.email}</p>
              {user?.phone && <p style={styles.phone}>📞 {user.phone}</p>}
              <p style={styles.joined}>
                عضو منذ {new Date(user?.created_at).toLocaleDateString('ar-SA')}
              </p>
              {saved && <p className="msg-success" style={{ textAlign: 'center' }}>✅ تم الحفظ</p>}
              <button onClick={() => setEditing(true)} className="btn btn-outline-white" style={{ width: '100%', marginTop: 24 }}>
                ✏️ تعديل البيانات
              </button>
            </>
          ) : (
            <>
              <div style={styles.field}>
                <label style={styles.label}>اسم المستخدم</label>
                <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="input input-dark" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>رقم الجوال</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="05xxxxxxxx" className="input input-dark" />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={handleSave}            className="btn btn-white"         style={{ flex: 1 }}>حفظ</button>
                <button onClick={() => setEditing(false)} className="btn btn-outline-white" style={{ flex: 1 }}>إلغاء</button>
              </div>
            </>
          )}

          {/* إحصائيات */}
          <div style={styles.stats}>
            {[
              [designs.length, 'تصميم'],
              ['0', 'طلب'],
              ['0', 'إعجاب'],
            ].map(([n, l], i) => (
              <div key={i} style={styles.stat}>
                <span style={styles.statNum}>{n}</span>
                <span style={styles.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* التصاميم والطلبات */}
        <div style={styles.content}>
          <div style={styles.tabs}>
            {[['designs', 'تصاميمي'], ['orders', 'طلباتي'], ['liked', 'المحفوظات']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  ...styles.tab,
                  color:       tab === key ? '#fff' : '#555',
                  borderBottom: tab === key ? '2px solid #00d4ff' : '2px solid transparent',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'designs' && (
            designs.length === 0 ? (
              <div style={styles.empty}>
                <span style={{ fontSize: 60, opacity: 0.2 }}>👗</span>
                <p style={{ color: '#333', marginTop: 16, letterSpacing: 2, textTransform: 'uppercase', fontSize: 13 }}>لا توجد تصاميم بعد</p>
              </div>
            ) : (
              <div style={styles.designsGrid}>
                {designs.map(d => (
                  <div key={d.id} style={styles.designCard}>
                    <div style={styles.designImg}>
                      {d.image ? <img src={d.image} alt={d.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: 36, opacity: 0.2 }}>👗</span>}
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <p style={styles.designName}>{d.title}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                        <p style={styles.designPrice}>{d.price} ر.س</p>
                        <span className={`badge ${d.status === 'published' ? 'badge-cyan' : 'badge-white'}`} style={{ fontSize: 10 }}>
                          {d.status === 'published' ? 'منشور' : 'مسودة'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'orders' && (
            <div style={styles.empty}>
              <span style={{ fontSize: 60, opacity: 0.2 }}>📦</span>
              <p style={{ color: '#333', marginTop: 16, letterSpacing: 2, textTransform: 'uppercase', fontSize: 13 }}>لا توجد طلبات بعد</p>
            </div>
          )}

          {tab === 'liked' && (
            <div style={styles.empty}>
              <span style={{ fontSize: 60, opacity: 0.2 }}>♥</span>
              <p style={{ color: '#333', marginTop: 16, letterSpacing: 2, textTransform: 'uppercase', fontSize: 13 }}>لا توجد محفوظات بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  header:      { padding: '60px 80px 40px' },
  title:       { fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: '#fff', letterSpacing: 4 },
  layout:      { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 3, padding: '0 80px 80px' },
  card:        { background: '#0a0a0a', border: '1px solid #111', borderRadius: 0, padding: 32 },
  avatarBox:   { display: 'flex', justifyContent: 'center', marginBottom: 24, position: 'relative' },
  avatar:      { width: 88, height: 88, borderRadius: '50%', background: '#111', border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontFamily: "'Bebas Neue',sans-serif", color: '#fff', position: 'relative', zIndex: 1 },
  avatarGlow:  { position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)' },
  name:        { fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: '#fff', textAlign: 'center', letterSpacing: 2, marginBottom: 6 },
  email:       { color: '#444', textAlign: 'center', fontSize: 13, marginBottom: 4 },
  phone:       { color: '#444', textAlign: 'center', fontSize: 13, marginBottom: 4 },
  joined:      { color: '#222', textAlign: 'center', fontSize: 11, letterSpacing: 1, marginBottom: 8 },
  field:       { marginBottom: 16 },
  label:       { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, color: '#555' },
  stats:       { display: 'flex', justifyContent: 'space-around', marginTop: 28, paddingTop: 20, borderTop: '1px solid #111' },
  stat:        { textAlign: 'center' },
  statNum:     { display: 'block', fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: '#00d4ff', letterSpacing: 2 },
  statLabel:   { fontSize: 10, color: '#444', letterSpacing: 2, textTransform: 'uppercase' },
  content:     { background: '#050505', border: '1px solid #0d0d0d', padding: 32 },
  tabs:        { display: 'flex', gap: 32, marginBottom: 32, borderBottom: '1px solid #111', paddingBottom: 0 },
  tab:         { background: 'none', border: 'none', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', paddingBottom: 16, transition: 'all 0.2s' },
  empty:       { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 },
  designsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 3 },
  designCard:  { background: '#0a0a0a', border: '1px solid #111', overflow: 'hidden' },
  designImg:   { height: 160, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  designName:  { fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: '#fff', letterSpacing: 1 },
  designPrice: { color: '#00d4ff', fontWeight: 700, fontSize: 14 },
}
