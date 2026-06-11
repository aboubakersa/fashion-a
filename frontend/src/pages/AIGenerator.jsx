import React, { useState, useRef } from 'react'
import API from '../services/api'

const SUGGESTIONS = [
  'فستان سهرة أزرق ملكي بتطريز ذهبي عند الخصر',
  'عباءة سوداء عصرية بتفاصيل فضية',
  'قميص كاجوال بنقشة هندسية ألوان محايدة',
  'بدلة رسمية رمادية داكنة بقصة حديثة',
  'فستان صيفي قصير بألوان استوائية زاهية',
  'تصميم خليجي فاخر بقماش حرير وزخارف تقليدية',
]

export default function AIGenerator() {
  const [prompt,    setPrompt]    = useState('')
  const [images,    setImages]    = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [mode,      setMode]      = useState('single')
  const [selected,  setSelected]  = useState(null)
  const [image,     setImage]     = useState(null)
  const [history,   setHistory]   = useState([])
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
      const imgs = res.data.images || [res.data.image_url]
      setImages(imgs.filter(Boolean))
    } catch {
      setError('تأكد من إعداد مفتاح API في settings.py')
      setImages(['https://via.placeholder.com/400x400/0d0d0d/00d4ff?text=تصميم+AI'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: 64 }}>

      <div style={styles.header}>
        <p className="section-tag">مولّد التصاميم</p>
        <h1 style={styles.headerTitle}>AI GENERATOR</h1>
        <p style={styles.headerSub}>صف فكرتك أو ارفع صورة — والذكاء الاصطناعي يبدع</p>
      </div>

      <div style={styles.layout}>

        <div style={styles.inputSide}>

          <div style={styles.modeRow}>
            {[['single', 'تصميم واحد'], ['variations', '٣ تنويعات']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setMode(val)}
                style={{
                  ...styles.modeBtn,
                  background:  mode === val ? '#fff' : 'transparent',
                  color:       mode === val ? '#000' : '#555',
                  borderColor: mode === val ? '#fff' : '#222',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            onClick={() => fileRef.current.click()}
            style={{
              ...styles.uploadBox,
              borderColor: image ? '#00d4ff' : '#222',
              background:  image ? 'rgba(0,212,255,0.05)' : '#0a0a0a',
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => setImage(e.target.files[0])}
            />
            {image ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                />
                <div>
                  <p style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600 }}>✓ {image.name}</p>
                  <p style={{ color: '#555', fontSize: 11 }}>اضغط لتغيير الصورة</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setImage(null) }}
                  style={{ marginRight: 'auto', background: 'none', border: 'none', color: '#555', fontSize: 18, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>📎</p>
                <p style={{ color: '#555', fontSize: 13 }}>ارفع صورة للإلهام</p>
                <p style={{ color: '#333', fontSize: 11, marginTop: 4 }}>PNG, JPG حتى 10MB</p>
              </div>
            )}
          </div>

          <label style={styles.label}>صف تصميمك</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.ctrlKey && generate()}
            placeholder="مثال: فستان سهرة حمراء بأكمام طويلة وفتحة خلفية أنيقة..."
            className="input input-dark"
            rows={5}
            style={{ resize: 'none', marginBottom: 16, borderRadius: 8 }}
          />

          <p style={styles.suggestLabel}>💡 جرّب هذه الأفكار:</p>
          <div style={styles.suggestions}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                style={{
                  ...styles.suggestion,
                  borderColor: prompt === s ? '#00d4ff' : '#1a1a1a',
                  color:       prompt === s ? '#00d4ff' : '#555',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {error && <p className="msg-error" style={{ marginBottom: 12 }}>{error}</p>}

          <button
            onClick={generate}
            className="btn btn-cyan"
            style={{ width: '100%', padding: '16px', fontSize: 15, letterSpacing: 2, marginTop: 4 }}
            disabled={loading || !prompt.trim()}
          >
            {loading ? '⏳ جاري التوليد...' : '✨ ولّد التصميم'}
          </button>

          <p style={styles.hint}>Ctrl + Enter للتوليد السريع</p>

          {history.length > 0 && (
            <div style={styles.historyBox}>
              <p style={styles.historyTitle}>🕐 آخر الطلبات</p>
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => setPrompt(h.prompt)}
                  style={styles.historyItem}
                >
                  <span style={{ flex: 1, fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.prompt}
                  </span>
                  <span style={{ fontSize: 10, color: '#333' }}>{h.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.resultSide}>

          {loading && (
            <div style={styles.loadingBox}>
              <div style={styles.loadingRing}>
                <div className="spinner" style={{ borderTopColor: '#00d4ff', width: 48, height: 48 }} />
              </div>
              <p style={{ color: '#555', marginTop: 20, fontSize: 14 }}>الذكاء الاصطناعي يرسم تصميمك...</p>
              <p style={{ color: '#333', fontSize: 12, marginTop: 8 }}>قد يستغرق حتى 30 ثانية</p>
            </div>
          )}

          {!loading && images.length === 0 && (
            <div style={styles.placeholder}>
              <div style={styles.placeholderIcon}>✨</div>
              <p style={{ color: '#333', fontSize: 14, marginTop: 16, letterSpacing: 2, textTransform: 'uppercase' }}>
                نتيجة التصميم ستظهر هنا
              </p>
              <p style={{ color: '#222', fontSize: 12, marginTop: 8 }}>اكتب وصفاً وانتظر الإبداع</p>
            </div>
          )}

          {!loading && images.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={styles.resultTitle}>
                  {images.length === 1 ? '✦ تصميمك الجديد' : `✦ ${images.length} تنويعات`}
                </h3>
                <span className="badge badge-cyan">جاهز</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(180px,1fr))',
                gap: 12,
              }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelected(img)}
                    style={{
                      ...styles.resultCard,
                      border: selected === img ? '2px solid #00d4ff' : '2px solid #1a1a1a',
                      boxShadow: selected === img ? '0 0 20px rgba(0,212,255,0.2)' : 'none',
                    }}
                  >
                    <img
                      src={img}
                      alt={`تصميم ${i+1}`}
                      style={{ width: '100%', borderRadius: 10, display: 'block' }}
                    />
                    {images.length > 1 && (
                      <p style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#555' }}>
                        تنويع {i+1}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div style={styles.actionBtns}>
                {selected && (
                  <a
                    href={selected}
                    download="fashion-design.png"
                    className="btn btn-white"
                    style={{ flex: 1, textAlign: 'center', fontSize: 13 }}
                  >
                    ⬇️ تحميل
                  </a>
                )}
                <button
                  className="btn btn-cyan"
                  style={{ flex: 1, fontSize: 13 }}
                  onClick={() => alert('سيتم حفظ التصميم في مجموعتك ✅')}
                >
                  💾 حفظ في تصاميمي
                </button>
                <button
                  className="btn btn-outline-white"
                  style={{ flex: 1, fontSize: 13 }}
                  onClick={generate}
                >
                  🔄 توليد جديد
                </button>
              </div>

              <div style={styles.promptUsed}>
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

const styles = {
  header:      { padding: '60px 80px 48px', borderBottom: '1px solid #0d0d0d' },
  headerTitle: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: '#fff', letterSpacing: 4, lineHeight: 1 },
  headerSub:   { color: '#555', fontSize: 15, marginTop: 8 },
  layout:      { display: 'grid', gridTemplateColumns: '420px 1fr', gap: 0, minHeight: 'calc(100vh - 200px)' },
  inputSide:   { padding: '40px', borderRight: '1px solid #0d0d0d', background: '#050505' },
  modeRow:     { display: 'flex', gap: 8, marginBottom: 24 },
  modeBtn:     { flex: 1, padding: '10px 0', borderRadius: 50, border: '1px solid', fontSize: 13, fontWeight: 600, letterSpacing: 1, transition: 'all 0.2s', cursor: 'pointer' },
  uploadBox:   { border: '1.5px dashed', borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'all 0.2s', marginBottom: 20 },
  label:       { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, color: '#555' },
  suggestLabel:{ fontSize: 12, color: '#333', marginBottom: 10, letterSpacing: 1 },
  suggestions: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  suggestion:  { padding: '6px 12px', background: 'transparent', border: '1px solid', borderRadius: 50, cursor: 'pointer', fontSize: 11, color: '#555', transition: 'all 0.2s', lineHeight: 1.4 },
  hint:        { fontSize: 11, color: '#222', textAlign: 'center', marginTop: 10, letterSpacing: 1 },
  historyBox:  { marginTop: 28, borderTop: '1px solid #0d0d0d', paddingTop: 20 },
  historyTitle:{ fontSize: 11, color: '#333', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  historyItem: { display: 'flex', gap: 8, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #0a0a0a', cursor: 'pointer', transition: 'all 0.2s' },
  resultSide:   { padding: '40px 48px', background: '#000' },
  loadingBox:   { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' },
  loadingRing:  { position: 'relative' },
  placeholder:  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' },
  placeholderIcon: { fontSize: 64, opacity: 0.1 },
  resultTitle:  { fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: '#fff', letterSpacing: 3 },
  resultCard:   { cursor: 'pointer', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s', background: '#0d0d0d' },
  actionBtns:   { display: 'flex', gap: 10, marginTop: 24 },
  promptUsed:   { marginTop: 20, padding: 16, background: '#0a0a0a', borderRadius: 8, border: '1px solid #111' },
}
