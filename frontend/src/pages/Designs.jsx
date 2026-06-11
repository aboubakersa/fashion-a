import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDesigns } from '../services/designService'

const FILTERS = ['الكل', 'فساتين', 'عبايات', 'قمصان', 'بناطيل', 'إكسسوار']

const SAMPLE_DESIGNS = [
  { id:1, title:'GOLDEN EVENING',  description:'فستان سهرة ذهبي فاخر',    price:450, image:null, likes:124, rating:5 },
  { id:2, title:'CLASSIC ABAYA',   description:'عباءة كلاسيكية أنيقة',    price:380, image:null, likes:98,  rating:4 },
  { id:3, title:'URBAN SHIRT',     description:'قميص عصري كاجوال',        price:120, image:null, likes:67,  rating:5 },
  { id:4, title:'SUMMER FLOW',     description:'فستان صيفي خفيف',         price:200, image:null, likes:145, rating:4 },
  { id:5, title:'NIGHT MODE',      description:'إطلالة ليلية جريئة',      price:520, image:null, likes:203, rating:5 },
  { id:6, title:'SILK TOUCH',      description:'قماش حريري ناعم فاخر',    price:680, image:null, likes:89,  rating:4 },
]

export default function Designs() {
  const navigate = useNavigate()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('الكل')
  const [ratings, setRatings] = useState({})
  const [liked,   setLiked]   = useState({})
  const [hovered, setHovered] = useState(null)
  const [sort,    setSort]    = useState('newest')

  useEffect(() => {
    getDesigns()
      .then(setDesigns)
      .catch(() => setDesigns(SAMPLE_DESIGNS))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: 64 }}>

      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        <div>
          <p className="section-tag">المجموعة الكاملة</p>
          <h1 style={styles.headerTitle}>THE COLLECTION</h1>
        </div>
        <div style={styles.headerRight}>
          <p style={styles.headerCount}>{designs.length} تصميم</p>
          {/* ترتيب */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="newest">الأحدث</option>
            <option value="price_asc">السعر: الأقل</option>
            <option value="price_desc">السعر: الأعلى</option>
            <option value="popular">الأكثر إعجاباً</option>
          </select>
        </div>
      </div>

      {/* ===== فلتر ===== */}
      <div style={styles.filterBar}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterBtn,
              background:   filter === f ? '#fff' : 'transparent',
              color:        filter === f ? '#000' : '#555',
              borderColor:  filter === f ? '#fff' : '#222',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ===== شبكة التصاميم ===== */}
      <div style={styles.grid}>
        {designs.map((d, i) => (
          <div
            key={d.id}
            style={{
              ...styles.card,
              gridRow: i % 5 === 0 ? 'span 2' : 'span 1',
            }}
            onMouseEnter={() => setHovered(d.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* صورة */}
            <div style={{
              ...styles.imgBox,
              aspectRatio: i % 5 === 0 ? '3/5' : '3/4',
            }}>
              {d.image ? (
                <img src={d.image} alt={d.title} style={styles.img} />
              ) : (
                <div style={styles.imgPlaceholder}>
                  <span style={{ fontSize: i % 5 === 0 ? 100 : 64, opacity: 0.15 }}>👗</span>
                  {/* خلفية متدرجة */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}22, #00000099)`,
                  }} />
                </div>
              )}

              {/* overlay عند hover */}
              <div style={{
                ...styles.overlay,
                opacity: hovered === d.id ? 1 : 0,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <button
                    onClick={() => navigate('/customize', { state: { design: d } })}
                    className="btn btn-white"
                    style={{ fontSize: 12, padding: '10px 28px' }}
                  >
                    اطلب الآن
                  </button>
                  <button
                    className="btn btn-outline-white"
                    style={{ fontSize: 12, padding: '8px 28px' }}
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>

              {/* شارة */}
              {i < 3 && (
                <span className="badge badge-cyan" style={{ position: 'absolute', top: 14, right: 14 }}>
                  {i === 0 ? 'الأكثر مبيعاً' : i === 1 ? 'جديد' : 'مميز'}
                </span>
              )}

              {/* إعجاب */}
              <button
                onClick={() => setLiked(prev => ({ ...prev, [d.id]: !prev[d.id] }))}
                style={{
                  ...styles.likeBtn,
                  color: liked[d.id] ? '#ff4444' : '#666',
                  transform: liked[d.id] ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                {liked[d.id] ? '♥' : '♡'}
              </button>
            </div>

            {/* معلومات */}
            <div style={styles.info}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <h3 style={styles.designTitle}>{d.title}</h3>
                <p style={styles.price}>{d.price} <span style={{ fontSize: 12, color: '#555' }}>ر.س</span></p>
              </div>

              <p style={styles.designDesc}>{d.description}</p>

              {/* تقييم + إعجابات */}
              <div style={styles.bottomRow}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s}
                      onClick={() => setRatings(prev => ({ ...prev, [d.id]: s }))}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: s <= (ratings[d.id] || d.rating || 0) ? '#fff' : '#333',
                        fontSize: 13, padding: '0 1px',
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: '#444', letterSpacing: 1 }}>
                  {(liked[d.id] ? d.likes + 1 : d.likes)} ♥
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== تحميل المزيد ===== */}
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <button className="btn btn-outline-white" style={{ fontSize: 13, padding: '14px 48px' }}>
          تحميل المزيد
        </button>
      </div>

      <style>{`
        .design-card:hover .design-img img { transform: scale(1.05); }
      `}</style>
    </div>
  )
}

const styles = {
  header:       { padding: '80px 80px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle:  { fontFamily: "'Bebas Neue',sans-serif", fontSize: 80, color: '#fff', letterSpacing: 4, lineHeight: 1 },
  headerRight:  { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 },
  headerCount:  { color: '#444', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' },
  sortSelect:   {
    background: '#111', border: '1px solid #222', color: '#888',
    padding: '8px 16px', borderRadius: 4, fontSize: 13,
    outline: 'none', cursor: 'pointer',
  },
  filterBar:    { display: 'flex', gap: 8, padding: '0 80px 48px', flexWrap: 'wrap' },
  filterBtn:    {
    padding: '9px 24px', borderRadius: 50,
    border: '1px solid', fontSize: 13, fontWeight: 600,
    letterSpacing: 1, textTransform: 'uppercase',
    transition: 'all 0.2s', cursor: 'pointer',
  },
  grid:         { padding: '0 80px 80px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3 },
  card:         { position: 'relative', background: '#080808', overflow: 'hidden' },
  imgBox:       { position: 'relative', overflow: 'hidden', background: '#0d0d0d' },
  imgPlaceholder:{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 200 },
  img:          { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' },
  overlay:      {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'opacity 0.3s ease',
    backdropFilter: 'blur(4px)',
  },
  likeBtn:      {
    position: 'absolute', top: 14, left: 14,
    background: 'rgba(0,0,0,0.5)', border: 'none',
    width: 36, height: 36, borderRadius: '50%',
    fontSize: 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s', backdropFilter: 'blur(4px)',
  },
  info:         { padding: '18px 20px 22px' },
  designTitle:  { fontFamily: "'Bebas Neue',sans-serif", fontSize: 19, color: '#fff', letterSpacing: 2 },
  designDesc:   { color: '#444', fontSize: 12, marginBottom: 12, lineHeight: 1.5 },
  price:        { fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: '#fff', letterSpacing: 1, whiteSpace: 'nowrap' },
  bottomRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
}
