import React, { useState, useRef } from 'react'
import API from '../services/api'

const SUGGESTIONS = [
  'فستان سهرة أزرق ملكي بتطريز ذهبي عند الخصر',
  'عباءة سوداء عصرية بتفاصيل فضية',
  'قميص كاجوال بنقشة هندسية ألوان محايدة',
  'بدلة رسمية رمادية داكنة بقصة حديثة',
  'فستان صيفي قصير بألوان استوائية زاهية',
]

export default function AIGenerator() {
  const [prompt,   setPrompt]   = useState('')
  const [images,   setImages]   = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [selected, setSelected] = useState(null)
  const [image,    setImage]    = useState(null)
  const [history,  setHistory]  = useState([])
  const fileRef = useRef()

  const generate = async () => {
    if (!prompt.trim()) return setError('اكتب وصف التصميم أولاً')
    setError('')
    setImages([])
    setSelected(null)
    setLoading(true)
    setHistory(prev => [{ prompt, time: new Date().toLocaleTimeString('ar') }, ...prev.slice(0, 4)])
    try {
      const formData = new FormData()
      formData.append('message', prompt)
      if (image) formData.append('image', image)
      const res = await API.post('/ai/chat/', formData)
      const imgs = res.data.images || (res.data.image_url ? [res.data.image_url] : [])
      setImages(imgs)
      if (imgs.length > 0) setSelected(imgs[0])
    } catch {
      setError('حدث خطأ في التوليد')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: 64 }}>
      <div style={{ padding: '60px 80px 48px', borderBottom: '1px solid #0d0d0d' }}>
        <p className="section-tag">مولّد التصاميم</p>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: '#fff', letterSpacing: 4 }}>AI GENERATOR</h1>
        <p style={{ color: '#555', fontSize: 15, marginTop: 8 }}>صف فكرتك أو ارفع صورة — والذكاء الاصطناعي يبدع</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', minHeight: 'calc(100vh - 200px)' }}>

        {/* إدخال */}
        <div style={{ padding: 40, borderRight: '1px solid #0d0d0d', background: '#050505' }}>

          <div style={{ border: '1.5px dashed', borderRadius: 12, padding: 20, cursor: 'pointer', marginBottom: 20, borderColor: image ? '#00d4ff' : '#222', background: image ? 'rgba(0,212,255,0.05)' : '#0a0a0a' }}
            onClick={() => fileRef.current.click()}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImage(e.target.files[0])} />
            {image ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={URL.createObjectURL(image)} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                <div>
                  <p style={{ color: '#00d4ff', fontSize: 13 }}>✓ {image.name}</p>
                  <p style={{ color: '#555', fontSize: 11 }}>اضغط لتغيير الصورة</p>
                </div>
                <button onClick={e => { e.stopPropagation(); setImage(null) }}
                  style={{ marginRight: 'auto', background: 'none', border: 'none', color: '#555', fontSize: 18, cursor: 'pointer' }}>✕</button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>📎</p>
                <p style={{ color: '#555', fontSize: 13 }}>ارفع صورة للإلهام</p>
              </div>
            )}
          </div>

          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, color: '#555' }}>صف تصميمك</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="مثال: فستان سهرة حمراء بأكمام طويلة..."
            className="input input-dark"
            rows={5}
            style={{ resize: 'none', marginBottom: 16, borderRadius: 8 }}
          />

          <p style={{ fontSize: 12, color: '#333', marginBottom: 10 }}>💡 اقتراحات:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => setPrompt(s)}
                style={{ padding: '6px 12px', background: 'transparent', border: `1px solid ${prompt === s ? '#00d4ff' : '#1a1a1a'}`, borderRadius: 50, cursor: 'pointer', fontSize: 11, color: prompt === s ? '#00d4ff' : '#555' }}>
                {s}
              </button>
            ))}
          </div>

          {error && <p className="msg-error" style={{ marginBottom: 12 }}>{error}</p>}

          <button onClick={generate} className="btn btn-cyan"
            style={{ width: '100%', padding: 16, fontSize: 15, letterSpacing: 2 }}
            disabled={loading || !prompt.trim()}>
            {loading ? '⏳ جاري التوليد...' : '✨ ولّد التصميم'}
          </button>

          {history.length > 0 && (
            <div style={{ marginTop: 28, borderTop: '1px solid #0d0d0d', paddingTop: 20 }}>
              <p style={{ fontSize: 11, color: '#333', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>🕐 آخر الطلبات</p>
              {history.map((h, i) => (
                <div key={i} onClick={() => setPrompt(h.prompt)}
                  style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #0a0a0a', cursor: 'pointer' }}>
                  <span style={{ flex: 1, fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.prompt}</span>
                  <span style={{ fontSize: 10, color: '#333' }}>{h.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* نتيجة */}
        <div style={{ padding: '40px 48px', background: '#000' }}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div className="spinner" style={{ borderTopColor: '#00d4ff', width: 48, height: 48 }} />
              <p style={{ color: '#555', marginTop: 20, fontSize: 14 }}>الذكاء الاصطناعي يرسم تصميمك...</p>
            </div>
          )}

          {!loading && images.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div style={{ fontSize: 64, opacity: 0.1 }}>✨</div>
              <p style={{ color: '#333', fontSize: 14, marginTop: 16, letterSpacing: 2, textTransform: 'uppercase' }}>نتيجة التصميم ستظهر هنا</p>
            </div>
          )}

          {!loading && images.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: '#fff', letterSpacing: 3 }}>
                  {images.length === 1 ? '✦ تصميمك الجديد' : `✦ ${images.length} تنويعات`}
                </h3>
                <span className="badge badge-cyan">جاهز</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(180px,1fr))', gap: 12 }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setSelected(img)}
                    style={{ cursor: 'pointer', borderRadius: 12, overflow: 'hidden', background: '#0d0d0d', border: selected === img ? '2px solid #00d4ff' : '2px solid #1a1a1a' }}>
                    <img src={img} alt={`تصميم ${i+1}`} style={{ width: '100%', borderRadius: 10, display: 'block' }} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                {selected && (
                  <a href={selected} download="design.png" className="btn btn-white" style={{ flex: 1, textAlign: 'center', fontSize: 13 }}>⬇️ تحميل</a>
                )}
                <button className="btn btn-cyan" style={{ flex: 1, fontSize: 13 }} onClick={() => alert('تم الحفظ ✅')}>💾 حفظ</button>
                <button className="btn btn-outline-white" style={{ flex: 1, fontSize: 13 }} onClick={generate}>🔄 جديد</button>
              </div>

              <div style={{ marginTop: 20, padding: 16, background: '#0a0a0a', borderRadius: 8, border: '1px solid #111' }}>
                <p style={{ fontSize: 11, color: '#333', letterSpacing: 1, marginBottom: 6 }}>PROMPT USED:</p>
                <p style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>{prompt}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}