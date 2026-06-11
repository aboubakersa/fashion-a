// ==================================================
//  pages/AdminDashboard.jsx
//  لوحة تحكم المدير — إحصائيات + تقارير
// ==================================================
import React, { useState, useEffect } from 'react'
import API from '../services/api'

const STATUS_MAP = {
  pending:   { label: 'انتظار', color: '#f39c12' },
  confirmed: { label: 'مؤكد',   color: '#3498db' },
  shipped:   { label: 'شحن',    color: '#9b59b6' },
  delivered: { label: 'مُسلَّم', color: '#27ae60' },
  cancelled: { label: 'ملغي',   color: '#e74c3c' },
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('overview')

  useEffect(() => {
    API.get('/auth/admin/stats/')
      .then(r => setStats(r.data))
      .catch(() => setStats(SAMPLE_STATS))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-center"><div className="spinner" /></div>

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>لوحة التحكم</h1>
          <p style={styles.sub}>مرحباً بك — إليك ملخص اليوم</p>
        </div>
        <div style={styles.tabs}>
          {[['overview','نظرة عامة'], ['orders','الطلبات'], ['reports','التقارير']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="btn"
              style={{ ...styles.tab, background: tab === key ? '#0a0a0a' : '#fff', color: tab === key ? '#fff' : '#333' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' && <OverviewTab stats={stats} />}
      {tab === 'orders'   && <OrdersTab   stats={stats} />}
      {tab === 'reports'  && <ReportsTab  stats={stats} />}
    </div>
  )
}

// ===== تبويب نظرة عامة =====
function OverviewTab({ stats }) {
  const cards = [
    { label: 'إجمالي المستخدمين', value: stats.overview.total_users,   sub: `+${stats.overview.new_users_30} هذا الشهر`, icon: '👥', color: '#3498db' },
    { label: 'إجمالي الطلبات',    value: stats.overview.total_orders,  sub: `+${stats.overview.new_orders_7} هذا الأسبوع`, icon: '📦', color: '#27ae60' },
    { label: 'الإيرادات الكلية',  value: `${stats.overview.total_revenue} ر.س`, sub: `${stats.overview.revenue_30} ر.س هذا الشهر`, icon: '💰', color: '#c9a84c' },
    { label: 'التصاميم المنشورة', value: stats.overview.total_designs, sub: 'تصميم نشط', icon: '👗', color: '#9b59b6' },
  ]

  return (
    <div>
      {/* بطاقات الإحصائيات */}
      <div style={styles.statsGrid}>
        {cards.map((c, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: c.color + '20', color: c.color }}>
              {c.icon}
            </div>
            <div>
              <p style={styles.statValue}>{c.value}</p>
              <p style={styles.statLabel}>{c.label}</p>
              <p style={styles.statSub}>{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.row}>
        {/* مبيعات آخر 7 أيام */}
        <div style={{ ...styles.card, flex: 2 }}>
          <h3 style={styles.cardTitle}>📈 المبيعات — آخر 7 أيام</h3>
          <div style={styles.chart}>
            {stats.daily_sales.slice().reverse().map((d, i) => {
              const maxRevenue = Math.max(...stats.daily_sales.map(s => s.revenue), 1)
              const height = (d.revenue / maxRevenue) * 100
              return (
                <div key={i} style={styles.barWrap}>
                  <span style={styles.barValue}>{d.revenue > 0 ? d.revenue : ''}</span>
                  <div style={{ ...styles.bar, height: `${Math.max(height, 4)}%`, background: height > 50 ? '#c9a84c' : '#e8d5a3' }} />
                  <span style={styles.barLabel}>{d.date.slice(5)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* الطلبات حسب الحالة */}
        <div style={{ ...styles.card, flex: 1 }}>
          <h3 style={styles.cardTitle}>📊 الطلبات حسب الحالة</h3>
          {Object.entries(stats.orders_by_status).map(([status, count]) => (
            <div key={status} style={styles.statusRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_MAP[status]?.color || '#888' }} />
                <span style={{ fontSize: 14 }}>{STATUS_MAP[status]?.label || status}</span>
              </div>
              <span style={{ fontWeight: 600 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* أحدث الطلبات */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>🕐 آخر الطلبات</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>الزبون</th>
              <th style={styles.th}>التصميم</th>
              <th style={styles.th}>الإجمالي</th>
              <th style={styles.th}>الحالة</th>
              <th style={styles.th}>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_orders.map(o => (
              <tr key={o.id} style={styles.tr}>
                <td style={styles.td}>#{o.id}</td>
                <td style={styles.td}>{o.customer}</td>
                <td style={styles.td}>{o.design}</td>
                <td style={{ ...styles.td, color: '#c9a84c', fontWeight: 600 }}>{o.total} ر.س</td>
                <td style={styles.td}>
                  <span style={{ background: (STATUS_MAP[o.status]?.color || '#888') + '20', color: STATUS_MAP[o.status]?.color || '#888', padding: '3px 10px', borderRadius: 12, fontSize: 12 }}>
                    {STATUS_MAP[o.status]?.label || o.status}
                  </span>
                </td>
                <td style={{ ...styles.td, color: '#aaa' }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ===== تبويب الطلبات =====
function OrdersTab({ stats }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>📦 أكثر التصاميم مبيعاً</h3>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>التصميم</th>
            <th style={styles.th}>عدد الطلبات</th>
            <th style={styles.th}>الإيرادات</th>
          </tr>
        </thead>
        <tbody>
          {stats.top_designs.map((d, i) => (
            <tr key={i} style={styles.tr}>
              <td style={styles.td}>{d.design__title}</td>
              <td style={{ ...styles.td, fontWeight: 600 }}>{d.count}</td>
              <td style={{ ...styles.td, color: '#c9a84c', fontWeight: 600 }}>{d.revenue} ر.س</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===== تبويب التقارير =====
function ReportsTab({ stats }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📋 ملخص التقرير الشهري</h3>
        <div style={styles.reportGrid}>
          <div style={styles.reportCard}>
            <p style={styles.reportNum}>{stats.overview.new_users_30}</p>
            <p style={styles.reportLabel}>مستخدم جديد</p>
          </div>
          <div style={styles.reportCard}>
            <p style={styles.reportNum}>{stats.overview.new_orders_7}</p>
            <p style={styles.reportLabel}>طلب هذا الأسبوع</p>
          </div>
          <div style={styles.reportCard}>
            <p style={styles.reportNum}>{stats.overview.revenue_30} ر.س</p>
            <p style={styles.reportLabel}>إيرادات هذا الشهر</p>
          </div>
          <div style={styles.reportCard}>
            <p style={styles.reportNum}>{stats.overview.total_designs}</p>
            <p style={styles.reportLabel}>تصميم منشور</p>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>💹 المبيعات اليومية</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>التاريخ</th>
              <th style={styles.th}>عدد الطلبات</th>
              <th style={styles.th}>الإيرادات</th>
            </tr>
          </thead>
          <tbody>
            {stats.daily_sales.map((d, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>{d.date}</td>
                <td style={styles.td}>{d.orders}</td>
                <td style={{ ...styles.td, color: '#c9a84c', fontWeight: 600 }}>{d.revenue} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// بيانات تجريبية
const SAMPLE_STATS = {
  overview: { total_users: 124, new_users_30: 18, total_orders: 87, new_orders_7: 12, total_revenue: 45600, revenue_30: 8900, total_designs: 34 },
  orders_by_status: { pending: 15, confirmed: 8, shipped: 5, delivered: 54, cancelled: 5 },
  daily_sales: Array.from({length:7}, (_, i) => ({
    date: new Date(Date.now() - i*86400000).toISOString().slice(0,10),
    revenue: Math.floor(Math.random() * 3000),
    orders: Math.floor(Math.random() * 10)
  })),
  top_designs: [
    { design__title: 'فستان سهرة ذهبي', count: 23, revenue: 10350 },
    { design__title: 'عباءة كلاسيكية',   count: 18, revenue: 6840 },
    { design__title: 'قميص كاجوال',       count: 15, revenue: 1800 },
  ],
  recent_orders: Array.from({length:8}, (_, i) => ({
    id: 100+i, customer: `user${i}@email.com`, design: 'فستان سهرة',
    total: (Math.random()*500+100).toFixed(0), status: ['pending','delivered','shipped','confirmed'][i%4],
    date: new Date(Date.now()-i*86400000).toISOString().slice(0,10)
  }))
}

const styles = {
  page:       { padding: '40px 60px', maxWidth: 1200, margin: '0 auto' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 },
  title:      { fontFamily: "'Playfair Display',serif", fontSize: 38, marginBottom: 6 },
  sub:        { color: '#888' },
  tabs:       { display: 'flex', gap: 10 },
  tab:        { padding: '10px 22px', borderRadius: 10, border: '1.5px solid #ddd', cursor: 'pointer', fontSize: 14 },
  statsGrid:  { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 28 },
  statCard:   { background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', gap: 16, alignItems: 'center' },
  statIcon:   { width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
  statValue:  { fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, marginBottom: 2 },
  statLabel:  { fontSize: 13, color: '#888', marginBottom: 2 },
  statSub:    { fontSize: 11, color: '#c9a84c' },
  row:        { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 },
  card:       { background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: 20 },
  cardTitle:  { fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 20 },
  chart:      { display: 'flex', alignItems: 'flex-end', gap: 10, height: 160, padding: '0 8px' },
  barWrap:    { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' },
  bar:        { width: '100%', borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease', minHeight: 4 },
  barLabel:   { fontSize: 10, color: '#aaa' },
  barValue:   { fontSize: 10, color: '#888' },
  statusRow:  { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  table:      { width: '100%', borderCollapse: 'collapse' },
  thead:      { background: '#f5f0e8' },
  th:         { padding: '12px 16px', fontSize: 13, fontWeight: 600, textAlign: 'right', color: '#555' },
  tr:         { borderBottom: '1px solid #f5f5f5' },
  td:         { padding: '12px 16px', fontSize: 14, color: '#444' },
  reportGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 },
  reportCard: { background: '#f5f0e8', borderRadius: 14, padding: 20, textAlign: 'center' },
  reportNum:  { fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#c9a84c', marginBottom: 6 },
  reportLabel:{ fontSize: 13, color: '#888' },
}