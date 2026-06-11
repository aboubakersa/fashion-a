// ==================================================
//  pages/OrderCustomizer.jsx
//  الزبون يختار المواد + فاتورة كاملة
// ==================================================
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../services/api'

export default function OrderCustomizer() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const design    = location.state?.design  // يُمرَّر من صفحة التصاميم

  const [categories, setCategories] = useState([])
  const [selected,   setSelected]   = useState({})   // { category_id: material }
  const [address,    setAddress]    = useState('')
  const [quantity,   setQuantity]   = useState(1)
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [invoice,    setInvoice]    = useState(null)  // الفاتورة النهائية
  const [step,       setStep]       = useState(1)     // 1=اختيار, 2=فاتورة

  useEffect(() => {
    API.get('/designs/materials/')
      .then(r => setCategories(r.data))
      .catch(() => setCategories(SAMPLE_CATEGORIES))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (categoryId, material) => {
    setSelected(prev => ({
      ...prev,
      [categoryId]: prev[categoryId]?.id === material.id ? null : material
    }))
  }

  const selectedMaterials = Object.values(selected).filter(Boolean)

  const designPrice    = (design?.price || 0) * quantity
  const materialsTotal = selectedMaterials.reduce((s, m) => s + parseFloat(m.price), 0)
  const subtotal       = designPrice + materialsTotal
  const taxAmount      = subtotal * 0.15
  const total          = subtotal + taxAmount

  const handleSubmit = async () => {
    if (!address) return alert('أدخل عنوان التوصيل')
    setSubmitting(true)
    try {
      const res = await API.post('/orders/create/', {
        design_id: design?.id || 1,
        quantity,
        address,
        materials: selectedMaterials.map(m => ({ material_id: m.id, quantity: 1 }))
      })
      setInvoice(res.data.invoice)
      setStep(2)
    } catch {
      // عرض فاتورة تجريبية
      setInvoice({
        invoice_number: 'INV-DEMO1234',
        date:           new Date().toLocaleDateString('ar-SA'),
        customer:       'الزبون',
        email:          'customer@email.com',
        design:         design?.title || 'تصميم',
        quantity,
        design_price:   designPrice,
        materials:      selectedMaterials.map(m => ({ name: m.name, category: m.category, price: m.price, quantity: 1, subtotal: m.price })),
        subtotal,
        tax_percent:    15,
        tax_amount:     taxAmount,
        total,
        notes:          '',
      })
      setStep(2)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="page-center"><div className="spinner" /></div>

  return (
    <div style={styles.page}>
      {step === 1 ? (
        <>
          <div style={styles.header}>
            <h1 style={styles.title}>خصّص طلبك</h1>
            {design && <p style={styles.sub}>التصميم: <strong>{design.title}</strong></p>}
          </div>

          <div style={styles.layout}>
            {/* جانب الاختيار */}
            <div style={styles.left}>

              {/* الكمية */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>📦 الكمية</h3>
                <div style={styles.qtyRow}>
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} style={styles.qtyBtn}>−</button>
                  <span style={styles.qtyNum}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} style={styles.qtyBtn}>+</button>
                </div>
              </div>

              {/* فئات المواد */}
              {categories.map(cat => (
                <div key={cat.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{cat.icon} {cat.name}</h3>
                  {cat.description && <p style={styles.cardDesc}>{cat.description}</p>}
                  <div style={styles.materialsGrid}>
                    {cat.materials.map(m => (
                      <div
                        key={m.id}
                        onClick={() => handleSelect(cat.id, { ...m, category: cat.name })}
                        style={{
                          ...styles.materialCard,
                          background: selected[cat.id]?.id === m.id ? '#0a0a0a' : '#f5f0e8',
                          color:      selected[cat.id]?.id === m.id ? '#fff'    : '#333',
                        }}
                      >
                        {m.image && (
                          <img src={m.image} alt={m.name} style={styles.materialImg} />
                        )}
                        <p style={styles.materialName}>{m.name}</p>
                        {m.description && <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{m.description}</p>}
                        <p style={{ ...styles.materialPrice, color: selected[cat.id]?.id === m.id ? '#e8d5a3' : '#c9a84c' }}>
                          {m.price} ر.س
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* العنوان */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>📍 عنوان التوصيل</h3>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="المدينة، الحي، الشارع، رقم المبنى..."
                  className="input"
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>

            {/* الملخص الجانبي */}
            <div style={styles.right}>
              <div style={{ ...styles.card, position: 'sticky', top: 20 }}>
                <h3 style={styles.cardTitle}>📋 ملخص الطلب</h3>

                <div style={styles.summaryRow}>
                  <span>سعر التصميم × {quantity}</span>
                  <span>{designPrice} ر.س</span>
                </div>

                {selectedMaterials.length > 0 && (
                  <>
                    <p style={{ fontSize: 12, color: '#aaa', margin: '12px 0 8px' }}>المواد المختارة:</p>
                    {selectedMaterials.map((m, i) => (
                      <div key={i} style={styles.summaryRow}>
                        <span style={{ fontSize: 13 }}>{m.name}</span>
                        <span style={{ fontSize: 13 }}>{m.price} ر.س</span>
                      </div>
                    ))}
                  </>
                )}

                <div style={styles.divider} />
                <div style={styles.summaryRow}><span>المجموع</span><span>{subtotal.toFixed(2)} ر.س</span></div>
                <div style={styles.summaryRow}><span>ضريبة 15%</span><span>{taxAmount.toFixed(2)} ر.س</span></div>
                <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                  <span>الإجمالي</span>
                  <span style={{ color: '#c9a84c' }}>{total.toFixed(2)} ر.س</span>
                </div>

                <button
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: 14, marginTop: 20, fontSize: 16 }}
                  disabled={submitting || !address}
                >
                  {submitting ? 'جاري الإرسال...' : '✅ تأكيد الطلب'}
                </button>
                <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 10 }}>
                  ستصلك الفاتورة على إيميلك فور التأكيد
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <InvoiceView invoice={invoice} onNewOrder={() => navigate('/designs')} />
      )}
    </div>
  )
}

// ===== صفحة الفاتورة =====
function InvoiceView({ invoice, onNewOrder }) {
  const handlePrint = () => window.print()

  return (
    <div style={invoiceStyles.page}>
      <div style={invoiceStyles.card} id="invoice-print">

        {/* رأس الفاتورة */}
        <div style={invoiceStyles.header}>
          <div>
            <h1 style={invoiceStyles.logo}>👗 Fashion AI</h1>
            <p style={invoiceStyles.logoSub}>تصميم ملابس بالذكاء الاصطناعي</p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={invoiceStyles.invoiceTitle}>فاتورة ضريبية</h2>
            <p style={invoiceStyles.invoiceNum}>#{invoice.invoice_number}</p>
            <p style={invoiceStyles.invoiceDate}>{invoice.date}</p>
          </div>
        </div>

        {/* بيانات الزبون */}
        <div style={invoiceStyles.customerBox}>
          <div>
            <p style={invoiceStyles.label}>الزبون</p>
            <p style={invoiceStyles.value}>{invoice.customer}</p>
          </div>
          <div>
            <p style={invoiceStyles.label}>البريد الإلكتروني</p>
            <p style={invoiceStyles.value}>{invoice.email}</p>
          </div>
          <div>
            <p style={invoiceStyles.label}>التاريخ</p>
            <p style={invoiceStyles.value}>{invoice.date}</p>
          </div>
        </div>

        {/* جدول الطلب */}
        <table style={invoiceStyles.table}>
          <thead>
            <tr style={invoiceStyles.thead}>
              <th style={invoiceStyles.th}>البند</th>
              <th style={invoiceStyles.th}>النوع</th>
              <th style={invoiceStyles.th}>الكمية</th>
              <th style={invoiceStyles.th}>السعر</th>
              <th style={invoiceStyles.th}>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {/* التصميم */}
            <tr style={invoiceStyles.tr}>
              <td style={invoiceStyles.td}>{invoice.design}</td>
              <td style={invoiceStyles.td}>تصميم</td>
              <td style={invoiceStyles.td}>{invoice.quantity}</td>
              <td style={invoiceStyles.td}>{invoice.design_price / invoice.quantity} ر.س</td>
              <td style={invoiceStyles.td}>{invoice.design_price} ر.س</td>
            </tr>
            {/* المواد */}
            {invoice.materials?.map((m, i) => (
              <tr key={i} style={invoiceStyles.tr}>
                <td style={invoiceStyles.td}>{m.name}</td>
                <td style={invoiceStyles.td}>{m.category}</td>
                <td style={invoiceStyles.td}>{m.quantity}</td>
                <td style={invoiceStyles.td}>{m.price} ر.س</td>
                <td style={invoiceStyles.td}>{m.subtotal} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* الإجماليات */}
        <div style={invoiceStyles.totals}>
          <div style={invoiceStyles.totalRow}><span>المجموع قبل الضريبة</span><span>{invoice.subtotal} ر.س</span></div>
          <div style={invoiceStyles.totalRow}><span>ضريبة القيمة المضافة ({invoice.tax_percent}%)</span><span>{invoice.tax_amount} ر.س</span></div>
          <div style={{ ...invoiceStyles.totalRow, ...invoiceStyles.grandTotal }}>
            <span>الإجمالي الكلي</span>
            <span>{invoice.total} ر.س</span>
          </div>
        </div>

        {/* ملاحظات */}
        {invoice.notes && (
          <div style={invoiceStyles.notes}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>ملاحظات:</p>
            <p>{invoice.notes}</p>
          </div>
        )}

        {/* تذييل */}
        <div style={invoiceStyles.footer}>
          <p>✅ تم إرسال الفاتورة على إيميلك</p>
          <p style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>شكراً لاختيارك Fashion AI</p>
        </div>
      </div>

      {/* أزرار */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
        <button onClick={handlePrint}  className="btn btn-primary" style={{ padding: '12px 32px' }}>🖨️ طباعة الفاتورة</button>
        <button onClick={onNewOrder}   className="btn btn-outline" style={{ padding: '12px 32px' }}>تصفح تصاميم أخرى</button>
      </div>
    </div>
  )
}

// بيانات تجريبية إذا Backend غير شغال
const SAMPLE_CATEGORIES = [
  {
    id: 1, name: 'نوع القماش', icon: '🧵', description: 'اختر نوع القماش المناسب',
    materials: [
      { id: 1, name: 'حرير طبيعي',   price: '150', description: 'ناعم وفاخر' },
      { id: 2, name: 'قطن مصري',     price: '80',  description: 'مريح وخفيف' },
      { id: 3, name: 'كتان فاخر',    price: '120', description: 'مناسب للصيف' },
      { id: 4, name: 'شيفون',        price: '90',  description: 'شفاف وأنيق' },
    ]
  },
  {
    id: 2, name: 'نوع الخيط', icon: '🪡', description: 'اختر نوع الخيط',
    materials: [
      { id: 5, name: 'خيط حرير',   price: '30', description: 'لمعة وأناقة' },
      { id: 6, name: 'خيط قطن',    price: '15', description: 'متين وعملي' },
      { id: 7, name: 'خيط ذهبي',   price: '50', description: 'للتطريز الفاخر' },
    ]
  },
  {
    id: 3, name: 'طريقة الخياطة', icon: '✂️', description: 'اختر طريقة الخياطة',
    materials: [
      { id: 8,  name: 'خياطة يدوية فاخرة', price: '200', description: 'دقة عالية' },
      { id: 9,  name: 'خياطة آلية احترافية', price: '80',  description: 'سرعة وجودة' },
      { id: 10, name: 'خياطة مطرزة',         price: '300', description: 'تطريز يدوي' },
    ]
  },
]

const styles = {
  page:          { padding: '40px 60px', maxWidth: 1200, margin: '0 auto' },
  header:        { marginBottom: 36 },
  title:         { fontFamily: "'Playfair Display',serif", fontSize: 40, marginBottom: 8 },
  sub:           { color: '#888', fontSize: 16 },
  layout:        { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' },
  left:          { display: 'flex', flexDirection: 'column', gap: 20 },
  right:         {},
  card:          { background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  cardTitle:     { fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 16 },
  cardDesc:      { color: '#888', fontSize: 13, marginBottom: 16 },
  qtyRow:        { display: 'flex', alignItems: 'center', gap: 20 },
  qtyBtn:        { width: 40, height: 40, borderRadius: '50%', border: '2px solid #ddd', background: '#fff', fontSize: 20, cursor: 'pointer' },
  qtyNum:        { fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700 },
  materialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12 },
  materialCard:  { padding: 14, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' },
  materialImg:   { width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 },
  materialName:  { fontWeight: 600, fontSize: 14, marginBottom: 4 },
  materialPrice: { fontSize: 15, fontWeight: 700 },
  summaryRow:    { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#555', borderBottom: '1px solid #f5f5f5' },
  totalRow:      { fontSize: 18, fontWeight: 700, borderBottom: 'none', marginTop: 4 },
  divider:       { margin: '12px 0', borderTop: '2px solid #f0f0f0' },
}

const invoiceStyles = {
  page:        { padding: '40px 60px', maxWidth: 800, margin: '0 auto' },
  card:        { background: '#fff', borderRadius: 20, padding: 48, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, paddingBottom: 28, borderBottom: '2px solid #f0f0f0' },
  logo:        { fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 4 },
  logoSub:     { color: '#888', fontSize: 13 },
  invoiceTitle:{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#c9a84c', marginBottom: 4 },
  invoiceNum:  { fontSize: 16, fontWeight: 600 },
  invoiceDate: { color: '#888', fontSize: 13 },
  customerBox: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, background: '#f5f0e8', borderRadius: 14, padding: 20, marginBottom: 28 },
  label:       { fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase' },
  value:       { fontWeight: 600, fontSize: 14 },
  table:       { width: '100%', borderCollapse: 'collapse', marginBottom: 28 },
  thead:       { background: '#0a0a0a' },
  th:          { padding: '12px 16px', color: '#fff', fontSize: 13, fontWeight: 500, textAlign: 'right' },
  tr:          { borderBottom: '1px solid #f0f0f0' },
  td:          { padding: '12px 16px', fontSize: 14, color: '#444' },
  totals:      { background: '#f5f0e8', borderRadius: 14, padding: 20, marginBottom: 20 },
  totalRow:    { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#555' },
  grandTotal:  { fontSize: 20, fontWeight: 700, color: '#0a0a0a', borderTop: '2px solid #c9a84c', marginTop: 8, paddingTop: 12 },
  notes:       { background: '#fff8e1', borderRadius: 10, padding: 16, marginBottom: 20, fontSize: 13, color: '#666' },
  footer:      { textAlign: 'center', paddingTop: 24, borderTop: '1px solid #f0f0f0', color: '#666' },
}