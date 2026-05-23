import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, TrendingUp, DollarSign, Users, AlertCircle, Home, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const APARTMENTS = [
  { id: 1, name: "אליאב אברהם ומירי", target_amount: 32000 },
  { id: 2, name: "ממושיאשווילי מיכאל", target_amount: 32000 },
  { id: 3, name: "מיכלשוילי ננה", target_amount: 32000 },
  { id: 4, name: "שמשון ושלומי טלקר", target_amount: 32000 },
  { id: 5, name: "דירה 5", target_amount: 32000 },
  { id: 6, name: "מירם ברבירו", target_amount: 32000 },
  { id: 7, name: "חן יעקב", target_amount: 32000 },
  { id: 8, name: "יפרח שרה", target_amount: 32000 },
  { id: 9, name: "בטוני אשוילי קחל", target_amount: 32000 },
  { id: 10, name: "מור איציק ורחל", target_amount: 32000 },
  { id: 11, name: "מרציאנו ג'וזף", target_amount: 32000 },
  { id: 12, name: "שוורץ אבי", target_amount: 32000 },
  { id: 13, name: "דליה סלם", target_amount: 32000 },
  { id: 14, name: "רחל נקש", target_amount: 32000 },
  { id: 15, name: "דוד ממן", target_amount: 32000 },
  { id: 16, name: "מנגר אמה", target_amount: 32000 },
  { id: 17, name: "שרון יהודה", target_amount: 32000 },
  { id: 18, name: "אייזנברג שמואל", target_amount: 32000 },
  { id: 19, name: "בן משה", target_amount: 32000 },
  { id: 20, name: "ישראל דרור", target_amount: 32000 },
  { id: 21, name: "דירה 21", target_amount: 32000 },
  { id: 22, name: "דירה 22", target_amount: 32000 },
  { id: 23, name: "דירה 23", target_amount: 32000 },
  { id: 24, name: "דירה 24", target_amount: 32000 },
  { id: 25, name: "דירה 25", target_amount: 32000 },
  { id: 26, name: "דירה 26", target_amount: 32000 },
  { id: 27, name: "דירה 27", target_amount: 32000 },
  { id: 28, name: "דירה 28", target_amount: 32000 },
  { id: 29, name: "דירה 29", target_amount: 32000 },
  { id: 30, name: "דירה 30", target_amount: 32000 },
  { id: 31, name: "דירה 31", target_amount: 32000 },
  { id: 32, name: "דירה 32", target_amount: 32000 },
  { id: 33, name: "דירה 33", target_amount: 32000 },
  { id: 34, name: "דירה 34", target_amount: 32000 },
  { id: 35, name: "דירה 35", target_amount: 32000 },
  { id: 36, name: "דירה 36", target_amount: 32000 },
  { id: 37, name: "דירה 37", target_amount: 32000 },
  { id: 38, name: "דירה 38", target_amount: 32000 },
  { id: 39, name: "דירה 39", target_amount: 32000 },
  { id: 40, name: "דירה 40", target_amount: 32000 },
  { id: 41, name: "דירה 41", target_amount: 32000 },
  { id: 42, name: "דירה 42", target_amount: 32000 },
  { id: 43, name: "דירה 43", target_amount: 32000 },
  { id: 44, name: "דירה 44", target_amount: 32000 },
  { id: 45, name: "דירה 45", target_amount: 32000 },
  { id: 46, name: "דירה 46", target_amount: 32000 },
  { id: 47, name: "דירה 47", target_amount: 32000 },
  { id: 48, name: "דירה 48", target_amount: 32000 },
  { id: 49, name: "דירה 49", target_amount: 32000 },
  { id: 50, name: "דירה 50", target_amount: 32000 },
  { id: 51, name: "דירה 51", target_amount: 32000 },
  { id: 52, name: "דירה 52", target_amount: 32000 },
  { id: 53, name: "דירה 53", target_amount: 32000 },
  { id: 54, name: "דירה 54", target_amount: 32000 },
  { id: 55, name: "דירה 55", target_amount: 32000 },
];

const INIT_PAYMENTS = [
  { id: 1, apartment_id: 1, amount: 5000, date: '2024-01-15', receipt_number: '001' },
  { id: 2, apartment_id: 2, amount: 8000, date: '2024-01-20', receipt_number: '002' },
];

const INIT_EXPENSES = [
  { id: 1, description: 'תיקון גג', amount: 15000, date: '2024-01-10', receipt_number: 'INV-001' },
  { id: 2, description: 'חומרי בנייה', amount: 8000, date: '2024-01-15', receipt_number: 'INV-002' },
];

const INIT_DEPOSITS = [
  { id: 1, apartment_id: 1, amount: 5000, date: '2024-01-05', type: 'in' },
  { id: 2, apartment_id: 2, amount: 8000, date: '2024-01-08', type: 'in' },
];

const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`Failed to save ${key} to localStorage`);
  }
};

const calcBalance = (apartmentId) => {
  const payments = loadFromStorage('payments', INIT_PAYMENTS);
  const deposits = loadFromStorage('deposits', INIT_DEPOSITS);

  const apt = APARTMENTS.find(a => a.id === apartmentId);
  if (!apt) return { paid: 0, target: 0, remaining: 0, percent: 0 };

  const paid = payments
    .filter(p => p.apartment_id === apartmentId)
    .reduce((s, p) => s + p.amount, 0);

  const depositIn = deposits
    .filter(d => d.apartment_id === apartmentId && d.type === 'in')
    .reduce((s, d) => s + d.amount, 0);

  const depositOut = deposits
    .filter(d => d.apartment_id === apartmentId && d.type === 'out')
    .reduce((s, d) => s + d.amount, 0);

  const total = paid + depositIn - depositOut;
  const remaining = Math.max(0, apt.target_amount - total);
  const percent = (total / apt.target_amount) * 100;

  return {
    paid: total,
    target: apt.target_amount,
    remaining,
    percent: Math.min(100, percent)
  };
};

const fmt = (num) => new Intl.NumberFormat('he-IL').format(Math.round(num));
const fmtDate = (dateStr) => new Date(dateStr).toLocaleDateString('he-IL');

export default function App() {
  const [mode, setMode] = useState('home');
  const [search, setSearch] = useState('');
  const [selectedApt, setSelectedApt] = useState(null);

  const [payments, setPayments] = useState(() => loadFromStorage('payments', INIT_PAYMENTS));
  const [expenses, setExpenses] = useState(() => loadFromStorage('expenses', INIT_EXPENSES));
  const [deposits, setDeposits] = useState(() => loadFromStorage('deposits', INIT_DEPOSITS));
  const [specialIncome, setSpecialIncome] = useState(() => loadFromStorage('specialIncome', []));

  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const ADMIN_PASSWORD = 'Nikolay1973#';

  useEffect(() => { saveToStorage('payments', payments); }, [payments]);
  useEffect(() => { saveToStorage('expenses', expenses); }, [expenses]);
  useEffect(() => { saveToStorage('deposits', deposits); }, [deposits]);
  useEffect(() => { saveToStorage('specialIncome', specialIncome); }, [specialIncome]);

  const stats = {
    totalPaid: payments.reduce((s, p) => s + p.amount, 0),
    totalExpenses: expenses.reduce((s, e) => s + e.amount, 0),
    depositBalance: deposits.reduce((s, d) => s + (d.type === 'in' ? d.amount : -d.amount), 0),
  };

  if (mode === 'home') {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Segoe UI', Arial, sans-serif", direction: 'rtl' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a3c6e 0%, #2563a8 100%)', padding: '0', boxShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '36px' }}>🏢</div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>ניהול תקציב הבניין</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>פרויקט שיפוץ – ניהול תשלומים והוצאות</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '50px', padding: '6px 16px', fontSize: '13px', color: 'white', fontWeight: '600' }}>
              55 דירות
            </div>
          </div>
        </div>

        <div style={{ background: '#1a3c6e', paddingBottom: '32px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                { label: 'סכום שנאסף', value: `₪${fmt(stats.totalPaid)}`, icon: '💰', color: '#4ade80' },
                { label: 'פיקדון', value: `₪${fmt(stats.depositBalance)}`, icon: '🏦', color: '#60a5fa' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginBottom: '4px', letterSpacing: '0.5px' }}>{s.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '32px 24px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid transparent', transition: 'all 0.2s', textAlign: 'center' }} onClick={() => setMode('resident')}>
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px' }}>👤</div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1a3c6e', margin: '0 0 10px 0' }}>דייר</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0', lineHeight: '1.6' }}>בדוק את מצב התשלום שלך והיסטוריית הפקדות</p>
              <div style={{ background: 'linear-gradient(135deg, #1a3c6e, #2563a8)', color: 'white', padding: '12px 24px', borderRadius: '50px', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>כניסה כדייר →</div>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '32px 24px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid transparent', transition: 'all 0.2s', textAlign: 'center' }} onClick={() => setShowAdminPasswordModal(true)}>
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px' }}>⚙️</div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1a3c6e', margin: '0 0 10px 0' }}>ניהול</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0', lineHeight: '1.6' }}>ניהול תשלומים, הוצאות ופיקדון</p>
              <div style={{ background: 'linear-gradient(135deg, #166534, #16a34a)', color: 'white', padding: '12px 24px', borderRadius: '50px', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>כניסה לניהול →</div>
            </div>
          </div>

          {showAdminPasswordModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '400px', width: '90%' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#222', marginBottom: '8px', textAlign: 'center' }}>🔐 כניסה לדף הניהול</h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', textAlign: 'center' }}>הזן סיסמה כדי להמשיך</p>

                <input
                  type="password"
                  placeholder="הזן סיסמה..."
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (adminPasswordInput === ADMIN_PASSWORD) {
                        setAdminAuthenticated(true);
                        setMode('admin');
                        setShowAdminPasswordModal(false);
                        setAdminPasswordInput('');
                      } else {
                        alert('❌ סיסמה לא נכונה');
                        setAdminPasswordInput('');
                      }
                    }
                  }}
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #c5cae9', borderRadius: '12px', fontSize: '16px', outline: 'none', marginBottom: '20px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setShowAdminPasswordModal(false);
                      setAdminPasswordInput('');
                    }}
                    style={{ flex: 1, padding: '12px 24px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
                  >
                    ביטול
                  </button>
                  <button
                    onClick={() => {
                      if (adminPasswordInput === ADMIN_PASSWORD) {
                        setAdminAuthenticated(true);
                        setMode('admin');
                        setShowAdminPasswordModal(false);
                        setAdminPasswordInput('');
                      } else {
                        alert('❌ סיסמה לא נכונה');
                        setAdminPasswordInput('');
                      }
                    }}
                    style={{ flex: 1, padding: '12px 24px', background: 'linear-gradient(135deg, #166534, #16a34a)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
                  >
                    כניסה
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'resident') {
    const bal = selectedApt ? calcBalance(selectedApt) : null;
    const aptPayments = selectedApt ? payments.filter(p => p.apartment_id === selectedApt).sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
    const apt = selectedApt ? APARTMENTS.find(a => a.id === selectedApt) : null;

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', padding: '40px 20px' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.95)', border: '2px solid white', color: '#283593', padding: '10px 24px', borderRadius: '50px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginBottom: '32px', position: 'sticky', top: '40px', zIndex: '100', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} onClick={() => setMode('home')}><Home size={18} /> חזור לדף הבית</button>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#283593', marginBottom: '32px', textAlign: 'center' }}>🏠 חפש את דירתך</h1>

          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '12px' }}>מספר דירה (1–55)</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input style={{ flex: 1, padding: '14px 20px', border: '2px solid #c5cae9', borderRadius: '14px', fontSize: '16px', fontWeight: '600', outline: 'none', fontFamily: 'inherit' }} type="number" min="1" max="55" value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setSelectedApt(APARTMENTS.find(a => a.id === +search) ? +search : null)}
                placeholder="הזן מספר דירה..." />
              <button style={{ background: 'linear-gradient(135deg, #5c6bc0, #3f51b5)', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setSelectedApt(APARTMENTS.find(a => a.id === parseInt(search)) ? parseInt(search) : null)}>
                <Search size={20} /> חפש
              </button>
            </div>
          </div>

          {search && !selectedApt && (
            <div style={{ background: '#ffebee', border: '2px solid #ef9a9a', borderRadius: '16px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <AlertCircle size={24} color="#c62828" />
              <div>
                <div style={{ fontWeight: '700', color: '#b71c1c' }}>דירה לא נמצאה</div>
                <div style={{ color: '#c62828' }}>בדוק את המספר ונסה שוב (1–55)</div>
              </div>
            </div>
          )}

          {bal && apt && (
            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
              <div style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '24px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1a3c6e', margin: '0 0 8px 0' }}>דירה מספר {selectedApt}</h2>
                <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>{apt.name}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#333' }}>סטטוס תשלום</span>
                <span style={{ background: bal.remaining <= 0 ? '#e8f5e9' : '#fff3e0', color: bal.remaining <= 0 ? '#2e7d32' : '#e65100', padding: '8px 20px', borderRadius: '50px', fontWeight: '800', fontSize: '16px' }}>
                  {bal.remaining <= 0 ? '✅ שולם במלואו' : `⚠️ נותר ₪${fmt(bal.remaining)}`}
                </span>
              </div>

              <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '50px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${bal.percent}%`, background: 'linear-gradient(90deg, #42a5f5, #5c6bc0)', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px' }}>
                  {bal.percent > 15 && <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>{Math.round(bal.percent)}%</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f1f8e9', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>שולם</div>
                  <p style={{ fontSize: '20px', fontWeight: '800', color: '#2e7d32', margin: 0 }}>₪{fmt(bal.paid)}</p>
                </div>
                <div style={{ background: '#e3f2fd', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>נדרש</div>
                  <p style={{ fontSize: '20px', fontWeight: '800', color: '#1565c0', margin: 0 }}>₪{fmt(bal.target)}</p>
                </div>
                <div style={{ background: '#fff8e1', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>נותר</div>
                  <p style={{ fontSize: '20px', fontWeight: '800', color: bal.remaining <= 0 ? '#2e7d32' : '#e65100', margin: 0 }}>₪{fmt(Math.max(0, bal.remaining))}</p>
                </div>
              </div>

              {aptPayments.length > 0 && (
                <>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#333', marginBottom: '16px' }}>🧾 היסטוריית תשלומים ({aptPayments.length})</h3>
                  {aptPayments.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', borderRight: '4px solid #42a5f5' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#333' }}>{fmtDate(p.date)}</div>
                        {p.receipt_number && <div style={{ fontSize: '13px', color: '#888' }}>אסמכתה: {p.receipt_number}</div>}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#2e7d32' }}>+₪{fmt(p.amount)}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!adminAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Segoe UI', Arial, sans-serif", direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔐</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#222', marginBottom: '12px' }}>גישה מוגבלת</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>אתה לא מחובר כמנהל. אנא חזור לדף הבית וקיים כניסה מחדש.</p>
          <button
            onClick={() => setMode('home')}
            style={{ background: 'linear-gradient(135deg, #1a3c6e, #2563a8)', color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
          >
            ← חזור לדף הבית
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Segoe UI', Arial, sans-serif", direction: 'rtl' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', color: 'white', padding: '10px 24px', borderRadius: '50px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginBottom: '32px', position: 'sticky', top: '40px', zIndex: '100' }} onClick={() => { setAdminAuthenticated(false); setMode('home'); }}><Home size={18} /> חזור לדף הבית</button>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a3c6e', marginBottom: '32px' }}>⚙️ דף ניהול</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>סכום שנאסף</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>₪{fmt(stats.totalPaid)}</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>פיקדון</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>₪{fmt(stats.depositBalance)}</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f87171, #ef4444)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>הוצאות</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>₪{fmt(stats.totalExpenses)}</div>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>ברוכה הבאה לדף הניהול!</p>
      </div>
    </div>
  );
}
