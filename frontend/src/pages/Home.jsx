import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const cursorRef    = useRef()
  const followerRef  = useRef()

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 6 + 'px'
        cursorRef.current.style.top  = e.clientY - 6 + 'px'
      }
      if (followerRef.current) {
        followerRef.current.style.left = e.clientX - 20 + 'px'
        followerRef.current.style.top  = e.clientY - 20 + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* كيرسور مخصص */}
      <div ref={cursorRef} style={cursorStyles.dot} />
      <div ref={followerRef} style={cursorStyles.ring} />

      {/* ===== HERO ===== */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />

        <div style={styles.heroContent}>
          <p className="fade-up section-tag">الذكاء الاصطناعي في خدمة الموضة</p>

          <h1 className="fade-up-2" style={styles.heroTitle}>
            صمّم<br />
            ملابسك<br />
            <span style={styles.heroTitleOutline}>بالـ AI</span>
          </h1>

          <p className="fade-up-3" style={styles.heroSub}>
            أرسل فكرتك أو صورتك — وشاهد الذكاء الاصطناعي<br />
            يحوّلها إلى تصميم احترافي في ثوانٍ.
          </p>

          <div className="fade-up-4" style={styles.heroBtns}>
            <Link to="/ai"      className="btn btn-white"         style={{ fontSize: 14, padding: '15px 44px' }}>ابدأ التصميم</Link>
            <Link to="/designs" className="btn btn-outline-white" style={{ fontSize: 14, padding: '15px 44px' }}>تصفح المجموعة</Link>
          </div>

          {/* إحصائيات صغيرة */}
          <div className="fade-up-5" style={styles.heroStats}>
            {[['10K+', 'تصميم'], ['5K+', 'زبون'], ['99%', 'رضا']].map(([n, l]) => (
              <div key={l} style={styles.heroStat}>
                <span style={styles.heroStatNum}>{n}</span>
                <span style={styles.heroStatLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* الروبوت */}
        <div style={styles.robotBox}>
          <div style={styles.robotGlow} />
          <img
            src="/logo.png"
            alt="robot"
            style={styles.robotImg}
            onError={e => { e.target.style.display = 'none' }}
          />
          <div style={styles.robotEmoji}>🤖</div>
        </div>

        {/* نص جانبي */}
        <div style={styles.sideText}>FASHION AI 2026</div>

        {/* سهم أسفل */}
        <div style={styles.scrollHint}>
          <div style={styles.scrollLine} />
          <span style={styles.scrollText}>SCROLL</span>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div style={styles.marqueeBar}>
        <div className="marquee-inner">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} style={styles.marqueeItem}>
              FASHION AI
              <span style={{ color: '#00d4ff', margin: '0 16px' }}>✦</span>
              DESIGN WITH AI
              <span style={{ color: '#00d4ff', margin: '0 16px' }}>✦</span>
              صمّم بذكاء
              <span style={{ color: '#00d4ff', margin: '0 16px' }}>✦</span>
              YOUR STYLE YOUR WAY
              <span style={{ color: '#00d4ff', margin: '0 16px' }}>✦ </span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p className="section-tag">كيف يعمل</p>
          <h2 className="section-title-big" style={{ color: '#fff' }}>HOW IT WORKS</h2>
          <p style={{ color: '#555', marginTop: 12, fontSize: 15 }}>ثلاث خطوات من الفكرة للتصميم الكامل</p>
        </div>

        <div style={styles.stepsGrid}>
          {[
            {
              num: '01', icon: '🤖',
              title: 'AI GENERATION',
              desc: 'صف تصميمك أو ارفع صورة للإلهام — Claude يفهم طلبك ويحوله لـ prompt احترافي يُنتج تصميمك في ثوانٍ.',
            },
            {
              num: '02', icon: '🧵',
              title: 'CUSTOM MATERIALS',
              desc: 'اختر نوع القماش، الخيط، طريقة الخياطة والألوان — كل خيار يضيفه المدير خصيصاً لموقعك.',
            },
            {
              num: '03', icon: '📋',
              title: 'INSTANT INVOICE',
              desc: 'فاتورة ضريبية كاملة تظهر فوراً في الموقع وتُرسل على إيميلك — شفافية تامة في كل طلب.',
            },
          ].map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepLine} />
              <span style={styles.stepNum}>{s.num}</span>
              <span style={styles.stepIcon}>{s.icon}</span>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
              <div style={styles.stepArrow}>→</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== AI CHAT PREVIEW ===== */}
      <section style={styles.aiSection}>
        <div style={styles.aiLeft}>
          <p className="section-tag">جرّب الآن</p>
          <h2 className="section-title-big" style={{ color: '#fff', marginBottom: 20 }}>
            DESIGN WITH<br />
            <span style={{ color: '#00d4ff' }}>AI POWER</span>
          </h2>
          <p style={{ color: '#555', fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
            أرسل وصفاً أو صورة للإلهام — Claude يفهم طلبك ويحوله لتصميم احترافي.<br />
            يدعم العربية والإنجليزية بالكامل.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/ai" className="btn btn-cyan" style={{ fontSize: 14 }}>جرّب الآن مجاناً</Link>
            <Link to="/register" className="btn btn-outline-white" style={{ fontSize: 14 }}>أنشئ حساباً</Link>
          </div>
        </div>

        {/* محادثة وهمية */}
        <div style={styles.chatBox}>
          <div style={styles.chatHeader}>
            <div style={styles.chatDot} />
            <span style={styles.chatTitle}>Fashion AI Assistant</span>
            <span style={{ marginRight: 'auto', fontSize: 11, color: '#00d4ff' }}>● online</span>
          </div>

          {[
            { role: 'ai',   text: 'أهلاً! صف لي التصميم الذي تريده وسأحوله لتصميم احترافي فوراً ✨' },
            { role: 'user', text: 'أريد فستان سهرة أزرق بتطريز ذهبي' },
            { role: 'ai',   text: 'جاري التوليد... ✦ تصميمك جاهز! فستان سهرة أزرق ملكي، تطريز ذهبي عند الخصر والأطراف 💫' },
          ].map((m, i) => (
            <div key={i} style={{ ...styles.chatMsg, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={styles.chatAvatar}>{m.role === 'ai' ? '🤖' : '👤'}</div>
              <div style={m.role === 'user' ? styles.bubbleUser : styles.bubbleAI}>
                {m.text}
              </div>
            </div>
          ))}

          {/* صورة وهمية للنتيجة */}
          <div style={styles.chatResult}>
            <span style={{ fontSize: 32 }}>👗</span>
            <div>
              <p style={{ color: '#00d4ff', fontSize: 12, letterSpacing: 2, marginBottom: 4 }}>✓ تصميمك جاهز</p>
              <p style={{ color: '#555', fontSize: 11 }}>اضغط للتحميل أو الطلب</p>
            </div>
          </div>

          <div style={styles.chatInputRow}>
            <input
              readOnly
              placeholder="صف تصميمك هنا..."
              style={{ flex: 1, background: '#1a1a1a', border: '1px solid #222', borderRadius: 50, padding: '10px 16px', color: '#fff', fontSize: 13, outline: 'none' }}
            />
            <button style={{ width: 38, height: 38, borderRadius: '50%', background: '#00d4ff', border: 'none', color: '#000', fontSize: 16, cursor: 'pointer' }}>↑</button>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={styles.statsSection}>
        {[
          { num: '10K+', label: 'تصميم مُولَّد',  icon: '👗' },
          { num: '5K+',  label: 'زبون راضٍ',      icon: '😊' },
          { num: '99%',  label: 'نسبة الرضا',     icon: '⭐' },
          { num: '24/7', label: 'دعم متواصل',     icon: '🛎️' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <span style={styles.statIcon}>{s.icon}</span>
            <p style={styles.statNum}>{s.num}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* ===== CTA ===== */}
      <section style={styles.cta}>
        <div style={styles.ctaGlow} />
        <p className="section-tag" style={{ justifyContent: 'center' }}>ابدأ اليوم</p>
        <h2 style={styles.ctaTitle}>
          READY TO<br />CREATE?
        </h2>
        <p style={{ color: '#555', fontSize: 16, marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>
          انضم لآلاف المصممين الذين يستخدمون الذكاء الاصطناعي لإنشاء ملابسهم
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-white"   style={{ fontSize: 15, padding: '16px 56px' }}>ابدأ مجاناً</Link>
          <Link to="/designs"  className="btn btn-outline-white" style={{ fontSize: 15, padding: '16px 40px' }}>تصفح التصاميم</Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div>
            <p style={styles.footerLogo}>تصميمك<span style={{ color: '#00d4ff' }}>.</span></p>
            <p style={{ color: '#444', fontSize: 13, marginTop: 8, maxWidth: 280, lineHeight: 1.6 }}>
              منصة تصميم الملابس بالذكاء الاصطناعي — من الفكرة إلى التصميم في ثوانٍ
            </p>
          </div>
          <div style={{ display: 'flex', gap: 60 }}>
            <div>
              <p style={styles.footerGroupTitle}>الموقع</p>
              {[['/', 'الرئيسية'], ['/designs', 'التصاميم'], ['/ai', 'توليد AI']].map(([p, l]) => (
                <Link key={p} to={p} style={styles.footerLink}>{l}</Link>
              ))}
            </div>
            <div>
              <p style={styles.footerGroupTitle}>الحساب</p>
              {[['/login', 'دخول'], ['/register', 'تسجيل'], ['/profile', 'بروفايل']].map(([p, l]) => (
                <Link key={p} to={p} style={styles.footerLink}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={{ color: '#333', fontSize: 12, letterSpacing: 1 }}>© 2026 Fashion AI — جميع الحقوق محفوظة</p>
          <p style={{ color: '#333', fontSize: 12 }}>صُنع بـ ❤️ و 🤖</p>
        </div>
      </footer>

    </div>
  )
}

/* ===== STYLES ===== */
const cursorStyles = {
  dot: {
    width: 10, height: 10, background: '#fff', borderRadius: '50%',
    position: 'fixed', pointerEvents: 'none', zIndex: 9999,
    mixBlendMode: 'difference', transition: 'transform 0.1s',
  },
  ring: {
    width: 38, height: 38, border: '1.5px solid #fff', borderRadius: '50%',
    position: 'fixed', pointerEvents: 'none', zIndex: 9998,
    mixBlendMode: 'difference', transition: 'all 0.12s ease',
  },
}

const styles = {
  hero: {
    height: '100vh', display: 'flex', alignItems: 'center',
    padding: '0 80px', position: 'relative', overflow: 'hidden',
    background: '#000',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 60% 50%, #050d1a 0%, #000 65%)',
  },
  heroContent: { position: 'relative', zIndex: 2, maxWidth: 620 },
  heroTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(72px, 11vw, 140px)',
    color: '#fff', lineHeight: 0.88,
    letterSpacing: -1, marginBottom: 28,
  },
  heroTitleOutline: {
    display: 'block',
    WebkitTextStroke: '2px #fff',
    color: 'transparent',
  },
  heroSub: { color: '#666', fontSize: 17, lineHeight: 1.7, marginBottom: 40 },
  heroBtns: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  heroStats: { display: 'flex', gap: 40, marginTop: 48, paddingTop: 32, borderTop: '1px solid #111' },
  heroStat:  { display: 'flex', flexDirection: 'column', gap: 4 },
  heroStatNum:   { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: '#fff', letterSpacing: 2 },
  heroStatLabel: { fontSize: 11, color: '#555', letterSpacing: 2, textTransform: 'uppercase' },

  robotBox: {
    position: 'absolute', right: 80, bottom: 0,
    width: 400, height: 460,
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  },
  robotGlow: {
    position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
    width: 320, height: 320, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
    animation: 'pulse 3s ease-in-out infinite',
  },
  robotImg: { width: '100%', objectFit: 'contain', animation: 'float 4s ease-in-out infinite' },
  robotEmoji: { fontSize: 160, opacity: 0.15, position: 'absolute', bottom: 20 },

  sideText: {
    position: 'absolute', right: 36, top: '50%',
    transform: 'translateY(-50%) rotate(90deg)',
    fontFamily: "'Bebas Neue',sans-serif",
    fontSize: 11, letterSpacing: 6, color: '#222',
  },
  scrollHint: {
    position: 'absolute', bottom: 36, left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
  },
  scrollLine: { width: 1, height: 56, background: 'linear-gradient(to bottom, transparent, #333)' },
  scrollText: { fontSize: 9, letterSpacing: 4, color: '#333', textTransform: 'uppercase' },

  marqueeBar: {
    background: '#fff', padding: '13px 0',
    overflow: 'hidden', borderTop: '1px solid #eee', borderBottom: '1px solid #eee',
  },
  marqueeItem: {
    fontFamily: "'Bebas Neue',sans-serif",
    fontSize: 17, letterSpacing: 4, color: '#000', paddingRight: 0,
  },

  section: { background: '#000', padding: '100px 80px' },
  sectionHeader: { marginBottom: 64 },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 },
  stepCard: {
    background: '#0a0a0a', padding: '48px 36px',
    border: '1px solid #111', position: 'relative', overflow: 'hidden',
    transition: 'background 0.3s, border-color 0.3s',
  },
  stepLine: {
    position: 'absolute', top: 0, left: 0,
    width: 0, height: 3, background: '#00d4ff',
    transition: 'width 0.4s ease',
  },
  stepNum:   { fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, color: '#1a1a1a', display: 'block', marginBottom: 16 },
  stepIcon:  { fontSize: 32, display: 'block', marginBottom: 16 },
  stepTitle: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: '#fff', letterSpacing: 2, marginBottom: 14 },
  stepDesc:  { color: '#555', fontSize: 14, lineHeight: 1.8 },
  stepArrow: { position: 'absolute', bottom: 28, right: 28, fontSize: 20, color: '#222' },

  aiSection: {
    background: '#050505', padding: '100px 80px',
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 80, alignItems: 'center',
    borderTop: '1px solid #0d0d0d',
  },
  aiLeft: {},
  chatBox: {
    background: '#0d0d0d', border: '1px solid #1a1a1a',
    borderRadius: 20, padding: 28,
  },
  chatHeader: {
    display: 'flex', alignItems: 'center', gap: 10,
    paddingBottom: 20, borderBottom: '1px solid #1a1a1a', marginBottom: 20,
  },
  chatDot:   { width: 10, height: 10, borderRadius: '50%', background: '#00d4ff', animation: 'pulse 2s infinite' },
  chatTitle: { fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#fff' },
  chatMsg:   { display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 },
  chatAvatar:{ width: 30, height: 30, borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  bubbleUser:{ background: '#fff', color: '#000', padding: '10px 14px', borderRadius: '12px 12px 0 12px', fontSize: 13, lineHeight: 1.5, maxWidth: 220 },
  bubbleAI:  { background: '#1a1a1a', color: '#ccc', padding: '10px 14px', borderRadius: '12px 12px 12px 0', fontSize: 13, lineHeight: 1.5, maxWidth: 260, border: '1px solid #222' },
  chatResult:{ background: '#0a1628', border: '1px solid #0d2040', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 },
  chatInputRow:{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 16, borderTop: '1px solid #111' },

  statsSection: {
    background: '#fff', padding: '80px',
    display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
    gap: 0,
  },
  statCard:  { textAlign: 'center', padding: '32px 20px', borderRight: '1px solid #eee' },
  statIcon:  { fontSize: 32, display: 'block', marginBottom: 12 },
  statNum:   { fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, color: '#000', letterSpacing: 2 },
  statLabel: { fontSize: 11, color: '#888', letterSpacing: 3, textTransform: 'uppercase', marginTop: 4 },

  cta: {
    background: '#000', padding: '120px 80px', textAlign: 'center',
    backgroundImage: 'radial-gradient(ellipse at center, #050d1a 0%, #000 70%)',
    position: 'relative', overflow: 'hidden',
  },
  ctaGlow: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
  },
  ctaTitle: {
    fontFamily: "'Bebas Neue',sans-serif",
    fontSize: 'clamp(60px, 10vw, 120px)',
    color: '#fff', letterSpacing: 4,
    lineHeight: 0.9, marginBottom: 28,
    position: 'relative',
  },

  footer: { background: '#000', borderTop: '1px solid #0d0d0d' },
  footerTop: {
    padding: '60px 80px',
    display: 'flex', justifyContent: 'space-between', gap: 40,
    borderBottom: '1px solid #0d0d0d',
  },
  footerLogo:       { fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: '#fff', letterSpacing: 4 },
  footerGroupTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 16 },
  footerLink:       { display: 'block', color: '#555', fontSize: 14, marginBottom: 10, transition: 'color 0.2s', letterSpacing: 0.5 },
  footerBottom: {
    padding: '20px 80px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
}
